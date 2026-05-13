import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    to_bool,
    to_int,
    to_float,
)

TABLE = "cpus"


def _normalise_socket(value: str) -> str | None:
    if not value:
        return None
    s = value.strip()
    s = re.sub(r"^[Ss]ocket\s+", "", s)
    s = s.replace(" ", "")
    return s or None


def _parse_integrated_graphics(value: str) -> bool | None:
    if value is None:
        return False
    if value.strip().lower() in ("nav", "no", "not", "nav norādīts", ""):
        return False
    return True if value.strip() else None


def parse(html, dateks_id, url, price, stock_status, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    perf_cores = to_int(specs.get("Number of Performance Cores"))
    eff_cores = to_int(specs.get("Efficient number of cores"))
    amd_cores = to_int(specs.get("Cores"))

    if perf_cores is not None:
        total_cores = (perf_cores or 0) + (eff_cores or 0)
    else:
        total_cores = amd_cores

    passmark_raw = specs.get("Performance (PassMark)", "")
    passmark = to_int(passmark_raw.replace("+", "")) if passmark_raw else None

    tdp = to_int(specs.get("TDP") or specs.get("Thermal Design Power"))

    cooler_included = to_bool(specs.get("Cooler included"))

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "stock_status": stock_status,
        "stock_quantity": stock_quantity,
        "type": "intel" if "procesori-intel" in url else "amd",
        "socket": _normalise_socket(specs.get("Socket")),
        "cores": total_cores,
        "threads": to_int(specs.get("Threads")),
        "clock_rate": to_float(specs.get("Clock rate")),
        "turbo_frequency": to_float(specs.get("Turbo frequency")),
        "tdp": tdp,
        "integrated_graphics": _parse_integrated_graphics(
            specs.get("Integrated graphics")
        ),
        "cooler_included": cooler_included,
        "passmark": passmark,
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
