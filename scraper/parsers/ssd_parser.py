import re
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, tb_to_gb

TABLE = "ssds"


def _normalise_form_factor(value: str) -> str | None:
    """Normalise SSD form factor to clean string.
    'M.2 80mm (2280)' → 'M.2'
    '2.5"'            → '2.5'
    '2.5" + 3.5"'     → '2.5'
    """
    if not value:
        return None
    v = value.strip()
    if v.startswith("M.2"):
        return "M.2"
    if v.startswith("2.5"):
        return "2.5"
    if v.startswith("3.5"):
        return "3.5"
    return v


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    # "Interface" appears twice: first is the real protocol ("PCIe 4.0 x4"),
    # second is the connector type ("M.2"). extract_specs last-write-wins,
    # so we get "M.2" — wrong. We need the FIRST occurrence instead.
    # Read all fv elements in order and grab the first "Interface" value.
    interface = None
    for fv in soup.select("#params .fv"):
        k = fv.select_one("span.k")
        v = fv.select_one("span.v")
        if k and v and k.get_text(strip=True).rstrip(":") == "Interface":
            interface = v.get_text(strip=True)
            break  # first match only

    return {
        "dateks_id":    dateks_id,
        "url":          url,
        "name":         extract_name(soup),
        "price":        price,
        "in_stock":     in_stock,
        "stock_quantity": stock_quantity,
        "capacity":     tb_to_gb(specs.get("Capacity")),            # "1 TB" → 1000, "500 GB" → 500
        "type":         specs.get("Type"),                          # "NVMe", "SATA"
        "form_factor":  _normalise_form_factor(specs.get("Form factor")),  # "M.2", "2.5"
        "interface":    interface,                                  # "PCIe 4.0 x4", "SATA III"
        "read_speed":   to_int(specs.get("Read speed (sequential)")),   # "7450 MB/s" → 7450
        "write_speed":  to_int(specs.get("Write speed (sequential)")),  # "6900 MB/s" → 6900
        "scraped_at":   scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
