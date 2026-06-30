import re
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

# multi-drive listings (e.g. "Seagate 2TB ... 2 Pack") break per-drive specs
# and aren't useful for a single-drive PC builder, so skip them entirely
_PACK_RE = re.compile(r"\b(\d+)\s*[- ]?pack\b", re.IGNORECASE)


def _is_multi_pack(name: str) -> bool:
    if not name:
        return False
    match = _PACK_RE.search(name)
    return bool(match) and int(match.group(1)) > 1


def _parse_cache_mb(value: str) -> int | None:
    if not value:
        return None
    v = value.strip()
    if v.lower() in ("nav", "nav norādīts", ""):
        return None
    match = re.search(r"([\d.]+)\s*(GB|MB)", v, re.IGNORECASE)
    if match:
        num = float(match.group(1))
        return int(num * 1024) if match.group(2).upper() == "GB" else int(num)
    return to_int(v)


def _parse_rpm(specs: dict, original: dict) -> int | None:
    rpm = to_int(specs.get("Apgriezieni"))
    if rpm is not None:
        return rpm
    for key in (
        "Features - HDD speed",
        "Rotational Speed",
        "Hard drive > Hard drive speed",
    ):
        rpm = to_int(original.get(key))
        if rpm is not None:
            return rpm
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

    if _is_multi_pack(name):
        return None

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
        "rpm": _parse_rpm(specs, original),
        "cache_mb": _parse_cache_mb(specs.get("Buferis")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
