import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_section_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    to_int,
    to_float,
    to_bool,
)

TABLE = "rams"


def _parse_kit(value: str) -> int | None:
    if not value:
        return None
    if "single" in value.lower():
        return 1
    match = re.search(r"\d+", value)
    return int(match.group()) if match else 1


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

    basic_section = extract_section_specs(soup, "Pamatinformācija")

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "memory_type": basic_section.get("Atmiņas tips") or specs.get("Type"),
        "capacity": to_int(basic_section.get("Apjoms") or specs.get("Capacity")),
        "frequency": to_int(
            basic_section.get("Maksimālā takts frekvence")
            or specs.get("Maximum frequency")
        ),
        "cl_latency": to_int(basic_section.get("CL") or specs.get("CL")),
        "modules_count": _parse_kit(basic_section.get("KIT") or specs.get("KIT")),
        "voltage": original.get("Features - Memory voltage"),
        "xmp": to_bool(
            original.get("Features - Intel Extreme Memory Profile (XMP)")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
