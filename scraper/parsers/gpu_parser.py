from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, parse_pcie_version

TABLE = "gpus"


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
        "gpu_model": specs.get("GPU model"),
        "vram": to_int(specs.get("RAM")),
        "tdp": to_int(specs.get("Power consumption (TDP)")),
        "min_psu": to_int(specs.get("Minimum power supply output")),
        "pcie_version": parse_pcie_version(specs.get("PCI-E version")),
        "length_mm": to_int(specs.get("Length (mm)")),
        "power_connectors": specs.get("Power sockets"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
