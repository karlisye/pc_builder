import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_section_specs,
    extract_jsonld,
    extract_original,
    get_ean,
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


def _parse_memory_max_speed(value: str) -> int | None:
    if not value:
        return None
    oc_match = re.search(r"(\d+)\s*\(OC\)", value)
    if oc_match:
        return int(oc_match.group(1))
    numbers = re.findall(r"\d+", value)
    return int(numbers[-1]) if numbers else None


def _parse_modules_count(value: str) -> int | None:
    if not value:
        return None
    if "single" in value.lower():
        return 1
    match = re.search(r"\d+", value)
    return int(match.group()) if match else None


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

    _base_speed, max_speed = _parse_memory_speeds(specs.get("Memory support", ""))

    basic_section = extract_section_specs(soup, "Pamatinformācija")
    memory_section = extract_section_specs(soup, "Operatīvā atmiņa")
    wifi_section = extract_section_specs(soup, "Bezvadu savienojumi")
    ports_section = extract_section_specs(soup, "Iekšējās pieslēgvietas")

    raw_socket = (
        basic_section.get("Ligzda (socket)")
        or specs.get("CPU Socket")
        or specs.get("Socket")
    )
    chipset = basic_section.get("Mikroshēmu kopne (chipset)") or specs.get("Chipset")
    form_factor = (
        basic_section.get("Plates izmērs")
        or specs.get("Form factor")
        or specs.get("Plate size")
    )

    memory_type = memory_section.get("Atmiņas tips") or specs.get("Type")
    memory_slots = to_int(memory_section.get("Atmiņas sloti")) or to_int(
        specs.get("RAM Slots")
    )
    section_max_speed = _parse_memory_max_speed(memory_section.get("Atmiņas kopne"))
    if section_max_speed is not None:
        max_speed = section_max_speed

    override_max_speed = original.get(
        "Memory - Supported memory clock speed (max)"
    )
    if override_max_speed:
        max_speed = to_int(override_max_speed) or max_speed

    wifi = to_bool(wifi_section.get("Iebūvēts Wi-Fi")) if wifi_section else to_bool(
        specs.get("Built-in Wi-Fi")
    )

    m2_slots = to_int(
        ports_section.get("M.2 Porti")
        or ports_section.get("M.2 porti")
        or specs.get("M.2 Port")
        or specs.get("M.2 ports")
    )
    sata_ports = to_int(
        ports_section.get("SATA 3 Porti") or specs.get("SATA3 ports")
    )

    max_memory_capacity = to_int(
        original.get("Memory - Maximum internal memory")
    )

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "socket": _normalise_socket(raw_socket),
        "chipset": _normalise_chipset(chipset),
        "form_factor": form_factor,
        "memory_type": memory_type,
        "memory_slots": memory_slots,
        "memory_max_speed": max_speed,
        "max_memory_capacity": max_memory_capacity,
        "m2_slots": m2_slots,
        "sata_ports": sata_ports,
        "wifi": wifi,
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
