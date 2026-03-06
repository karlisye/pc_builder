from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_bool, to_int, to_float,
)

TABLE = "cpus"


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    # Determine total cores
    # Intel: sum performance-cores + efficient-cores
    # AMD: read "Cores" directly
    perf_cores = to_int(extra.get("Performance-cores Quantity"))
    eff_cores = to_int(extra.get("Efficient-cores Quantity"))
    amd_cores = to_int(specs.get("Cores") or specs.get("Number of Performance Cores"))

    if perf_cores is not None:
        total_cores = (perf_cores or 0) + (eff_cores or 0)
    else:
        total_cores = amd_cores

    # Passmark: strip trailing "+" before converting
    passmark_raw = specs.get("Performance (PassMark)", "")
    passmark = to_int(passmark_raw.replace("+", ""))

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": extra.get("Brand") or extra.get("Manufacturer"),
        "processor_type": specs.get("Type") or specs.get("Processor type"),
        "processor_number": specs.get("Processor number"),
        "architecture": extra.get("Core Name") or extra.get("CPU Architecture"),
        "socket": specs.get("Socket") or specs.get("CPU Socket"),
        "cores": total_cores,
        "performance_cores": perf_cores,
        "efficient_cores": eff_cores,
        "threads": to_int(specs.get("Threads")),
        "clock_rate": to_float(specs.get("Clock rate")),
        "turbo_frequency": to_float(specs.get("Turbo frequency")),
        "cache": to_int(specs.get("Cache")),
        "lithography": (
            specs.get("Processing Die Lithography")
            or specs.get("Semiconductor Fabrication Process")
        ),
        "tdp": to_int(specs.get("TDP") or specs.get("Thermal Design Power")),
        "max_tdp": to_int(extra.get("Maximum TDP")),
        "integrated_graphics": to_bool(specs.get("Integrated graphics")),
        "cooler_included": to_bool(specs.get("Cooler included")),
        "packaging": specs.get("Packaging"),
        "passmark": passmark,
        "memory_type": (
            extra.get("Memory Types")
            or extra.get("Memory types supported by processor")
        ),
        "max_memory": to_int(extra.get("Max Memory Size")),
        "memory_channels": to_int(extra.get("Memory Channels Supports")),
        "pcie_lanes": to_int(extra.get("Max Number of PCI Express Lanes")),
        "instruction_set": (
            extra.get("Instruction Set")
            or extra.get("Processor - Processor operating modes")
        ),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
