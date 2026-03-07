from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, tb_to_gb

TABLE = "hdds"


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
        "capacity": tb_to_gb(specs.get("Capacity")),
        "interface": specs.get("Data Interface"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
