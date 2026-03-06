from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, parse_pcie_version

TABLE = "gpus"


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id":       dateks_id,
        "url":             url,
        "name":            extract_name(soup),
        "price":           price,
        "in_stock":        in_stock,
        "stock_quantity":  stock_quantity,
        "gpu_model":       specs.get("GPU model"),                         # "Radeon RX 9070 XT"
        "vram":            to_int(specs.get("RAM")),                       # "16 GB" → 16
        "tdp":             to_int(specs.get("Power consumption (TDP)")),   # "330 W" → 330
        "min_psu":         to_int(specs.get("Minimum power supply output")), # "700 W" → 700
        "pcie_version":    parse_pcie_version(specs.get("PCI-E version")), # "5.0 x16" → 5.0
        "length_mm":       to_int(specs.get("Length (mm)")),               # "331" → 331
        "power_connectors": specs.get("Power sockets"),                    # "1x 16-pin" raw string
        "scraped_at":      scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
