import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "ram"


def _parse_kit(value: str) -> int | None:
    """Extract module count from KIT string.
    'Kit of 2 modules' → 2
    'Kit of 4 modules' → 4
    '1 module'         → 1
    """
    if not value:
        return None
    match = re.search(r'\d+', value)
    return int(match.group()) if match else None


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id":    dateks_id,
        "url":          url,
        "name":         extract_name(soup),
        "price":        price,
        "in_stock":     in_stock,
        "stock_quantity": stock_quantity,
        "memory_type":  specs.get("Type"),                          # "DDR5", "DDR4"
        "capacity":     to_int(specs.get("Capacity")),              # "64 GB" → 64
        "frequency":    to_int(specs.get("Maximum frequency")),     # "5600 MHz" → 5600
        "cl_latency":   to_int(specs.get("CL")),                    # "CL 40" → 40
        "modules_count": _parse_kit(specs.get("KIT")),              # "Kit of 2 modules" → 2
        "scraped_at":   scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
