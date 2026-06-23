import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "coolers"


def _parse_compatibility(value: str) -> str | None:
    if not value:
        return None
    parts = re.split(r"[,/]", value)
    cleaned = []
    for part in parts:
        s = re.sub(r"^[Ss]ocket\s+", "", part.strip())
        s = s.replace(" ", "").strip()
        if s:
            cleaned.append(s)
    return ",".join(cleaned) if cleaned else None


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "product_code": product_code,
        "name": extract_name(soup),
        "compatibility": _parse_compatibility(specs.get("Compatibility")),
        "tdp_support": to_int(specs.get("Cooling capacity (TDP), W")),
        "height_mm": to_int(specs.get("Height, mm")),
        "fan_size_mm": to_int(specs.get("Fan size, mm")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
