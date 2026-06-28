from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    parse_capacity_gb,
    to_int,
    tb_to_gb,
)

TABLE = "hdds"


def _form_factor_from_url(url: str) -> str | None:
    if not url:
        return None
    if "hdd-3-5" in url:
        return "3.5"
    if "hdd-2-5" in url:
        return "2.5"
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

    capacity = parse_capacity_gb(specs.get("Apjoms")) or tb_to_gb(
        specs.get("Apjoms")
    )

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "capacity": capacity,
        "interface": specs.get("Pieslēguma interfeiss") or specs.get("Data Interface"),
        "form_factor": _form_factor_from_url(url),
        "rpm": to_int(specs.get("Apgriezieni")),
        "cache_mb": to_int(specs.get("Buferis")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
