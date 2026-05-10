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
    if v in ("nav", "no", "not", "nav norādīts", ""):
        return False
    return None


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

# gpu helpers 
def parse_pcie_version(value: str) -> float | None:
    if not value:
        return None
    match = re.match(r"(\d+\.\d+)", value.strip())
    return float(match.group(1)) if match else None

def parse_gpu_type(name: str) -> str | None:
    name_lower = name.lower()
    if "radeon" in name_lower or " rx " in name_lower:
        return "amd"
    if "geforce" in name_lower or "rtx" in name_lower or "gtx" in name_lower:
        return "nvidia"
    if "arc" in name_lower or "intel" in name_lower:
        return "intel"
    return None

# motherboard helpers
def parse_memory_speeds(value: str):
    if not value:
        return None, None
    numbers = re.findall(r"\b(\d{4,5})\b", value)
    if len(numbers) >= 2:
        return int(numbers[0]), int(numbers[1])
    if len(numbers) == 1:
        return int(numbers[0]), int(numbers[0])
    return None, None

def normalise_socket(value: str) -> str | None:
    if not value:
        return None
    s = re.sub(r"^[Ss]ocket\s+", "", value.strip())
    return s.replace(" ", "") or None

def normalise_chipset(value: str) -> str | None:
    if not value:
        return None
    return re.sub(r"^(Intel|AMD|NVIDIA)\s+", "", value.strip()) or None


# psu helpers
def parse_connector_count(value: str) -> int | None:
    if not value:
        return None
    match = re.match(r"(\d+)\s*[xX]", value.strip())
    return int(match.group(1)) if match else None
