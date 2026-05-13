import re
from bs4 import BeautifulSoup


# global helpers
def extract_name(soup) -> str | None:
    tag = soup.select_one("h1.name")
    if tag:
        span = tag.select_one("span")
        return span.get_text(strip=True) if span else tag.get_text(strip=True)
    return None


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
