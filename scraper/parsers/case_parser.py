from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_bool, to_int, parse_supported_form_factors,
)

TABLE = "cases"


def _cm_to_mm(value: str) -> int | None:
    """Convert a length value to mm. Multiplies by 10 if unit is cm."""
    if not value:
        return None
    v = value.strip().upper()
    num = to_int(v)
    if num is None:
        return None
    if "CM" in v:
        return num * 10
    return num


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": extra.get("Producer") or extra.get("Brand"),
        "form_factor": specs.get("Form factor"),
        # Duplicate keys in extra — must use dedicated parser
        "supported_form_factors": parse_supported_form_factors(soup),
        "max_gpu_length": to_int(specs.get("Max. Video card length, mm")),
        "max_cpu_cooler_height": to_int(specs.get("Max. CPU cooler height, mm")),
        "max_radiator_size": to_int(specs.get("Max. radiator size, mm")),
        "max_psu_length": _cm_to_mm(extra.get("Design - Maximum PSU length")),
        "bays_25": to_int(specs.get('2.5" internal HDD/SSD bays')),
        "bays_35": to_int(specs.get('3.5" internal HDD bays')),
        "psu_included": to_bool(specs.get("PSU")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
