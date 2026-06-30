import json
import re
from bs4 import BeautifulSoup


# global helpers
def extract_name(soup) -> str | None:
    tag = soup.select_one("h1.name")
    if tag:
        span = tag.select_one("span")
        return span.get_text(strip=True) if span else tag.get_text(strip=True)
    return None

# scrape component parameters
def extract_specs(soup) -> dict:
    specs = {}
    for fv in soup.select("#params .fv"):
        key_tag = fv.select_one("span.k")
        val_tag = fv.select_one("span.v")
        if key_tag and val_tag:
            key = key_tag.get_text(strip=True).rstrip(":")
            val = val_tag.get_text(strip=True)
            specs[key] = val
    return specs


def to_bool(value: str) -> bool | None:
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("ir", "yes", "is", "true", "1"):
        return True
    return False


def to_int(value: str) -> int | None:
    if not value or value.strip().lower() in (
        "not specified",
        "nav norādīts",
        "nav",
        "",
    ):
        return None
    match = re.search(r"\d+", value.replace(",", ""))
    return int(match.group()) if match else None


def to_float(value: str) -> float | None:
    if not value or value.strip().lower() in (
        "not specified",
        "nav norādīts",
        "nav",
        "",
    ):
        return None
    match = re.search(r"\d+\.?\d*", value.replace(",", "."))
    return float(match.group()) if match else None


def tb_to_gb(value: str) -> int | None:
    if not value:
        return None
    v = value.strip().upper()
    num = to_float(v)
    if num is None:
        return None
    if "TB" in v:
        return int(num * 1000)
    return int(num)


# parse all <script type="application/ld+json"> blocks and return the one describing a Product
def extract_jsonld(soup) -> dict:
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
        except (TypeError, ValueError):
            continue
        if isinstance(data, dict) and data.get("@type") == "Product":
            return data
    return {}


# scrape the english "original" spec block (div.specs div.original), keyed by "Section - Key" or "Key"
def extract_original(soup) -> dict:
    div = soup.select_one("div.specs div.original")
    if not div:
        return {}

    # replace <br> tags with newlines so each "Key - Value" pair lands on its own line
    for br in div.find_all("br"):
        br.replace_with("\n")

    original = {}
    text = div.get_text()
    for line in text.split("\n"):
        line = line.strip()
        if not line or " - " not in line:
            continue
        key, _, value = line.rpartition(" - ")
        key = key.strip()
        value = value.strip()
        # first occurrence of a key wins (handles repeated lines, e.g. EAN/radiator support)
        if key and key not in original:
            original[key] = value
    return original


# pull the EAN code out of the .original dict, trying known key variants in order
def get_ean(original: dict) -> str | None:
    for key in ("EAN_code", "EANCode", "Eans", "EAN", "ean", "EAN kods"):
        value = original.get(key)
        if value:
            stripped = value.strip().lstrip("0")
            if stripped:
                return stripped
    return None


# parse iops values like "30K" -> 30000, or plain integers
def parse_iops(val) -> int | None:
    if not val:
        return None
    v = val.strip()
    if v.lower() in ("nav", "nav norādīts", ""):
        return None
    match = re.match(r"([\d.]+)\s*[mM]$", v)
    if match:
        return int(float(match.group(1)) * 1_000_000)
    match = re.match(r"([\d.]+)\s*[kK]$", v)
    if match:
        return int(float(match.group(1)) * 1000)
    match = re.search(r"\d+", v.replace(",", ""))
    return int(match.group()) if match else None


# parse capacity strings like "2 TB" / "512GB" into GB
def parse_capacity_gb(val) -> int | None:
    if not val:
        return None
    match = re.search(r"([\d.]+)\s*(TB|GB)", val, re.IGNORECASE)
    if not match:
        return None
    num = float(match.group(1))
    unit = match.group(2).upper()
    if unit == "TB":
        return int(num * 1000)
    return int(num)


# scrape a named section from grouped spec pages (motherboard/gpu/ssd/case),
# where each section is a div.fg.part with a div.name title and div.fv pairs inside div.content
def extract_section_specs(soup, section_name) -> dict:
    specs = {}
    for section in soup.select("div.fg.part"):
        name_tag = section.select_one("div.name")
        if not name_tag or name_tag.get_text(strip=True) != section_name:
            continue
        content = section.select_one("div.content")
        if not content:
            continue
        for fv in content.select(".fv"):
            key_tag = fv.select_one("span.k")
            val_tag = fv.select_one("span.v")
            if key_tag and val_tag:
                key = key_tag.get_text(strip=True).rstrip(":")
                val = val_tag.get_text(strip=True)
                specs[key] = val
        break
    return specs
