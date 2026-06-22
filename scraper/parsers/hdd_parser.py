from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, tb_to_gb

TABLE = "hdds"


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "product_code": product_code,
        "name": extract_name(soup),
        "capacity": tb_to_gb(specs.get("Capacity")),
        "interface": specs.get("Data Interface"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
