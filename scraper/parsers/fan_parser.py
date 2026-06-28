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

TABLE = "fans"


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

    rpm_min = to_int(
        original.get("Rotational speed (min) Performance")
        or original.get("Performance - Fan speed (min)")
    )

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "size_mm": to_int(specs.get("Izmērs, mm") or specs.get("Size, mm")),
        "connector": specs.get("Savienojums") or specs.get("Output Interface"),
        "rpm_max": to_int(specs.get("Apgriezieni (MAX), rpm") or specs.get("RPM (MAX), rpm")),
        "rpm_min": rpm_min,
        "units_in_package": to_int(specs.get("Skaits iepakojumā") or specs.get("Units in package")),
        "rgb_type": specs.get("Apgaismojuma veids"),
        "led_color": specs.get("LED izgaismojuma krāsa"),
        "noise_max_db": to_float(specs.get("Trošņa līmenis (MAX), dB(A)")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
