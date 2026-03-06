# PC Builder — Scraper Build Guide

> **Purpose:** This document contains everything an AI needs to build the complete Python scraper for the PC Builder project. It covers architecture, file structure, environment setup, pagination logic, HTML extraction rules, data type conversions, and full database schemas for all 10 component tables.

---

## 1. Project Overview

A Python scraper that collects PC component data from [https://www.dateks.lv/en](https://www.dateks.lv/en) and stores it in a MySQL database. The data will later power an automatic PC builder application built with Laravel 12, Inertia, and React.js.

The scraper is a standalone Python script triggered by:
```bash
python3 main.py
```

On startup it prompts the user to choose which categories to scrape, wipes those tables, then scrapes and inserts fresh data.

---

## 2. Tech Stack

| Tool | Purpose |
|---|---|
| Python 3 | Runtime |
| `requests` | HTTP requests |
| `beautifulsoup4` | HTML parsing |
| `mysql-connector-python` | MySQL database connection |
| `python-dotenv` | Load `.env` credentials |
| `re` | Regex for value cleaning |
| `time` | Delays between requests |

Install all dependencies:
```bash
pip install requests beautifulsoup4 mysql-connector-python python-dotenv
```

---

## 3. File & Folder Structure

```
scraper/
├── main.py                  # Entry point, user prompt, orchestrates scraping
├── config.py                # Category URLs and delay settings
├── database.py              # DB connection, wipe, insert helpers
├── .env                     # DB credentials (not committed)
├── .env.example             # Template with placeholder values
├── scrapers/
│   ├── base_scraper.py      # Shared HTTP session, fetch page, handle redirects
│   ├── list_scraper.py      # Handles pagination, collects product URLs
│   └── detail_scraper.py    # Visits each product URL, returns raw parsed data
└── parsers/
    ├── cpu_parser.py        # Intel + AMD CPUs
    ├── motherboard_parser.py # Intel + AMD Motherboards
    ├── ram_parser.py
    ├── gpu_parser.py
    ├── ssd_parser.py
    ├── hdd_parser.py        # HDD 3.5" only
    ├── case_parser.py
    ├── fan_parser.py
    ├── psu_parser.py
    └── cooler_parser.py
```

---

## 4. Environment Configuration

### `.env.example`
```
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=pc_builder
DB_USERNAME=root
DB_PASSWORD=
```

### `.env`
Copy `.env.example` to `.env` and fill in real credentials. This file must never be committed to version control. Ensure your `.gitignore` contains:
```
.env
```

### Loading in Python
```python
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_DATABASE = os.getenv("DB_DATABASE")
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
```

---

## 5. config.py

```python
# Delay in seconds between each page request
PAGE_DELAY = 1

# Categories to scrape
# Each entry: (category_key, [list of base URLs], parser_module_name, table_name)
CATEGORIES = {
    "cpu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/procesori-intel",
            "https://www.dateks.lv/en/cenas/procesori-amd",
        ],
        "parser": "cpu_parser",
        "table": "cpus",
    },
    "motherboard": {
        "urls": [
            "https://www.dateks.lv/en/cenas/sistemplates-intel-procesoriem",
            "https://www.dateks.lv/en/cenas/sistemplates-amd-procesoriem",
        ],
        "parser": "motherboard_parser",
        "table": "motherboards",
    },
    "ram": {
        "urls": [
            "https://www.dateks.lv/en/cenas/atmina-ram",
        ],
        "parser": "ram_parser",
        "table": "ram",
    },
    "gpu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/videokartes",
        ],
        "parser": "gpu_parser",
        "table": "gpus",
    },
    "ssd": {
        "urls": [
            "https://www.dateks.lv/en/cenas/cietie-diski-ssd",
        ],
        "parser": "ssd_parser",
        "table": "ssds",
    },
    "hdd": {
        "urls": [
            "https://www.dateks.lv/en/cenas/cietie-diski-hdd-3-5",
        ],
        "parser": "hdd_parser",
        "table": "hdds",
    },
    "case": {
        "urls": [
            "https://www.dateks.lv/en/cenas/korpusi",
        ],
        "parser": "case_parser",
        "table": "cases",
    },
    "fan": {
        "urls": [
            "https://www.dateks.lv/en/cenas/ventilatori",
        ],
        "parser": "fan_parser",
        "table": "fans",
    },
    "psu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/psu-barosanas-bloki",
        ],
        "parser": "psu_parser",
        "table": "psus",
    },
    "cooler": {
        "urls": [
            "https://www.dateks.lv/en/cenas/procesoru-gaisa-dzesetaji",
        ],
        "parser": "cooler_parser",
        "table": "coolers",
    },
}
```

---

## 6. main.py

```python
import importlib
import time
from config import CATEGORIES, PAGE_DELAY
from database import get_connection, wipe_table
from scrapers.list_scraper import get_product_urls
from scrapers.detail_scraper import scrape_detail_page

def prompt_user():
    print("\nAvailable categories:")
    keys = list(CATEGORIES.keys())
    for i, key in enumerate(keys, 1):
        print(f"  {i}. {key}")
    print("  all. Scrape everything")
    choice = input("\nEnter category name(s) separated by comma, or 'all': ").strip().lower()
    if choice == "all":
        return keys
    selected = [c.strip() for c in choice.split(",")]
    invalid = [c for c in selected if c not in CATEGORIES]
    if invalid:
        print(f"Unknown categories: {invalid}")
        exit(1)
    return selected

def main():
    selected = prompt_user()
    conn = get_connection()
    scraped_at = time.strftime("%Y-%m-%d %H:%M:%S")

    print(f"\nStarting scrape at {scraped_at}")
    print(f"Categories: {', '.join(selected)}\n")

    for category_key in selected:
        config = CATEGORIES[category_key]
        table = config["table"]
        parser_module = importlib.import_module(f"parsers.{config['parser']}")

        print(f"[{category_key.upper()}] Wiping table '{table}'...")
        wipe_table(conn, table)

        all_urls = []
        for base_url in config["urls"]:
            print(f"  Collecting URLs from: {base_url}")
            urls = get_product_urls(base_url)
            all_urls.extend(urls)
            print(f"  Found {len(urls)} products")

        print(f"  Total: {len(all_urls)} products to scrape")

        for i, (dateks_id, url, price, in_stock, stock_quantity) in enumerate(all_urls, 1):
            print(f"  [{i}/{len(all_urls)}] Scraping: {url}")
            try:
                html = scrape_detail_page(url)
                data = parser_module.parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at)
                if data:
                    # Out-of-stock products ARE inserted. The builder uses in_stock
                    # as a filter at query time, not at scrape time. This preserves
                    # full catalogue data for display and future availability checks.
                    parser_module.insert(conn, data)
            except Exception as e:
                print(f"\n[ERROR] Failed on URL: {url}")
                print(f"[ERROR] {e}")
                conn.close()
                exit(1)
            time.sleep(PAGE_DELAY)

        print(f"  Done with {category_key.upper()}\n")

    conn.close()
    print("Scrape complete.")

if __name__ == "__main__":
    main()
```

---

## 7. database.py

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        database=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )

def wipe_table(conn, table):
    # Tables are wiped before every scrape run. This is intentional:
    # dateks_id is UNIQUE in every table — re-inserting without wiping would
    # throw a duplicate key SQL error. The wipe+insert approach also ensures
    # stale products that were removed from the site are purged automatically.
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM `{table}`")
    cursor.execute(f"ALTER TABLE `{table}` AUTO_INCREMENT = 1")
    conn.commit()
    cursor.close()

def insert_row(conn, table, data: dict):
    columns = ", ".join(f"`{k}`" for k in data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = list(data.values())
    sql = f"INSERT INTO `{table}` ({columns}) VALUES ({placeholders})"
    cursor = conn.cursor()
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
```

---

## 8. scrapers/base_scraper.py

```python
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

session = requests.Session()
session.headers.update(HEADERS)

def fetch(url: str) -> requests.Response:
    response = session.get(url, allow_redirects=True, timeout=15)
    response.raise_for_status()
    return response
```

---

## 9. scrapers/list_scraper.py

Handles pagination. The URL pattern for pages beyond the first is `{base_url}/pg/{page_num}` where page 2 = `/pg/1`, page 3 = `/pg/2`, etc.

The scraper detects the last page by checking if the final URL after redirects differs from the requested URL (i.e. dateks.lv redirects back to the previous page when the page number exceeds available pages).

For each product on each listing page, it extracts:
- `dateks_id` from `data-id` attribute on `<a class="imp">`
- `url` from `href` attribute on `<a class="imp">`
- `price` from `<div class="price">`
- `in_stock` (BOOLEAN) from `<div class="avail">` — `True` if text starts with "In stock" or "In office"
- `stock_quantity` (VARCHAR) — extracted number string e.g. ">50" or "37"

```python
import time
import re
from bs4 import BeautifulSoup
from scrapers.base_scraper import fetch
from config import PAGE_DELAY

BASE_URL = "https://www.dateks.lv"

def get_product_urls(base_url: str) -> list:
    """Returns list of (dateks_id, full_url, price, in_stock, stock_quantity)"""
    results = []
    page = 0  # 0 = first page (no /pg/ suffix), 1 = /pg/1, etc.

    while True:
        if page == 0:
            url = base_url
        else:
            url = f"{base_url}/pg/{page}"

        response = fetch(url)
        final_url = response.url.rstrip("/")

        # Detect redirect back — means we've gone past the last page
        if page > 0:
            expected = f"{base_url}/pg/{page}".rstrip("/")
            if final_url != expected:
                break

        soup = BeautifulSoup(response.text, "html.parser")
        product_links = soup.select("a.imp[data-id]")

        if not product_links:
            break

        for link in product_links:
            dateks_id = int(link.get("data-id"))
            href = link.get("href")
            full_url = BASE_URL + href

            # Get the parent .prod container for price and availability
            prod = link.find_parent(class_="prod")
            price = None
            in_stock = False
            stock_quantity = None

            if prod:
                price_tag = prod.select_one(".price")
                if price_tag:
                    price_text = price_tag.get_text(strip=True).replace("€", "").replace(",", ".").strip()
                    try:
                        price = float(price_text)
                    except ValueError:
                        price = None

                avail_tag = prod.select_one(".avail")
                if avail_tag:
                    avail_text = avail_tag.get_text(strip=True)
                    in_stock = avail_text.lower().startswith("in stock") or avail_text.lower().startswith("in office")
                    # Extract quantity e.g. ">50" or "37"
                    qty_match = re.search(r'(>?\d+)\s+units', avail_text)
                    stock_quantity = qty_match.group(1) if qty_match else None

            results.append((dateks_id, full_url, price, in_stock, stock_quantity))

        print(f"    Page {page + 1}: {len(product_links)} products")
        page += 1
        time.sleep(PAGE_DELAY)

    return results
```

---

## 10. scrapers/detail_scraper.py

```python
from scrapers.base_scraper import fetch

def scrape_detail_page(url: str) -> str:
    """Fetches a product detail page and returns raw HTML."""
    response = fetch(url)
    return response.text
```

---

## 11. Global Parsing Rules

These rules apply to ALL parsers.

### Product name extraction (global rule)
Every parser must extract the product `name` from the detail page. The product name lives in `<h1 class="name">` on the detail page. Use the following shared helper — do NOT use `soup.select_one("h1, .name")` as that may match unrelated `.name` elements elsewhere on the page.

```python
def extract_name(soup) -> str | None:
    """Extract product name from the detail page h1."""
    tag = soup.select_one("h1.name")
    if tag:
        # The name is inside a <span> inside the h1
        span = tag.select_one("span")
        return span.get_text(strip=True) if span else tag.get_text(strip=True)
    return None
```

This function belongs in `parsers/helpers.py` and must be called in every parser's `parse()` function.

---

### Boolean conversion
Fields that contain `"Ir"`, `"Yes"`, `"Is"`, `"True"` → `True`
Fields that contain `"Nav"`, `"No"`, `"Not"`, `"Nav norādīts"`, `""` (empty) → `False` or `None`

```python
def to_bool(value: str) -> bool | None:
    if value is None:
        return None
    v = value.strip().lower()
    if v in ("ir", "yes", "is", "true", "1"):
        return True
    if v in ("nav", "no", "not", "nav norādīts", "nav norādīts", ""):
        return False
    return None
```

### Integer/float stripping
Always strip units from numeric fields:
- `"65W"` → `65`
- `"18 MB"` → `18`
- `"3600 MHz"` → `3600`
- `"2.5 GHz"` → `2.5`
- `"CL 18"` → `18`
- `"2 TB"` → `2000` (convert TB → GB: multiply by 1000)
- `"120 GB"` → `120`
- `"20000+"` → `20000` (strip `+`)
- `"Not specified"` → `None`

> ⚠️ **`to_int` safety warning:** `to_int` extracts the first digit sequence it finds. Never call it on string fields like `memory_type` ("DDR4" → would return `4`) or `socket` ("AM4" → would return `4`). Only call `to_int` on fields that are known to be numeric with optional units (e.g. "65W", "3600 MHz", "18 MB").

```python
import re

def to_int(value: str) -> int | None:
    if not value or value.strip().lower() in ("not specified", "nav norādīts", "nav", ""):
        return None
    match = re.search(r'[\d]+', value.replace(",", ""))
    return int(match.group()) if match else None

def to_float(value: str) -> float | None:
    if not value or value.strip().lower() in ("not specified", "nav norādīts", "nav", ""):
        return None
    match = re.search(r'[\d]+\.?[\d]*', value.replace(",", "."))
    return float(match.group()) if match else None

def tb_to_gb(value: str) -> int | None:
    """Convert capacity string to GB integer. '2 TB' -> 2000, '500 GB' -> 500"""
    if not value:
        return None
    v = value.strip().upper()
    num = to_float(v)
    if num is None:
        return None
    if "TB" in v:
        return int(num * 1000)
    return int(num)
```

### Extracting specs from the "All parameters" / detail section
The main spec block uses `<div class="fv closed">` elements containing `<span class="k">` (key) and `<span class="v">` (value). These are wrapped in a `<div id="params">` container on the detail page.

> ⚠️ **Fragility note:** The selector `#params .fv` depends on `id="params"` being present on the wrapper div. This was verified across all 10 component categories. If dateks.lv restructures their HTML, `extract_specs` will silently return an empty dict and all fields will be `None`. If you notice all fields returning `None` for a category, inspect the raw HTML first to check if `id="params"` still exists.

```python
def extract_specs(soup) -> dict:
    """Extract all key-value pairs from the main params section (#params .fv elements).
    Returns empty dict if the #params container is not found — check raw HTML if this happens.
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
```

### Extracting the "More detailed specification" block
The extra details section is a flat `<div>` with `Key - Value<br>` lines.

```python
def extract_extra_specs(soup) -> dict:
    """Extract key-value pairs from the 'More detailed specification' block."""
    extra = {}
    details_div = soup.select_one("div.details.part")
    if not details_div:
        return extra
    content_div = details_div.select_one("div.content > div")
    if not content_div:
        return extra
    raw = content_div.decode_contents()
    lines = raw.split("<br")
    for line in lines:
        # Strip HTML tags
        clean = re.sub(r"<[^>]+>", "", line).strip()
        if " - " in clean:
            parts = clean.split(" - ", 1)
            key = parts[0].strip()
            val = parts[1].strip()
            if key and val:
                extra[key] = val
    return extra
```

---

## 12. Database Schemas (Laravel Migrations)

> These tables must already exist before the scraper runs. Create them using Laravel migrations. The scraper does NOT create tables — it only wipes and inserts.

### 12.1 `cpus`
```sql
Schema::create('cpus', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('processor_type')->nullable();
    $table->string('processor_number')->nullable();
    $table->string('architecture')->nullable();
    $table->string('socket')->nullable()->index();
    $table->tinyInteger('cores')->nullable()->index();
    $table->tinyInteger('performance_cores')->nullable();
    $table->tinyInteger('efficient_cores')->nullable();
    $table->tinyInteger('threads')->nullable();
    $table->decimal('clock_rate', 4, 2)->nullable();
    $table->decimal('turbo_frequency', 4, 2)->nullable();
    $table->tinyInteger('cache')->nullable();
    $table->string('lithography')->nullable();
    $table->smallInteger('tdp')->nullable()->index();
    $table->smallInteger('max_tdp')->nullable();
    $table->boolean('integrated_graphics')->nullable();
    $table->boolean('cooler_included')->nullable();
    $table->string('packaging')->nullable();
    $table->integer('passmark')->nullable();
    $table->string('memory_type')->nullable();
    $table->smallInteger('max_memory')->nullable();
    $table->tinyInteger('memory_channels')->nullable();
    $table->tinyInteger('pcie_lanes')->nullable();
    $table->string('instruction_set')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — from extra details: `"Brand"`
- `socket` — from detail: `"Socket"` or `"CPU Socket"`
- `processor_type` — from detail: `"Type"` (Intel) or `"Processor type"` (AMD)
- `processor_number` — from detail: `"Processor number"`
- `architecture` — from detail: `"Type"` value substring or extra: `"Core Name"` (Intel), `"CPU Architecture"` (AMD)
- `cores` — Intel: `performance_cores + efficient_cores`; AMD: `"Cores"`
- `performance_cores` — extra details: `"Performance-cores Quantity"` (Intel only)
- `efficient_cores` — extra details: `"Efficient-cores Quantity"` (Intel only)
- `threads` — detail: `"Threads"`
- `clock_rate` — detail: `"Clock rate"`, strip " GHz"
- `turbo_frequency` — detail: `"Turbo frequency"`, strip " GHz"
- `cache` — detail: `"Cache"`, strip " MB"
- `lithography` — detail: `"Processing Die Lithography"` (Intel) or `"Semiconductor Fabrication Process"` (AMD)
- `tdp` — detail: `"TDP"` or `"Thermal Design Power"`, strip "W"
- `max_tdp` — extra details: `"Maximum TDP"`, strip " Vats" or "W"
- `integrated_graphics` — detail: `"Integrated graphics"` → to_bool()
- `cooler_included` — detail: `"Cooler included"` → to_bool() (`"Ir"` = True, `"Nav"` = False)
- `packaging` — detail: `"Packaging"`
- `passmark` — detail: `"Performance (PassMark)"`, strip "+", store as INT
- `memory_type` — extra details: `"Memory Types"` (Intel) or `"Memory types supported by processor"` (AMD)
- `max_memory` — extra details: `"Max Memory Size"`, strip "GB"
- `memory_channels` — extra details: `"Memory Channels Supports"`
- `pcie_lanes` — extra details: `"Max Number of PCI Express Lanes"`
- `instruction_set` — extra details: `"Instruction Set"` or `"Processor - Processor operating modes"`

---

### 12.2 `motherboards`
```sql
Schema::create('motherboards', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('series')->nullable();
    $table->string('socket')->nullable()->index();
    $table->string('chipset')->nullable()->index();
    $table->string('form_factor')->nullable()->index();
    $table->string('memory_type')->nullable()->index();
    $table->tinyInteger('memory_slots')->nullable();
    $table->smallInteger('memory_base_speed')->nullable();
    $table->smallInteger('memory_max_speed')->nullable()->index();
    $table->smallInteger('max_memory')->nullable();
    $table->tinyInteger('pcie_x16_slots')->nullable();
    $table->tinyInteger('pcie_x1_slots')->nullable();
    $table->tinyInteger('m2_slots')->nullable()->index();
    $table->tinyInteger('sata_ports')->nullable()->index();
    $table->string('integrated_graphics')->nullable();
    $table->boolean('wifi')->nullable()->index();
    $table->boolean('bluetooth')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Brand"`
- `series` — detail: `"Series"`, NULL if "Nav"
- `socket` — detail: `"CPU Socket"` (Intel) or `"Socket"` (AMD)
- `chipset` — detail: `"Chipset"`
- `form_factor` — detail: `"Form factor"` or `"Plate size"`
- `memory_type` — detail: `"Type"` under RAM section
- `memory_slots` — detail: `"RAM Slots"`
- `memory_base_speed` / `memory_max_speed` — detail: `"Memory support"` — the value contains both the base speed and the OC speed in one string. Two formats observed:
  - `"DDR4 2133 (OC 3200)"` → base=2133, max=3200
  - `"DDR4 3200MHz (4800MHz OC)"` → base=3200, max=4800

  Use the following helper:
  ```python
  def parse_memory_speeds(value: str):
      """Returns (base_speed, max_speed) as ints, or (None, None) on failure."""
      if not value:
          return None, None
      # Extract all standalone integers (4+ digits = MHz values)
      numbers = re.findall(r'\b(\d{4,5})\b', value)
      if len(numbers) >= 2:
          return int(numbers[0]), int(numbers[1])
      if len(numbers) == 1:
          return int(numbers[0]), int(numbers[0])
      return None, None
  ```
  Add this to `parsers/helpers.py`.
- `max_memory` — extra details: `"Maximum internal memory"` or `"Max memory size"`, strip "GB"
- `pcie_x16_slots` — extra details: `"PCI Express x16 (Gen 4.x) slots"` or `"Expansion slots - PCI Express x16 slots"`
- `pcie_x1_slots` — extra details: `"PCI Express x1 (Gen 3.x) slots"`
- `m2_slots` — detail: `"M.2 Port"` or `"M.2 ports"`
- `sata_ports` — detail: `"SATA3 ports"`
- `integrated_graphics` — detail: `"Integrated graphics"`, store raw string value
- `wifi` — detail: `"Built-in Wi-Fi"` → to_bool()
- `bluetooth` — detail: `"Built-in Bluetooth"` → to_bool()

---

### 12.3 `ram`
```sql
Schema::create('ram', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('memory_type')->nullable()->index();
    $table->smallInteger('capacity')->nullable()->index();
    $table->smallInteger('frequency')->nullable()->index();
    $table->tinyInteger('cl_latency')->nullable();
    $table->tinyInteger('modules_count')->nullable();
    $table->decimal('voltage', 4, 2)->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Brand"`
- `memory_type` — detail: `"Type"` (e.g. "DDR4", "DDR5")
- `capacity` — detail: `"Capacity"`, strip " GB"
- `frequency` — detail: `"Maximum frequency"`, strip " MHz"
- `cl_latency` — detail: `"CL"`, strip "CL " prefix
- `modules_count` — extra details: `"Memory Modules Quantity"` or `"Memory Memory layout (modules x size)"` (parse "1 x 8 GB" → 1)
- `voltage` — extra details: `"Features - Memory voltage"` or `"Maximum Supply Voltage"`, strip " V"

---

### 12.4 `gpus`
```sql
Schema::create('gpus', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('gpu_type')->nullable();
    $table->string('gpu_series')->nullable();
    $table->string('gpu_model')->nullable()->index();
    $table->smallInteger('core_frequency')->nullable();
    $table->smallInteger('cuda_cores')->nullable();
    $table->decimal('pcie_version', 2, 1)->nullable()->index();
    $table->tinyInteger('vram')->nullable()->index();
    $table->string('memory_type')->nullable();
    $table->smallInteger('memory_bus')->nullable();
    $table->smallInteger('tdp')->nullable()->index();
    $table->smallInteger('min_psu')->nullable()->index();
    $table->string('power_connectors')->nullable();
    $table->smallInteger('length_mm')->nullable()->index();
    $table->tinyInteger('slot_width')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Brand"`
- `gpu_type` — detail: `"GPU tips"` (e.g. "GeForce", "Radeon")
- `gpu_series` — detail: `"GPU series"` (e.g. "Asus Dual")
- `gpu_model` — detail: `"GPU model"` (e.g. "GeForce RTX 5050")
- `core_frequency` — detail: `"GPU core frequency"`, strip " MHz"
- `cuda_cores` — detail: `"Stream processors / CUDA Cores"`, NULL for AMD
- `pcie_version` — detail: `"PCI-E version"` — extract the leading decimal, ignoring the slot width suffix ("x8", "x16"). Use the following regex:
  ```python
  import re
  def parse_pcie_version(value: str) -> float | None:
      # Matches "5.0 x8", "4.0 x16", "3.0" etc. — captures only the version number
      match = re.match(r'(\d+\.\d+)', value.strip()) if value else None
      return float(match.group(1)) if match else None
  ```
- `vram` — detail: `"RAM"` under RAM section, strip " GB"
- `memory_type` — detail: `"Memory type"` (e.g. "GDDR6")
- `memory_bus` — detail: `"Bus width"`, strip " bit"
- `tdp` — detail: `"Power consumption (TDP)"`, strip " W"
- `min_psu` — detail: `"Minimum power supply output"`, strip " W"
- `power_connectors` — detail: `"Power sockets"` (e.g. "1x 8-pin")
- `length_mm` — detail: `"Length (mm)"`
- `slot_width` — extra details: `"Design - Number of slots"` or `"Number of slots"`

---

### 12.5 `ssds`
```sql
Schema::create('ssds', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->smallInteger('capacity')->nullable()->index();
    $table->string('type')->nullable()->index();
    $table->string('form_factor')->nullable()->index();
    $table->string('interface')->nullable()->index();
    $table->smallInteger('read_speed')->nullable();
    $table->smallInteger('write_speed')->nullable();
    $table->smallInteger('tbw')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Manufacturer"` or `"Brand"`
- `capacity` — detail: `"Capacity"`, strip " GB"
- `type` — detail: `"Type"` (e.g. "SATA", "NVMe")
- `form_factor` — detail: `"Form factor"` under Ports section (e.g. `2.5"`, `M.2`)
- `interface` — detail: `"Interface"` full string (e.g. "SATA III (6Gb/s)")
- `read_speed` — detail: `"Read speed (sequential)"`, strip " MB/s"
- `write_speed` — detail: `"Write speed (sequential)"`, strip " MB/s"
- `tbw` — detail: `"Endurance (TBW)"`, strip " TB"

---

### 12.6 `hdds`
```sql
Schema::create('hdds', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->smallInteger('capacity')->nullable()->index();
    $table->string('form_factor')->nullable()->index();
    $table->string('interface')->nullable()->index();
    $table->smallInteger('spindle_speed')->nullable();
    $table->smallInteger('cache')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Brand"`
- `capacity` — detail: `"Capacity"`, convert TB→GB (multiply by 1000), store as SMALLINT
- `form_factor` — hardcoded `"3.5\""` (since only 3.5" HDD category is scraped)
- `interface` — detail: `"Data Interface"` (e.g. "SATA III")
- `spindle_speed` — detail: `"Spindle rotation speed"`, strip " rpm"
- `cache` — detail: `"Data buffer"`, strip " MB"

---

### 12.7 `cases`
```sql
Schema::create('cases', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('form_factor')->nullable()->index();
    $table->string('supported_form_factors')->nullable();
    $table->smallInteger('max_gpu_length')->nullable()->index();
    $table->smallInteger('max_cpu_cooler_height')->nullable()->index();
    $table->smallInteger('max_radiator_size')->nullable();
    $table->smallInteger('max_psu_length')->nullable();
    $table->tinyInteger('bays_25')->nullable();
    $table->tinyInteger('bays_35')->nullable();
    $table->boolean('psu_included')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Producer"` or from name parsing
- `form_factor` — detail: `"Form factor"` (primary/largest supported, e.g. "ATX")
- `supported_form_factors` — the extra details block (flat `Key - Value<br>` lines) contains **multiple lines with the same key** `"Design - Supported motherboard form factors"`, one per supported form factor. Because `extract_extra_specs` stores only the last value for duplicate keys, you must NOT use it for this field. Instead, parse this field directly from the raw extra details text:
  ```python
  def parse_supported_form_factors(soup) -> str | None:
      """Collects all 'Design - Supported motherboard form factors' values."""
      details_div = soup.select_one("div.details.part div.content > div")
      if not details_div:
          return None
      raw = details_div.decode_contents()
      lines = [re.sub(r"<[^>]+>", "", l).strip() for l in raw.split("<br")]
      values = []
      for line in lines:
          if line.startswith("Design - Supported motherboard form factors - "):
              # split(" - ", 2) is intentional: splits into exactly 3 parts maximum,
              # so form factor names that contain " - " (e.g. a hypothetical "Mini-ITX - slim")
              # are preserved intact in parts[2] rather than being split further.
              val = line.split(" - ", 2)[2].strip()
              if val:
                  values.append(val)
      return ",".join(values) if values else None
  ```
  Example output: `"ATX,micro ATX,Mini-ITX"`
- `max_gpu_length` — detail: `"Max. Video card length, mm"`
- `max_cpu_cooler_height` — detail: `"Max. CPU cooler height, mm"`
- `max_radiator_size` — detail: `"Max. radiator size, mm"`
- `max_psu_length` — extra details: `"Design - Maximum PSU length"`, convert cm to mm if needed (×10)
- `bays_25` — detail: `"2.5\" internal HDD/SSD bays"`
- `bays_35` — detail: `"3.5\" internal HDD bays"`
- `psu_included` — detail: `"PSU"` → to_bool()

---

### 12.8 `fans`
```sql
Schema::create('fans', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->tinyInteger('size_mm')->nullable()->index();
    $table->string('connector')->nullable()->index();
    $table->smallInteger('rpm_min')->nullable();
    $table->smallInteger('rpm_max')->nullable();
    $table->decimal('noise_db', 4, 1)->nullable();
    $table->tinyInteger('units_in_package')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — detail: `"Producer"`
- `size_mm` — detail: `"Size, mm"`
- `connector` — detail: `"Output Interface"` (e.g. "4-pin (PWM)")
- `rpm_min` — detail: `"Revolutions (MIN), rpm"` or `"Fan speed (MIN), rpm"`. This field appears on the listing page for some fans but the listing scraper only collects price/stock — it does not pass through per-product spec data. Always read `rpm_min` from the detail page; expect `None` for fans where the detail page omits it.
- `rpm_max` — detail: `"RPM (MAX), rpm"`
- `noise_db` — detail: `"Sound level (MAX), dB(A)"`, NULL if "Not specified"
- `units_in_package` — detail: `"Units in package"`

---

### 12.9 `psus`
```sql
Schema::create('psus', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->smallInteger('wattage')->nullable()->index();
    $table->string('efficiency_rating')->nullable()->index();
    $table->string('psu_type')->nullable()->index();
    $table->decimal('atx_version', 2, 1)->nullable();
    $table->boolean('modular')->nullable()->index();
    $table->tinyInteger('fan_size_mm')->nullable();
    $table->tinyInteger('pcie_connectors')->nullable();
    $table->tinyInteger('eps_connectors')->nullable();
    $table->tinyInteger('sata_connectors')->nullable();
    $table->smallInteger('depth_mm')->nullable()->index();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — extra details: `"Brand"`
- `wattage` — detail: `"Power output"`, strip "W"
- `efficiency_rating` — detail: `"80 PLUS certification"` (e.g. "80 PLUS Silver")
- `psu_type` — detail: `"Power supply type"` (e.g. "ATX")
- `atx_version` — extra details: `"ATX version Performance"` or `"ATX version"`, store as DECIMAL e.g. 3.1
- `modular` — detail: `"Modular cables"` → to_bool()
- `fan_size_mm` — detail: `"Fan size"`, strip " mm"
- `pcie_connectors` — detail: `"PCI-E"` — extract the leading integer from strings like "2 X 6+2pin" or "1x 8-pin":
  ```python
  def parse_connector_count(value: str) -> int | None:
      # Matches leading integer: "2 X 6+2pin" → 2, "1 x 8-pin(4+4) EPS" → 1
      match = re.match(r'(\d+)\s*[xX]', value.strip()) if value else None
      return int(match.group(1)) if match else None
  ```
  Add `parse_connector_count` to `parsers/helpers.py` and use it for both `pcie_connectors` and `eps_connectors`.
- `eps_connectors` — detail: `"Processor plug-in"` — use `parse_connector_count` (same helper as above)
- `sata_connectors` — detail: `"SATA cconnectors"` (note: typo in source HTML, match as-is)
- `depth_mm` — extra details: `"Depth Weight & dimensions"`, strip " mm"

---

### 12.10 `coolers`
```sql
Schema::create('coolers', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('dateks_id')->unique()->index();
    $table->string('url');
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable();
    $table->boolean('in_stock')->default(false)->index();
    $table->string('stock_quantity')->nullable();
    $table->string('brand')->nullable()->index();
    $table->string('compatibility')->nullable()->index();
    $table->smallInteger('tdp_support')->nullable()->index();
    $table->smallInteger('height_mm')->nullable()->index();
    $table->tinyInteger('fan_size_mm')->nullable();
    $table->tinyInteger('fan_count')->nullable();
    $table->smallInteger('rpm_min')->nullable();
    $table->smallInteger('rpm_max')->nullable();
    $table->decimal('noise_db', 4, 1)->nullable();
    $table->string('connector')->nullable();
    $table->timestamp('scraped_at')->nullable();
});
```

**Field extraction sources:**
- `dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` — from listing page
- `brand` — detail: `"Producer"` or extra details: `"Brand"`
- `compatibility` — detail: `"Compatibility"` — store as comma-separated string (e.g. "LGA1700,LGA1851,AM4") — normalize spacing and remove "Socket " prefix for clean matching with `cpus.socket`
- `tdp_support` — extra details: `"Power - Thermal Design Power (TDP)"`, strip " W". NULL if "Not specified"
- `height_mm` — detail: `"Height, mm"`
- `fan_size_mm` — detail: `"Fan size, mm"`
- `fan_count` — detail: `"Number of fans"`
- `rpm_min` — detail: `"Fan speed (MIN), rpm"`, NULL if "Not specified"
- `rpm_max` — detail: `"Fan speed (MAX), rpm"`, NULL if "Not specified"
- `noise_db` — detail: `"Noise level (MAX), dB(A)"`, NULL if "Not specified"
- `connector` — detail: `"Output Interface"`

---

## 13. Parser Structure (Example: cpu_parser.py)

Each parser file must implement two functions:
- `parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at) -> dict | None`
- `insert(conn, data: dict) -> None`

```python
# parsers/cpu_parser.py
from bs4 import BeautifulSoup
from database import insert_row
from parsers.helpers import (
    extract_name, extract_specs, extract_extra_specs,
    to_bool, to_int, to_float
)

TABLE = "cpus"

def parse(html, dateks_id, url, price, in_stock, stock_quantity, scraped_at):
    soup = BeautifulSoup(html, "html.parser")
    specs = extract_specs(soup)
    extra = extract_extra_specs(soup)

    # Determine total cores
    perf_cores = to_int(extra.get("Performance-cores Quantity"))
    eff_cores = to_int(extra.get("Efficient-cores Quantity"))
    amd_cores = to_int(specs.get("Cores") or specs.get("Number of Performance Cores"))

    if perf_cores is not None:
        total_cores = (perf_cores or 0) + (eff_cores or 0)
    else:
        total_cores = amd_cores

    # Parse passmark — strip "+"
    passmark_raw = specs.get("Performance (PassMark)", "")
    passmark = to_int(passmark_raw.replace("+", ""))

    return {
        "dateks_id": dateks_id,
        "url": url,
        "name": extract_name(soup),
        "price": price,
        "in_stock": in_stock,
        "stock_quantity": stock_quantity,
        "brand": extra.get("Brand") or extra.get("Manufacturer"),
        "processor_type": specs.get("Type") or specs.get("Processor type"),
        "processor_number": specs.get("Processor number"),
        "architecture": extra.get("Core Name") or extra.get("CPU Architecture"),
        "socket": specs.get("Socket") or specs.get("CPU Socket"),
        "cores": total_cores,
        "performance_cores": perf_cores,
        "efficient_cores": eff_cores,
        "threads": to_int(specs.get("Threads")),
        "clock_rate": to_float(specs.get("Clock rate")),
        "turbo_frequency": to_float(specs.get("Turbo frequency")),
        "cache": to_int(specs.get("Cache")),
        "lithography": specs.get("Processing Die Lithography") or specs.get("Semiconductor Fabrication Process"),
        "tdp": to_int(specs.get("TDP") or specs.get("Thermal Design Power")),
        "max_tdp": to_int(extra.get("Maximum TDP")),
        "integrated_graphics": to_bool(specs.get("Integrated graphics")),
        "cooler_included": to_bool(specs.get("Cooler included")),
        "packaging": specs.get("Packaging"),
        "passmark": passmark,
        "memory_type": extra.get("Memory Types") or extra.get("Memory types supported by processor"),
        "max_memory": to_int(extra.get("Max Memory Size")),
        "memory_channels": to_int(extra.get("Memory Channels Supports")),
        "pcie_lanes": to_int(extra.get("Max Number of PCI Express Lanes")),
        "instruction_set": extra.get("Instruction Set") or extra.get("Processor - Processor operating modes"),
        "scraped_at": scraped_at,
    }

def insert(conn, data):
    insert_row(conn, TABLE, data)
```

All other parsers follow the exact same structure. Implement `parse()` and `insert()` for each, using the field extraction rules defined in Section 12.

---

## 14. Parser Helpers (parsers/helpers.py)

Create a `parsers/helpers.py` file containing all shared utility functions:
- `extract_name(soup)` — see Section 11
- `extract_specs(soup)` — see Section 11
- `extract_extra_specs(soup)` — see Section 11
- `to_bool(value)` — see Section 11
- `to_int(value)` — see Section 11
- `to_float(value)` — see Section 11
- `tb_to_gb(value)` — see Section 11
- `parse_pcie_version(value)` — see Section 12.4 (GPU)
- `parse_memory_speeds(value)` — see Section 12.2 (Motherboard)
- `parse_supported_form_factors(soup)` — see Section 12.7 (Cases)
- `parse_connector_count(value)` — see Section 12.9 (PSU)

---

## 15. Error Handling

If any error occurs during scraping a product detail page, the scraper must:
1. Print the full error message to console
2. Print the URL that caused the error
3. Close the database connection
4. Exit with code 1

```python
except Exception as e:
    print(f"\n[ERROR] Failed on URL: {url}")
    print(f"[ERROR] {e}")
    conn.close()
    exit(1)
```

---

## 16. Console Output Format

```
Starting scrape at 2025-01-01 12:00:00
Categories: cpu, gpu

[CPU] Wiping table 'cpus'...
  Collecting URLs from: https://www.dateks.lv/en/cenas/procesori-intel
    Page 1: 24 products
    Page 2: 24 products
    Page 3: 11 products
  Found 59 products
  Collecting URLs from: https://www.dateks.lv/en/cenas/procesori-amd
    Page 1: 24 products
    Page 2: 18 products
  Found 42 products
  Total: 101 products to scrape
  [1/101] Scraping: https://www.dateks.lv/en/cenas/procesori-intel/...
  [2/101] Scraping: https://www.dateks.lv/en/cenas/procesori-intel/...
  ...
  Done with CPU

[GPU] Wiping table 'gpus'...
  ...

Scrape complete.
```

---

## 17. Key Compatibility Relationships (for future PC Builder logic)

| Check | Field A | Field B |
|---|---|---|
| CPU ↔ Motherboard | `cpus.socket` | `motherboards.socket` |
| Motherboard ↔ RAM | `motherboards.memory_type` | `ram.memory_type` |
| Motherboard ↔ RAM speed | `motherboards.memory_max_speed` | `ram.frequency` |
| Motherboard ↔ RAM slots | `motherboards.memory_slots` | count of RAM sticks |
| Motherboard ↔ NVMe SSD | `motherboards.m2_slots` | count of NVMe SSDs |
| Motherboard ↔ SATA storage | `motherboards.sata_ports` | count of SATA SSDs + HDDs |
| GPU ↔ Motherboard | `gpus.pcie_version` ≤ `motherboards` PCIe support | via chipset |
| GPU ↔ Case | `gpus.length_mm` ≤ `cases.max_gpu_length` | |
| GPU ↔ PSU (wattage) | `gpus.min_psu` ≤ `psus.wattage` | |
| GPU ↔ PSU (connectors) | `gpus.power_connectors` | `psus.pcie_connectors` |
| CPU ↔ Cooler | `cpus.socket` in `coolers.compatibility` | |
| CPU ↔ Cooler (TDP) | `cpus.tdp` ≤ `coolers.tdp_support` | |
| Cooler ↔ Case | `coolers.height_mm` ≤ `cases.max_cpu_cooler_height` | |
| HDD ↔ Case | count of HDDs ≤ `cases.bays_35` | |
| SSD ↔ Case (2.5") | count of 2.5" SSDs ≤ `cases.bays_25` | |
| Motherboard ↔ Case | `motherboards.form_factor` in `cases.supported_form_factors` | |
| PSU ↔ Case | `psus.depth_mm` ≤ `cases.max_psu_length` | |
| RAM ↔ CPU | `ram.memory_type` in `cpus.memory_type` | |
| Total TDP ↔ PSU | sum of component TDPs ≤ `psus.wattage` × 0.8 | 80% rule |