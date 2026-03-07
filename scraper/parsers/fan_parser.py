from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_float

TABLE = "fans"


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
        "size_mm":        to_int(specs.get("Size, mm")),                 
        "connector":      specs.get("Output Interface"),                # "4-pin (PWM)"
        "rpm_max":        to_int(specs.get("RPM (MAX), rpm")),          # "3000" → 3000
        "units_in_package": to_int(specs.get("Units in package")),      # "1" → 1
        "scraped_at":     scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
