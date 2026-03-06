from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int, parse_pcie_version,
)

TABLE = "gpus"


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
        "gpu_type": specs.get("GPU tips"),
        "gpu_series": specs.get("GPU series"),
        "gpu_model": specs.get("GPU model"),
        "core_frequency": to_int(specs.get("GPU core frequency")),
        "cuda_cores": to_int(specs.get("Stream processors / CUDA Cores")),
        "pcie_version": parse_pcie_version(specs.get("PCI-E version")),
        "vram": to_int(specs.get("RAM")),
        "memory_type": specs.get("Memory type"),
        "memory_bus": to_int(specs.get("Bus width")),
        "tdp": to_int(specs.get("Power consumption (TDP)")),
        "min_psu": to_int(specs.get("Minimum power supply output")),
        "power_connectors": specs.get("Power sockets"),
        "length_mm": to_int(specs.get("Length (mm)")),
        "slot_width": to_int(
            extra.get("Design - Number of slots") or extra.get("Number of slots")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
