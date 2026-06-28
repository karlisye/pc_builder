from bs4 import BeautifulSoup
import re
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_section_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    to_int,
)

TABLE = "gpus"


def _parse_pcie_version(value: str) -> float | None:
    if not value:
        return None
    match = re.match(r"(\d+\.\d+)", value.strip())
    return float(match.group(1)) if match else None


def _parse_gpu_family(name: str) -> str | None:
    name_lower = name.lower()
    if "radeon" in name_lower or " rx " in name_lower:
        return "amd"
    if "geforce" in name_lower or "rtx" in name_lower or "gtx" in name_lower:
        return "nvidia"
    if "arc" in name_lower or "intel" in name_lower:
        return "intel"
    return None


def _parse_power_connectors(value: str) -> str | None:
    if not value:
        return None
    if value.strip().lower() in ("nav", "nav norādīts", ""):
        return None
    return value


def _strip_pcie_lanes(value: str) -> str | None:
    if not value:
        return None
    return re.sub(r"\s*x\s*(8|16)\s*$", "", value.strip()) or None


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

    basic_section = extract_section_specs(soup, "Pamatinformācija")
    memory_section = extract_section_specs(soup, "Operatīvā atmiņa")

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "gpu_model": basic_section.get("GPU modelis") or specs.get("GPU model"),
        "gpu_family": _parse_gpu_family(name),
        "vram": to_int(memory_section.get("Operatīvā atmiņa") or specs.get("RAM")),
        "vram_type": memory_section.get("Atmiņas tehnoloģija"),
        "tdp": to_int(
            basic_section.get("Strāvas patēriņš (TDP)")
            or specs.get("Power consumption (TDP)")
        ),
        "min_psu": to_int(
            basic_section.get("Min. barošanas bloka (PSU) jauda")
            or specs.get("Minimum power supply output")
        ),
        "pcie_version": _parse_pcie_version(
            _strip_pcie_lanes(basic_section.get("PCI-E versija"))
            or specs.get("PCI-E version")
        ),
        "length_mm": to_int(
            basic_section.get("Garums (mm)") or specs.get("Length (mm)")
        ),
        "power_connectors": _parse_power_connectors(
            basic_section.get("Barošanas ligzdas") or specs.get("Power sockets")
        ),
        "cuda": to_int(
            basic_section.get("Stream procesori / CUDA kodoli")
            or basic_section.get("Stream procesori")
            or basic_section.get("CUDA kodoli")
            or specs.get("Stream processors / CUDA Cores")
        ),
        "bus": to_int(memory_section.get("Biti") or specs.get("Bus width")),
        "vram_freq": to_int(
            memory_section.get("Atmiņas frekvence (effective)")
            or memory_section.get("Atmiņas frekvence")
            or specs.get("Memory type")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
