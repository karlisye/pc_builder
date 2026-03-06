import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs,
    to_bool, to_int, to_float,
)

TABLE = "cpus"


def _normalise_socket(value: str) -> str | None:
    """Normalise socket string for clean cooler compatibility matching.
    'Socket AM4'  → 'AM4'
    'LGA 1700'    → 'LGA1700'
    'LGA1851'     → 'LGA1851'
    """
    if not value:
        return None
    s = value.strip()
    s = re.sub(r'^[Ss]ocket\s+', '', s)
    s = s.replace(" ", "")
    return s or None


def _parse_integrated_graphics(value: str) -> bool | None:
    """CPUs with no iGPU report 'No' / 'Not' / 'Nav'.
    CPUs WITH an iGPU report the GPU name, e.g. 'Intel UHD 770'.
    to_bool() returns None for unrecognised strings, so we treat any
    non-None-returning, non-False value as True here.
    """
    if value is None:
        return None
    result = to_bool(value)
    if result is not None:
        return result          # "No"/"Not"/"Nav" → False, "Yes"/"Ir" → True
    # Unrecognised string → it's a GPU name like "Intel UHD 770" → True
    return True if value.strip() else None


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    # --- Cores ---
    # Intel: "Number of Performance Cores" + "Efficient number of cores"
    # AMD:   single "Cores" field
    perf_cores = to_int(specs.get("Number of Performance Cores"))
    eff_cores  = to_int(specs.get("Efficient number of cores"))
    amd_cores  = to_int(specs.get("Cores"))

    if perf_cores is not None:
        total_cores = (perf_cores or 0) + (eff_cores or 0)
    else:
        total_cores = amd_cores

    # --- Passmark ---
    passmark_raw = specs.get("Performance (PassMark)", "")
    passmark = to_int(passmark_raw.replace("+", "")) if passmark_raw else None

    # --- TDP ---
    # Intel: "TDP",  AMD: "Thermal Design Power"
    tdp = to_int(specs.get("TDP") or specs.get("Thermal Design Power"))

    # --- Cooler included ---
    # "Nav" / "No" → False (Tray / boxed without cooler)
    # "Yes" / "Ir" → True  (boxed with cooler)
    # Important for build recommendations: no cooler_included → must add one.
    cooler_included = to_bool(specs.get("Cooler included"))

    return {
        "dateks_id":           dateks_id,
        "url":                 url,
        "name":                extract_name(soup),
        "price":               price,
        "in_stock":            in_stock,
        "stock_quantity":      stock_quantity,
        "socket":              _normalise_socket(specs.get("Socket")),
        "cores":               total_cores,
        "threads":             to_int(specs.get("Threads")),
        "clock_rate":          to_float(specs.get("Clock rate")),
        "turbo_frequency":     to_float(specs.get("Turbo frequency")),
        "tdp":                 tdp,
        "integrated_graphics": _parse_integrated_graphics(specs.get("Integrated graphics")),
        "cooler_included":     cooler_included,
        "passmark":            passmark,
        "scraped_at":          scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
