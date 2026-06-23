import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    to_int,
)

TABLE = "psus"


def _parse_modular(value: str) -> bool | None:
    if not value:
        return None
    v = value.strip().lower()
    if "non" in v or v in ("nav", "no", "not"):
        return False
    if "modular" in v:
        return True
    return None


def _parse_connector_count(value: str) -> int | None:
    if not value:
        return None
    match = re.match(r"(\d+)\s*[xX]", value.strip())
    return int(match.group(1)) if match else None


def _parse_pcie_connectors(specs: dict) -> int | None:
    return _parse_connector_count(specs.get("PCI-E"))


def _parse_eps_connectors(specs: dict) -> int | None:
    return _parse_connector_count(specs.get("Processor plug-in"))


def _parse_sata_connectors(specs: dict) -> int | None:
    return to_int(specs.get("SATA cconnectors") or specs.get("SATA connectors"))


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "product_code": product_code,
        "name": extract_name(soup),
        "wattage": to_int(specs.get("Power output")),
        "efficiency_rating": specs.get("80 PLUS certification"),
        "psu_type": specs.get("Power supply type"),
        "modular": _parse_modular(specs.get("Modular cables")),
        "fan_size_mm": to_int(specs.get("Fan size")),
        "pcie_connectors": _parse_pcie_connectors(specs),
        "eps_connectors": _parse_eps_connectors(specs),
        "sata_connectors": _parse_sata_connectors(specs),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
