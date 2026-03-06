import re
from bs4 import BeautifulSoup


# ---------------------------------------------------------------------------
# Name extraction
# ---------------------------------------------------------------------------

def extract_name(soup) -> str | None:
    """Extract product name from the detail page h1.
    The name lives in <h1 class="name">, inside a <span>.
    Do NOT use soup.select_one("h1, .name") — it may match unrelated elements.
    """
    tag = soup.select_one("h1.name")
    if tag:
        span = tag.select_one("span")
        return span.get_text(strip=True) if span else tag.get_text(strip=True)
    return None


# ---------------------------------------------------------------------------
# Spec extraction
# ---------------------------------------------------------------------------

def extract_specs(soup) -> dict:
    """Extract all key-value pairs from the main params section (#params .fv elements).

    ⚠️ Fragility note: depends on id="params" being present. If all fields return
    None for a category, inspect raw HTML to confirm #params still exists.
    Returns empty dict if container is not found.
    """
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
    """Convert Latvian/English boolean strings to Python bool.
    'Ir', 'Yes', 'Is', 'True' → True
    'Nav', 'No', 'Not', 'Nav norādīts', '' → False
    None or unrecognised → None
    """
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("ir", "yes", "is", "true", "1"):
        return True
    if v in ("nav", "no", "not", "nav norādīts", ""):
        return False
    return None


def to_int(value: str) -> int | None:
    """Extract first integer from a string, stripping units.
    '65W' → 65, '3600 MHz' → 3600, '20000+' → 20000
    'Not specified' / 'Nav' / '' → None

    ⚠️ Safety: never call on string fields like memory_type ('DDR4' → 4)
    or socket ('AM4' → 4). Only use on known numeric+unit fields.
    """
    if not value or value.strip().lower() in ("not specified", "nav norādīts", "nav", ""):
        return None
    match = re.search(r'\d+', value.replace(",", ""))
    return int(match.group()) if match else None


def to_float(value: str) -> float | None:
    """Extract first float from a string, stripping units.
    '2.5 GHz' → 2.5, '65W' → 65.0
    'Not specified' / 'Nav' / '' → None
    """
    if not value or value.strip().lower() in ("not specified", "nav norādīts", "nav", ""):
        return None
    match = re.search(r'\d+\.?\d*', value.replace(",", "."))
    return float(match.group()) if match else None


def tb_to_gb(value: str) -> int | None:
    """Convert capacity string to GB integer.
    '2 TB' → 2000, '500 GB' → 500
    """
    if not value:
        return None
    v = value.strip().upper()
    num = to_float(v)
    if num is None:
        return None
    if "TB" in v:
        return int(num * 1000)
    return int(num)


# ---------------------------------------------------------------------------
# Domain-specific parsers
# ---------------------------------------------------------------------------

def parse_pcie_version(value: str) -> float | None:
    """Extract PCIe version number, ignoring slot width suffix.
    '5.0 x8' → 5.0, '4.0 x16' → 4.0, '3.0' → 3.0
    """
    if not value:
        return None
    match = re.match(r'(\d+\.\d+)', value.strip())
    return float(match.group(1)) if match else None


def parse_memory_speeds(value: str):
    """Parse base and OC memory speed from a combined string.
    'DDR4 2133 (OC 3200)' → (2133, 3200)
    'DDR4 3200MHz (4800MHz OC)' → (3200, 4800)
    Returns (base_speed, max_speed) as ints, or (None, None) on failure.
    """
    if not value:
        return None, None
    # 4–5 digit numbers are MHz values
    numbers = re.findall(r'\b(\d{4,5})\b', value)
    if len(numbers) >= 2:
        return int(numbers[0]), int(numbers[1])
    if len(numbers) == 1:
        return int(numbers[0]), int(numbers[0])
    return None, None


def parse_connector_count(value: str) -> int | None:
    """Extract leading integer connector count from PSU connector strings.
    '2 X 6+2pin' → 2, '1 x 8-pin(4+4) EPS' → 1
    """
    if not value:
        return None
    match = re.match(r'(\d+)\s*[xX]', value.strip())
    return int(match.group(1)) if match else None
