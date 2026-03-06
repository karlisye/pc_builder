from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int,
)

TABLE = "ssds"


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
        "brand": extra.get("Manufacturer") or extra.get("Brand"),
        "capacity": to_int(specs.get("Capacity")),
        "type": specs.get("Type"),
        "form_factor": specs.get("Form factor"),
        "interface": specs.get("Interface"),
        "read_speed": to_int(specs.get("Read speed (sequential)")),
        "write_speed": to_int(specs.get("Write speed (sequential)")),
        "tbw": to_int(specs.get("Endurance (TBW)")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
