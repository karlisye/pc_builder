import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    to_int,
    to_float,
)

TABLE = "coolers"


def _clean_socket_token(value: str) -> str | None:
    if not value:
        return None
    s = value.strip()
    # drop trailing alias like "LGA 775 (Socket T)" -> "LGA 775"
    s = re.sub(r"\s*\(Socket\s+\w+\)\s*$", "", s, flags=re.IGNORECASE)
    s = re.sub(r"^[Ss]ocket\s+", "", s)
    s = s.replace(" ", "").strip()
    # some listings concatenate "Socket"/vendor name directly onto the socket
    # with no separator, e.g. "IntelLGA1851" -> "LGA1851", "SocketAM5" -> "AM5"
    s = re.sub(r"^(Intel|AMD|Socket)(?=[A-Z0-9])", "", s, flags=re.IGNORECASE)
    return s or None


def _parse_compatibility(value: str) -> str | None:
    if not value:
        return None
    parts = re.split(r"[,/]", value)
    cleaned = []
    for part in parts:
        token = _clean_socket_token(part)
        if token:
            cleaned.append(token)
    return ",".join(cleaned) if cleaned else None


def _all_original_values(soup, key: str) -> list[str]:
    # extract_original() keeps only the first occurrence of a repeated key,
    # which silently drops data for keys like "Performance - Supported
    # processor sockets" that repeat once per socket -- re-scan the raw
    # lines here so every value is collected
    div = soup.select_one("div.specs div.original")
    if not div:
        return []
    for br in div.find_all("br"):
        br.replace_with("\n")
    values = []
    for line in div.get_text().split("\n"):
        line = line.strip()
        if not line or " - " not in line:
            continue
        line_key, _, line_value = line.rpartition(" - ")
        if line_key.strip() == key:
            values.append(line_value.strip())
    return values


def _compatibility_override(soup) -> str | None:
    cleaned = []
    for raw in _all_original_values(soup, "Performance - Supported processor sockets"):
        # a single line can itself list multiple comma-separated sockets,
        # e.g. "Socket AM4, Socket AM5"
        for part in re.split(r"[,/]", raw):
            token = _clean_socket_token(part)
            if token and token not in cleaned:
                cleaned.append(token)
    return ",".join(cleaned) if cleaned else None


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    jsonld = extract_jsonld(soup)
    original = extract_original(soup)
    ean = get_ean(original)
    brand = (jsonld.get("brand") or {}).get("name") if isinstance(jsonld.get("brand"), dict) else None
    image = jsonld.get("image")
    image_url = image[0] if isinstance(image, list) else image
    name = extract_name(soup) or jsonld.get("name")

    tdp_support = to_int(specs.get("Dzesēšanas kapacitāte (TDP), W") or specs.get("Cooling capacity (TDP), W"))
    if tdp_support is None:
        tdp_support = to_int(original.get("Power - Thermal Design Power (TDP)"))

    compatibility = _parse_compatibility(specs.get("Saderība") or specs.get("Compatibility"))
    override_compat = _compatibility_override(soup)
    if override_compat:
        current_count = len(compatibility.split(",")) if compatibility else 0
        override_count = len(override_compat.split(","))
        if override_count > current_count:
            compatibility = override_compat

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "compatibility": compatibility,
        "tdp_support": tdp_support,
        "height_mm": to_int(specs.get("Augstums, mm") or specs.get("Height, mm")),
        "fan_size_mm": to_int(specs.get("Ventilatora izmērs, mm") or specs.get("Fan size, mm")),
        "fan_count": to_int(specs.get("Ventilatoru skaits")),
        "rpm_max": to_int(specs.get("Ventilatora apgriezieni (MAX), rpm")),
        "rpm_min": to_int(specs.get("Ventilatora apgriezieni (MIN), rpm")),
        "connector": specs.get("Savienojums"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
