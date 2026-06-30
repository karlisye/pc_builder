import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    to_int,
    to_float,
)

TABLE = "psus"


def _parse_modular(value: str) -> str | None:
    if not value:
        return None
    v = value.strip().lower()
    if v == "nav":
        return "none"
    if v == "daļēji":
        return "semi"
    if v == "pilnīgi":
        return "full"
    if "non" in v or v in ("no", "not"):
        return "none"
    if "semi" in v:
        return "semi"
    if "modular" in v or "full" in v:
        return "full"
    return None


def _parse_pcie_5(value: str) -> bool | None:
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("nav", "no", "not", ""):
        return False
    return True


def _parse_sata_connectors(specs: dict) -> int | None:
    return to_int(specs.get("SATA cconnectors") or specs.get("SATA connectors"))


def _none_if_not_specified(value: str) -> str | None:
    if not value:
        return None
    if value.strip().lower() in ("nav", "nav norādīts", ""):
        return None
    return value


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    jsonld = extract_jsonld(soup)
    original = extract_original(soup)
    ean = get_ean(original)
    brand = (jsonld.get("brand") or {}).get("name") if isinstance(jsonld.get("brand"), dict) else None
    image = jsonld.get("image")
    image_url = image[0] if isinstance(image, list) else image
    name = extract_name(soup) or jsonld.get("name")

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "wattage": to_int(specs.get("Jauda") or specs.get("Power output")),
        "efficiency_rating": specs.get("80 PLUS certification"),
        "psu_type": specs.get("Barošanas bloka tips") or specs.get("Power supply type"),
        "modular": _parse_modular(specs.get("Modulārie kabeļi") or specs.get("Modular cables")),
        "fan_size_mm": to_int(specs.get("Ventilatora izmērs") or specs.get("Fan size")),
        "pcie_connectors": _none_if_not_specified(specs.get("PCI-E")),
        "sata_connectors": to_int(specs.get("SATA spraudņi")) or _parse_sata_connectors(specs),
        "amps_12v": to_float(specs.get("Kopējais strāvas stiprums (+12V)")),
        "pcie_5": _parse_pcie_5(specs.get("PCI-E 5.0/5.1")),
        "cpu_connectors": specs.get("Procesora spraudnis"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
