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

TABLE = "fans"


def _noise_max_db_from_original(soup) -> float | None:
    # fallback for products where #params never got either spelling of the
    # "Trošņa/Trokšņa līmenis (MAX), dB(A)" key -- match on line content so
    # it doesn't matter whether the line is "Section - Key - Value" or
    # "Key Section - Value"
    div = soup.select_one("div.specs div.original")
    if not div:
        return None
    for br in div.find_all("br"):
        br.replace_with("\n")
    for line in div.get_text().split("\n"):
        line = line.strip()
        if "noise level (max)" in line.lower():
            match = re.search(r"([\d.]+)\s*dB", line, re.IGNORECASE)
            if match:
                return float(match.group(1))
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

    rpm_min = to_int(
        original.get("Rotational speed (min) Performance")
        or original.get("Performance - Fan speed (min)")
    )

    noise_max_db = to_float(
        specs.get("Trošņa līmenis (MAX), dB(A)")
        or specs.get("Trokšņa līmenis (MAX), dB(A)")
    )
    if noise_max_db is None:
        noise_max_db = _noise_max_db_from_original(soup)

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
        "noise_max_db": noise_max_db,
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
