import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int, to_float,
)

TABLE = "ram"


def _parse_modules_count(value: str) -> int | None:
    """Parse module count from layout strings.
    'Memory Modules Quantity' → plain int e.g. '2'
    'Memory Memory layout (modules x size)' → '2 x 8 GB' → 2
    """
    if not value:
        return None
    # Try "N x ..." format first
    match = re.match(r'(\d+)\s*[xX×]', value.strip())
    if match:
        return int(match.group(1))
    return to_int(value)


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    modules_raw = (
        extra.get("Memory Modules Quantity")
        or extra.get("Memory Memory layout (modules x size)")
    )

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": extra.get("Brand"),
        "memory_type": specs.get("Type"),
        "capacity": to_int(specs.get("Capacity")),
        "frequency": to_int(specs.get("Maximum frequency")),
        "cl_latency": to_int(specs.get("CL")),
        "modules_count": _parse_modules_count(modules_raw),
        "voltage": to_float(
            extra.get("Features - Memory voltage")
            or extra.get("Maximum Supply Voltage")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
