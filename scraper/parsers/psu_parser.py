from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_bool, to_int, to_float, parse_connector_count,
)

TABLE = "psus"


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
        "wattage": to_int(specs.get("Power output")),
        "efficiency_rating": specs.get("80 PLUS certification"),
        "psu_type": specs.get("Power supply type"),
        "atx_version": to_float(
            extra.get("ATX version Performance") or extra.get("ATX version")
        ),
        "modular": to_bool(specs.get("Modular cables")),
        "fan_size_mm": to_int(specs.get("Fan size")),
        # parse_connector_count extracts the leading integer from "2 X 6+2pin" → 2
        "pcie_connectors": parse_connector_count(specs.get("PCI-E")),
        "eps_connectors": parse_connector_count(specs.get("Processor plug-in")),
        # Note: "SATA cconnectors" is a typo in the source HTML — match as-is
        "sata_connectors": to_int(specs.get("SATA cconnectors")),
        "depth_mm": to_int(extra.get("Depth Weight & dimensions")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
