import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import extract_name, extract_specs, to_int, tb_to_gb

TABLE = "ssds"


def _normalise_form_factor(value: str) -> str | None:
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


def parse(html, dateks_id, url, price, stock_status, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    interface = None
    for fv in soup.select("#params .fv"):
        k = fv.select_one("span.k")
        v = fv.select_one("span.v")
        if k and v and k.get_text(strip=True).rstrip(":") == "Interface":
            interface = v.get_text(strip=True)
            break

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "stock_status": stock_status,
        "stock_quantity": stock_quantity,
        "capacity": tb_to_gb(specs.get("Capacity")),
        "type": specs.get("Type"),
        "form_factor": _normalise_form_factor(specs.get("Form factor")),
        "interface": interface,
        "read_speed": to_int(specs.get("Read speed (sequential)")),
        "write_speed": to_int(specs.get("Write speed (sequential)")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
