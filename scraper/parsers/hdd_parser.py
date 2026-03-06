from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int, tb_to_gb,
)

TABLE = "hdds"


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
        "brand": extra.get("Brand"),
        # Capacity arrives as TB (e.g. "2 TB") — convert to GB
        "capacity": tb_to_gb(specs.get("Capacity")),
        # Hardcoded: only 3.5" HDD category is scraped
        "form_factor": '3.5"',
        "interface": specs.get("Data Interface"),
        "spindle_speed": to_int(specs.get("Spindle rotation speed")),
        "cache": to_int(specs.get("Data buffer")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
