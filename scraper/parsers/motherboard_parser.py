import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs,
    to_bool, to_int, parse_memory_speeds,
)

TABLE = "motherboards"


def _normalise_socket(value: str) -> str | None:
    """Same normalisation as cpu_parser — must match exactly for JOIN queries.
    'LGA 1851' → 'LGA1851'
    'AM4'      → 'AM4'
    'Socket AM4' → 'AM4'  (just in case)
    """
    if not value:
        return None
    s = re.sub(r'^[Ss]ocket\s+', '', value.strip())
    return s.replace(" ", "") or None


def _normalise_chipset(value: str) -> str | None:
    """Strip vendor prefix from chipset string.
    'Intel Z890' → 'Z890'
    'AMD A520'   → 'A520'
    'B650E'      → 'B650E'  (already clean)
    """
    if not value:
        return None
    return re.sub(r'^(Intel|AMD|NVIDIA)\s+', '', value.strip()) or None


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    # Memory speed: "DDR5 6400 (OC 9200)" or "DDR4 3200MHz (4533MHz OC)"
    # parse_memory_speeds returns (base_speed, max_speed) — we only store max_speed
    _base_speed, max_speed = parse_memory_speeds(specs.get("Memory support", ""))

    # Socket: Intel uses "CPU Socket", AMD uses "Socket"
    raw_socket = specs.get("CPU Socket") or specs.get("Socket")

    # Form factor: Intel uses "Form factor", AMD uses "Plate size"
    form_factor = specs.get("Form factor") or specs.get("Plate size")

    # M.2: Intel uses "M.2 Port" (singular), AMD uses "M.2 ports" (plural)
    m2_slots = to_int(specs.get("M.2 Port") or specs.get("M.2 ports"))

    return {
        "dateks_id":              dateks_id,
        "url":                    url,
        "name":                   extract_name(soup),
        "price":                  price,
        "in_stock":               in_stock,
        "stock_quantity":         stock_quantity,
        "socket":                 _normalise_socket(raw_socket),   # "LGA1851", "AM4"
        "chipset":                _normalise_chipset(specs.get("Chipset")),  # "Z890", "A520"
        "form_factor":            form_factor,                     # "ATX", "mATX"
        "memory_type":            specs.get("Type"),               # "DDR5", "DDR4"
        "memory_slots":           to_int(specs.get("RAM Slots")),
        "memory_max_speed":       max_speed,                       # OC speed wins e.g. 9200, 4533
        "m2_slots":               m2_slots,
        "sata_ports":             to_int(specs.get("SATA3 ports")),
        "wifi":                   to_bool(specs.get("Built-in Wi-Fi")),
        "scraped_at":             scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)