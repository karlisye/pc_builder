import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "rams"


def _parse_kit(value: str) -> int | None:
    if not value:
        return None
    match = re.search(r"\d+", value)
    return int(match.group()) if match else 1


def parse(html, dateks_id, url, price, stock_status, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "stock_status": stock_status,
        "stock_quantity": stock_quantity,
        "memory_type": specs.get("Type"),
        "capacity": to_int(specs.get("Capacity")),
        "frequency": to_int(specs.get("Maximum frequency")),
        "cl_latency": to_int(specs.get("CL")),
        "modules_count": _parse_kit(specs.get("KIT")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
