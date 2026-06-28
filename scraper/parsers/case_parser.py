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
)

TABLE = "cases"


def _parse_psu_wattage(value: str) -> int:
    if not value:
        return 0
    v = value.strip().lower()
    if v in ("nav", "no", "not", ""):
        return 0
    match = re.search(r"\d+", value)
    if match:
        return int(match.group())
    return 0


def _parse_psu_included(value: str) -> bool | None:
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("nav", "no", "not", ""):
        return False
    return True


def _parse_fans_included(value: str) -> int | None:
    return to_int(value)


def _max_psu_length_mm(soup) -> int | None:
    # the "Maximum PSU length" line can use a literal " > " section
    # separator instead of " - " (e.g. "Design > Maximum PSU length - 16.5
    # cm"), which breaks an exact "Section - Key" lookup -- match on line
    # content instead, and use to_float since values can be fractional cm
    div = soup.select_one("div.specs div.original")
    if not div:
        return None
    for br in div.find_all("br"):
        br.replace_with("\n")
    for line in div.get_text().split("\n"):
        line = line.strip()
        if "maximum psu length" in line.lower():
            match = re.search(r"([\d.]+)\s*cm", line, re.IGNORECASE)
            if match:
                return int(float(match.group(1)) * 10)
    return None


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

    max_psu_length = _max_psu_length_mm(soup)

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "form_factor": specs.get("Formfaktors") or specs.get("Form factor"),
        "max_gpu_length": to_int(
            specs.get("Maks. videokartes garums, mm") or specs.get("Max. Video card length, mm")
        ),
        "max_cpu_cooler_height": to_int(
            specs.get("Maks. CPU dzesētāja augstums, mm") or specs.get("Max. CPU cooler height, mm")
        ),
        "bays_25": to_int(specs.get('Iekšējās 2.5" nišas') or specs.get('2.5" internal HDD/SSD bays')),
        "bays_35": to_int(specs.get('Iekšējās 3.5" nišas') or specs.get('3.5" internal HDD bays')),
        "psu_wattage": _parse_psu_wattage(specs.get("Barošanas bloks") or specs.get("PSU")),
        "psu_included": _parse_psu_included(specs.get("Barošanas bloks") or specs.get("PSU")),
        "fans_included": _parse_fans_included(specs.get("Ventilatoru skaits")),
        "max_radiator_size": to_int(specs.get("Maks. radiatora izmērs, mm")),
        "max_psu_length": max_psu_length,
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
