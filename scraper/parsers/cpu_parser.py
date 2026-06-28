import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    to_bool,
    to_int,
    to_float,
)

TABLE = "cpus"


def _normalise_socket(value: str) -> str | None:
    if not value:
        return None
    s = value.strip()
    s = re.sub(r"^[Ss]ocket\s+", "", s)
    s = s.replace(" ", "")
    return s or None


def _parse_integrated_graphics(value: str) -> bool | None:
    if value is None:
        return False
    if value.strip().lower() in ("nav", "no", "not", "nav norādīts", ""):
        return False
    return True if value.strip() else None


def _memory_types_from_original(soup) -> str | None:
    # "Memory - Memory types supported by processor" can repeat (one line per
    # supported type, e.g. DDR4-SDRAM and DDR5-SDRAM); extract_original's
    # first-occurrence dict would only keep one, so re-scan the raw lines here
    div = soup.select_one("div.specs div.original")
    if not div:
        return None
    for br in div.find_all("br"):
        br.replace_with("\n")
    types = []
    for line in div.get_text().split("\n"):
        line = line.strip()
        if not line or " - " not in line:
            continue
        key, _, value = line.rpartition(" - ")
        if key.strip() == "Memory - Memory types supported by processor":
            value = value.strip().removesuffix("-SDRAM")
            if value and value not in types:
                types.append(value)
    return "/".join(types) if types else None


def _parse_memory_type(soup, original: dict) -> str | None:
    direct = original.get("Memory Types")
    if direct:
        return direct
    return _memory_types_from_original(soup)


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

    perf_cores = to_int(specs.get("Performance kodolu skaits"))
    eff_cores = to_int(specs.get("Efficient kodolu skaits"))
    amd_cores = to_int(specs.get("Kodolu skaits"))

    if perf_cores is not None:
        total_cores = (perf_cores or 0) + (eff_cores or 0)
    else:
        total_cores = amd_cores

    passmark_raw = specs.get("Veiktspēja (PassMark)", "")
    passmark = to_int(passmark_raw.replace("+", "")) if passmark_raw else None

    tdp = to_int(specs.get("TDP") or specs.get("Thermal Design Power"))

    cooler_included = to_bool(specs.get("Komplektā dzesētājs"))

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "socket": _normalise_socket(specs.get("Socket") or specs.get("Procesora ligzda")),
        "cores": total_cores,
        "threads": to_int(specs.get("Threads")),
        "clock_rate": to_float(specs.get("Takts frekvence")),
        "turbo_frequency": to_float(specs.get("Turbo frekvence")),
        "tdp": tdp,
        "integrated_graphics": _parse_integrated_graphics(
            specs.get("Integrēta videokarte")
        ),
        "cooler_included": cooler_included,
        "passmark": passmark,
        "memory_type": _parse_memory_type(soup, original),
        "pcie_version": to_float(
            original.get("Features - PCI Express slots version")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
