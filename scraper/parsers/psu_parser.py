import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_bool, parse_connector_count

TABLE = "psus"


def _parse_modular(value: str) -> bool | None:
    """'Fully-Modular' / 'Semi-Modular' → True, 'Non-Modular' / 'Nav' → False"""
    if not value:
        return None
    v = value.strip().lower()
    if "non" in v or v in ("nav", "no", "not"):
        return False
    if "modular" in v:
        return True
    return None


def _parse_pcie_connectors(specs: dict) -> int | None:
    """Count legacy PCI-E connectors.
    'PCI-E' key: '4 X 6+2pin' → 4
    Ignores the PCI-E 5.0/5.1 key (modern 12V-2X6 connector — stored separately via power_connectors if needed).
    """
    return parse_connector_count(specs.get("PCI-E"))


def _parse_eps_connectors(specs: dict) -> int | None:
    """'Processor plug-in': '2 x 8-pin(4+4) EPS' → 2"""
    return parse_connector_count(specs.get("Processor plug-in"))


def _parse_sata_connectors(specs: dict) -> int | None:
    """'SATA cconnectors' (typo in dateks HTML): '14' → 14"""
    # Note: dateks has a typo "cconnectors" — match both just in case they fix it
    return to_int(specs.get("SATA cconnectors") or specs.get("SATA connectors"))


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id":        dateks_id,
        "url":              url,
        "name":             extract_name(soup),
        "price":            price,
        "in_stock":         in_stock,
        "stock_quantity":   stock_quantity,
        "wattage":          to_int(specs.get("Power output")),              # "1200W" → 1200
        "efficiency_rating": specs.get("80 PLUS certification"),            # "80 PLUS Platinum"
        "psu_type":         specs.get("Power supply type"),                 # "ATX"
        "modular":          _parse_modular(specs.get("Modular cables")),    # "Fully-Modular" → True
        "fan_size_mm":      to_int(specs.get("Fan size")),                  # "120 mm" → 120
        "pcie_connectors":  _parse_pcie_connectors(specs),                  # 4
        "eps_connectors":   _parse_eps_connectors(specs),                   # 2
        "sata_connectors":  _parse_sata_connectors(specs),                  # 14
        "scraped_at":       scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)