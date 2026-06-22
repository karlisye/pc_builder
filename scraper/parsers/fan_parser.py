from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "fans"


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
        "size_mm": to_int(specs.get("Size, mm")),
        "connector": specs.get("Output Interface"),
        "rpm_max": to_int(specs.get("RPM (MAX), rpm")),
        "units_in_package": to_int(specs.get("Units in package")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
