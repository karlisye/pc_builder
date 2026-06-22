from bs4 import BeautifulSoup
import re
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, to_int

TABLE = "gpus"


def _parse_pcie_version(value: str) -> float | None:
    if not value:
        return None
    match = re.match(r"(\d+\.\d+)", value.strip())
    return float(match.group(1)) if match else None


def _parse_gpu_type(name: str) -> str | None:
    name_lower = name.lower()
    if "radeon" in name_lower or " rx " in name_lower:
        return "amd"
    if "geforce" in name_lower or "rtx" in name_lower or "gtx" in name_lower:
        return "nvidia"
    if "arc" in name_lower or "intel" in name_lower:
        return "intel"
    return None


def parse(html, dateks_id, url, price, stock_status, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    name = extract_name(soup)

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": name,
        "price": price,
        "stock_status": stock_status,
        "stock_quantity": stock_quantity,
        "type": _parse_gpu_type(name),
        "gpu_model": specs.get("GPU model"),
        "vram": to_int(specs.get("RAM")),
        "tdp": to_int(specs.get("Power consumption (TDP)")),
        "min_psu": to_int(specs.get("Minimum power supply output")),
        "pcie_version": _parse_pcie_version(specs.get("PCI-E version")),
        "length_mm": to_int(specs.get("Length (mm)")),
        "power_connectors": specs.get("Power sockets"),
        "cuda": to_int(specs.get("Stream processors / CUDA Cores")),
        "bus": to_int(specs.get("Bus width")),
        "vram_freq": to_int(specs.get("Memory type")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
