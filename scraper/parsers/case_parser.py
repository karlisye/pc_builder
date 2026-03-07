from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import extract_name, extract_specs, to_int, to_bool

TABLE = "cases"


def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    return {
        "dateks_id":             dateks_id,
        "url":                   url,
        "name":                  extract_name(soup),
        "price":                 price,
        "in_stock":              in_stock,
        "stock_quantity":        stock_quantity,
        "form_factor":           specs.get("Form factor"),                      # "Extended ATX", "ATX", "mATX"
        "max_gpu_length":        to_int(specs.get("Max. Video card length, mm")), # "380" → 380
        "max_cpu_cooler_height": to_int(specs.get("Max. CPU cooler height, mm")), # "175" → 175
        "bays_25":               to_int(specs.get('2.5" internal HDD/SSD bays')), # "2" → 2
        "bays_35":               to_int(specs.get('3.5" internal HDD bays')),     # "2" → 2
        "psu_included":          to_bool(specs.get("PSU")),                       # "Nav" → False
        "scraped_at":            scraped_at,
    }


def insert(conn, data):
    insert_row(conn, TABLE, data)
