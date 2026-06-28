import re
from bs4 import BeautifulSoup
from database import upsert_row
from parsers.helpers import (
    extract_name,
    extract_specs,
    extract_section_specs,
    extract_jsonld,
    extract_original,
    get_ean,
    parse_capacity_gb,
    parse_iops,
    to_int,
    tb_to_gb,
)

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


def parse(html, product_code, url, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)

    jsonld = extract_jsonld(soup)
    original = extract_original(soup)
    ean = get_ean(original)
    brand = (jsonld.get("brand") or {}).get("name") if isinstance(jsonld.get("brand"), dict) else None
    image = jsonld.get("image")
    image_url = image[0] if isinstance(image, list) else image
    name = extract_name(soup) or jsonld.get("name")

    basic_section = extract_section_specs(soup, "Pamatinformācija")
    ports_section = extract_section_specs(soup, "Pieslēgvietas un aprīkojums")
    spec_section = extract_section_specs(soup, "Specifikācija")

    interface = ports_section.get("Interfeiss")
    if not interface:
        for fv in soup.select("#params .fv"):
            k = fv.select_one("span.k")
            v = fv.select_one("span.v")
            if k and v and k.get_text(strip=True).rstrip(":") == "Interface":
                interface = v.get_text(strip=True)
                break

    capacity = parse_capacity_gb(basic_section.get("Apjoms")) or tb_to_gb(
        specs.get("Capacity")
    )

    form_factor = _normalise_form_factor(
        ports_section.get("Formāts") or specs.get("Form factor")
    )

    write_speed = to_int(
        basic_section.get("Rakstīšanas ātrums (Seq. Write)")
        or basic_section.get("Rakstīšanas ātrums")
        or specs.get("Write speed (sequential)")
    )
    override_write_speed = to_int(original.get("Features - Write speed"))
    if override_write_speed is not None:
        write_speed = override_write_speed

    nand_type = spec_section.get("Atmiņas tehnoloģija")
    if nand_type and nand_type.strip().lower() == "nav norādīts":
        nand_type = None

    return {
        "product_code": product_code,
        "name": name,
        "ean": ean,
        "brand": brand,
        "image_url": image_url,
        "capacity": capacity,
        "type": basic_section.get("Tips") or specs.get("Type"),
        "form_factor": form_factor,
        "interface": interface,
        "read_speed": to_int(
            basic_section.get("Lasīšanas ātrums (Seq. Read)")
            or basic_section.get("Lasīšanas ātrums")
            or specs.get("Read speed (sequential)")
        ),
        "write_speed": write_speed,
        "nand_type": nand_type,
        "tbw": to_int(spec_section.get("Endurance (TBW)")),
        "random_read_iops": parse_iops(spec_section.get("Random Read IOPS")),
        "random_write_iops": parse_iops(spec_section.get("Random Write IOPS")),
        "scraped_at": scraped_at,
    }


def insert(conn, data):
    upsert_row(conn, TABLE, data)
