import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "coolers"


def _parse_compatibility(value: str) -> str | None:
    """Normalise compatibility string to comma-separated socket list.
    Applies same normalisation as cpu_parser._normalise_socket():
    strip 'Socket ' prefix, remove internal spaces.
    'AM4, AM5, LGA1150, LGA 1700' → 'AM4,AM5,LGA1150,LGA1700'
    """
    if not value:
        return None
    parts = re.split(r'[,/]', value)
    cleaned = []
    for part in parts:
        s = re.sub(r'^[Ss]ocket\s+', '', part.strip())
        s = s.replace(" ", "").strip()
        if s:
            cleaned.append(s)
    return ",".join(cleaned) if cleaned else None


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id":      dateks_id,
        "url":            url,
        "name":           extract_name(soup),
        "price":          price,
        "in_stock":       in_stock,
        "stock_quantity": stock_quantity,
        "compatibility":  _parse_compatibility(specs.get("Compatibility")),         # "AM4,AM5,LGA1700,..."
        "tdp_support":    to_int(specs.get("Cooling capacity (TDP), W")),           # "Not specified" → None
        "height_mm":      to_int(specs.get("Height, mm")),                          # "158" → 158
        "fan_size_mm":    to_int(specs.get("Fan size, mm")),                        # "140" → 140
        "scraped_at":     scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
