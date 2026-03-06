from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int, to_float,
)

TABLE = "fans"


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    # rpm_min may be absent on the detail page for some fans — expect None
    rpm_min_raw = specs.get("Revolutions (MIN), rpm") or specs.get("Fan speed (MIN), rpm")

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": specs.get("Producer"),
        "size_mm": to_int(specs.get("Size, mm")),
        "connector": specs.get("Output Interface"),
        "rpm_min": to_int(rpm_min_raw),
        "rpm_max": to_int(specs.get("RPM (MAX), rpm")),
        "noise_db": to_float(specs.get("Sound level (MAX), dB(A)")),
        "units_in_package": to_int(specs.get("Units in package")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
