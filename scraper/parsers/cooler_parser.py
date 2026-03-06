import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_int, to_float,
)

TABLE = "coolers"


def _parse_compatibility(value: str) -> str | None:
    """Normalise compatibility string to comma-separated socket list.
    Removes 'Socket ' prefix and normalises whitespace.
    e.g. 'Socket LGA1700, Socket AM4' → 'LGA1700,AM4'
    """
    if not value:
        return None
    parts = re.split(r'[,/]', value)
    cleaned = []
    for part in parts:
        s = part.strip()
        # Remove "Socket " prefix for clean matching with cpus.socket
        s = re.sub(r'^[Ss]ocket\s+', '', s).strip()
        if s:
            cleaned.append(s)
    return ",".join(cleaned) if cleaned else None


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
        "brand": specs.get("Producer") or extra.get("Brand"),
        "compatibility": _parse_compatibility(specs.get("Compatibility")),
        "tdp_support": to_int(extra.get("Power - Thermal Design Power (TDP)")),
        "height_mm": to_int(specs.get("Height, mm")),
        "fan_size_mm": to_int(specs.get("Fan size, mm")),
        "fan_count": to_int(specs.get("Number of fans")),
        "rpm_min": to_int(specs.get("Fan speed (MIN), rpm")),
        "rpm_max": to_int(specs.get("Fan speed (MAX), rpm")),
        "noise_db": to_float(specs.get("Noise level (MAX), dB(A)")),
        "connector": specs.get("Output Interface"),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
