from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_bool, to_int, parse_memory_speeds,
)

TABLE = "motherboards"


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    # Memory speed: value contains base + OC speed in one string
    # e.g. "DDR4 2133 (OC 3200)" or "DDR4 3200MHz (4800MHz OC)"
    mem_support = specs.get("Memory support", "")
    base_speed, max_speed = parse_memory_speeds(mem_support)

    # Series: store NULL if dateks returns "Nav"
    series_raw = specs.get("Series")
    series = None if (not series_raw or series_raw.strip().lower() == "nav") else series_raw

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": extra.get("Brand"),
        "series": series,
        "socket": specs.get("CPU Socket") or specs.get("Socket"),
        "chipset": specs.get("Chipset"),
        "form_factor": specs.get("Form factor") or specs.get("Plate size"),
        "memory_type": specs.get("Type"),
        "memory_slots": to_int(specs.get("RAM Slots")),
        "memory_base_speed": base_speed,
        "memory_max_speed": max_speed,
        "max_memory": to_int(
            extra.get("Maximum internal memory") or extra.get("Max memory size")
        ),
        "pcie_x16_slots": to_int(
            extra.get("PCI Express x16 (Gen 4.x) slots")
            or extra.get("Expansion slots - PCI Express x16 slots")
        ),
        "pcie_x1_slots": to_int(extra.get("PCI Express x1 (Gen 3.x) slots")),
        "m2_slots": to_int(specs.get("M.2 Port") or specs.get("M.2 ports")),
        "sata_ports": to_int(specs.get("SATA3 ports")),
        "integrated_graphics": specs.get("Integrated graphics"),
        "wifi": to_bool(specs.get("Built-in Wi-Fi")),
        "bluetooth": to_bool(specs.get("Built-in Bluetooth")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
