import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    to_bool,
    to_int,
)

TABLE = "motherboards"


def _parse_memory_speeds(value: str):
    if not value:
        return None, None
    numbers = re.findall(r"\b(\d{4,5})\b", value)
    if len(numbers) >= 2:
        return int(numbers[0]), int(numbers[1])
    if len(numbers) == 1:
        return int(numbers[0]), int(numbers[0])
    return None, None


def _normalise_socket(value: str) -> str | None:
    if not value:
        return None
    s = re.sub(r"^[Ss]ocket\s+", "", value.strip())
    return s.replace(" ", "") or None


def _normalise_chipset(value: str) -> str | None:
    if not value:
        return None
    return re.sub(r"^(Intel|AMD|NVIDIA)\s+", "", value.strip()) or None


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    _base_speed, max_speed = _parse_memory_speeds(specs.get("Memory support", ""))

    raw_socket = specs.get("CPU Socket") or specs.get("Socket")

    form_factor = specs.get("Form factor") or specs.get("Plate size")

    m2_slots = to_int(specs.get("M.2 Port") or specs.get("M.2 ports"))

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "socket": _normalise_socket(raw_socket),
        "chipset": _normalise_chipset(specs.get("Chipset")),
        "form_factor": form_factor,
        "memory_type": specs.get("Type"),
        "memory_slots": to_int(specs.get("RAM Slots")),
        "memory_max_speed": max_speed,
        "m2_slots": m2_slots,
        "sata_ports": to_int(specs.get("SATA3 ports")),
        "wifi": to_bool(specs.get("Built-in Wi-Fi")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
