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


def _parse_compatibility(value: str) -> str | None:
    if not value:
        return None
    parts = re.split(r"[,/]", value)
    cleaned = []
    for part in parts:
        s = re.sub(r"^[Ss]ocket\s+", "", part.strip())
        s = s.replace(" ", "").strip()
        if s:
            cleaned.append(s)
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
    override_compat = original.get("Performance - Supported processor sockets")
    if override_compat:
        compatibility = _parse_compatibility(override_compat)

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
