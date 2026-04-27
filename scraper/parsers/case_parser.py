import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int

TABLE = "cases"

def _parse_psu_wattage(value: str) -> int:
    if not value:
        return 0
    v = value.strip().lower()
    if v in ("nav", "no", "not", ""):
        return 0
    match = re.search(r'\d+', value)
    if match:
        return int(match.group())
    return 0


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "form_factor": specs.get("Form factor"),
        "max_gpu_length": to_int(specs.get("Max. Video card length, mm")),
        "max_cpu_cooler_height": to_int(specs.get("Max. CPU cooler height, mm")),
        "bays_25": to_int(specs.get('2.5" internal HDD/SSD bays')),
        "bays_35": to_int(specs.get('3.5" internal HDD bays')),
        "psu_wattage": _parse_psu_wattage(specs.get("PSU")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
