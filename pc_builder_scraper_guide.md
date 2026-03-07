# PC Builder — Scraper Build Guide

> **Purpose:** Everything needed to understand, rebuild, or extend the Python scraper for the PC Builder project. Covers architecture, HTML extraction rules, field-by-field key mappings (confirmed from real dateks.lv HTML), type conversions, and the full database schema.
>
> **Design principle:** Only fields needed for compatibility matching or display. No extra-details scraping — all data comes from `#params` only. Form factor compatibility (mobo↔case) is handled in application logic, not SQL.

---

## 1. Project Overview

Python scraper that collects PC component data from [https://www.dateks.lv/en](https://www.dateks.lv/en) and stores it in MySQL. Powers a Laravel 12 + Inertia + React PC builder app.

```bash
python3 main.py
```

Prompts for categories, wipes those tables, scrapes and inserts fresh data.

---

## 2. Tech Stack

| Tool                     | Purpose            |
| ------------------------ | ------------------ |
| Python 3                 | Runtime            |
| `requests`               | HTTP               |
| `beautifulsoup4`         | HTML parsing       |
| `mysql-connector-python` | MySQL              |
| `python-dotenv`          | `.env` credentials |

```bash
pip install requests beautifulsoup4 mysql-connector-python python-dotenv
```

---

## 3. File Structure

```
scraper/
├── main.py
├── config.py
├── database.py
├── .env
├── .env.example
├── .gitignore
├── scrapers/
│   ├── base_scraper.py
│   ├── list_scraper.py
│   └── detail_scraper.py
└── parsers/
    ├── helpers.py
    ├── cpu_parser.py
    ├── motherboard_parser.py
    ├── ram_parser.py
    ├── gpu_parser.py
    ├── ssd_parser.py
    ├── hdd_parser.py
    ├── case_parser.py
    ├── fan_parser.py
    ├── psu_parser.py
    └── cooler_parser.py
```

---

## 4. HTML Structure

### Spec extraction (`extract_specs`)

All fields come from `#params .fv` rows:

```html
<div class="fv closed">
  <span class="k">Socket</span>
  <span class="v">AM4</span>
</div>
```

Returns `dict[str, str]`. Key is `span.k` text with trailing `:` stripped.

**No extra-details scraping.** The `div.details.part` block was dropped — it was unreliable and none of its fields are needed for compatibility checking.

### Listing page fields

`dateks_id`, `url`, `price`, `in_stock`, `stock_quantity` are parsed from the listing page by `list_scraper.py`, not the detail page.

---

## 5. Socket Normalisation

Applied identically in `cpu_parser`, `motherboard_parser`, and `cooler_parser`. Must produce exactly the same string for JOIN/IN queries to work.

```python
def _normalise_socket(value):
    s = re.sub(r'^[Ss]ocket\s+', '', value.strip())  # strip "Socket " prefix
    return s.replace(" ", "") or None                 # remove spaces: "LGA 1700" → "LGA1700"
```

| Raw value       | Normalised  |
| --------------- | ----------- |
| `"Socket AM4"`  | `"AM4"`     |
| `"AM4"`         | `"AM4"`     |
| `"LGA 1700"`    | `"LGA1700"` |
| `"LGA 1851"`    | `"LGA1851"` |
| `"Socket sTR5"` | `"sTR5"`    |

---

## 6. Parser Helpers (`parsers/helpers.py`)

| Function                       | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `extract_name(soup)`           | Product name from `<h1 class="name">`                      |
| `extract_specs(soup)`          | `dict` from `#params .fv` rows                             |
| `to_bool(value)`               | `"Ir"/"Yes"` → True, `"Nav"/"No"/"Not"` → False, else None |
| `to_int(value)`                | Strips units, returns int. `"65W"` → 65, `"CL 40"` → 40    |
| `to_float(value)`              | Strips units, returns float                                |
| `tb_to_gb(value)`              | `"2 TB"` → 2000, `"500 GB"` → 500                          |
| `parse_pcie_version(value)`    | `"5.0 x16"` → 5.0                                          |
| `parse_memory_speeds(value)`   | `"DDR5 6400 (OC 9200)"` → (6400, 9200)                     |
| `parse_connector_count(value)` | `"2 X 6+2pin"` → 2                                         |

---

## 7. Field Mappings by Parser

### 7.1 `cpu_parser` → `cpus`

| Field                 | Key in `#params`                                                                       | Notes                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `socket`              | `"Socket"`                                                                             | Normalised. AMD: `"Socket AM4"` → `"AM4"`, Intel: `"LGA 1700"` → `"LGA1700"` |
| `cores`               | Intel: `"Number of Performance Cores"` + `"Efficient number of cores"`, AMD: `"Cores"` | Summed for Intel                                                             |
| `threads`             | `"Threads"`                                                                            | `smallInteger` — Threadripper has 128                                        |
| `clock_rate`          | `"Clock rate"`                                                                         | GHz                                                                          |
| `turbo_frequency`     | `"Turbo frequency"`                                                                    | GHz                                                                          |
| `tdp`                 | Intel: `"TDP"`, AMD: `"Thermal Design Power"`                                          | W                                                                            |
| `integrated_graphics` | `"Integrated graphics"`                                                                | `"No"/"Not"` → False, iGPU name (e.g. `"Intel UHD 770"`) → True              |
| `cooler_included`     | `"Cooler included"`                                                                    | `"Nav"` → False, `"Ir"` → True. Critical: False = must add cooler            |
| `passmark`            | `"Performance (PassMark)"`                                                             | Strip `"+"`. `"22000+"` → 22000                                              |

---

### 7.2 `motherboard_parser` → `motherboards`

| Field              | Key in `#params`                            | Notes                                                                  |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------------------- |
| `socket`           | Intel: `"CPU Socket"`, AMD: `"Socket"`      | Normalised same as cpus                                                |
| `chipset`          | `"Chipset"`                                 | Vendor prefix stripped: `"Intel Z890"` → `"Z890"`                      |
| `form_factor`      | Intel: `"Form factor"`, AMD: `"Plate size"` | `"ATX"`, `"mATX"`                                                      |
| `memory_type`      | `"Type"`                                    | `"DDR5"`, `"DDR4"`                                                     |
| `memory_slots`     | `"RAM Slots"`                               |                                                                        |
| `memory_max_speed` | `"Memory support"`                          | `parse_memory_speeds()` takes OC value: `"DDR5 6400 (OC 9200)"` → 9200 |
| `m2_slots`         | Intel: `"M.2 Port"`, AMD: `"M.2 ports"`     | Singular/plural varies                                                 |
| `sata_ports`       | `"SATA3 ports"`                             |                                                                        |
| `wifi`             | `"Built-in Wi-Fi"`                          | `"Ir"` → True, `"Nav"` → False                                         |

---

### 7.3 `ram_parser` → `ram`

| Field           | Key in `#params`      | Notes                              |
| --------------- | --------------------- | ---------------------------------- |
| `memory_type`   | `"Type"`              | `"DDR5"`, `"DDR4"`                 |
| `capacity`      | `"Capacity"`          | `"64 GB"` → 64 via `to_int()`      |
| `frequency`     | `"Maximum frequency"` | `"5600 MHz"` → 5600                |
| `cl_latency`    | `"CL"`                | `"CL 40"` → 40 via `to_int()`      |
| `modules_count` | `"KIT"`               | `"Kit of 2 modules"` → 2 via regex |

---

### 7.4 `gpu_parser` → `gpus`

| Field              | Key in `#params`                | Notes                                        |
| ------------------ | ------------------------------- | -------------------------------------------- |
| `gpu_model`        | `"GPU model"`                   | `"Radeon RX 9070 XT"`                        |
| `vram`             | `"RAM"`                         | `"16 GB"` → 16                               |
| `tdp`              | `"Power consumption (TDP)"`     | `"330 W"` → 330                              |
| `min_psu`          | `"Minimum power supply output"` | `"700 W"` → 700                              |
| `pcie_version`     | `"PCI-E version"`               | `"5.0 x16"` → 5.0 via `parse_pcie_version()` |
| `length_mm`        | `"Length (mm)"`                 | `"331"` → 331                                |
| `power_connectors` | `"Power sockets"`               | Stored raw: `"1x 16-pin"`                    |

---

### 7.5 `ssd_parser` → `ssds`

| Field         | Key in `#params`                 | Notes                                                                           |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| `capacity`    | `"Capacity"`                     | `"1 TB"` → 1000 via `tb_to_gb()`                                                |
| `type`        | `"Type"`                         | `"NVMe"`, `"SATA"`                                                              |
| `form_factor` | `"Form factor"`                  | Normalised: `"M.2 80mm (2280)"` → `"M.2"`, `"2.5"`                              |
| `interface`   | `"Interface"` (first occurrence) | Key appears twice — must take **first** match only. `"PCIe 4.0 x4"` not `"M.2"` |
| `read_speed`  | `"Read speed (sequential)"`      | `"7450 MB/s"` → 7450                                                            |
| `write_speed` | `"Write speed (sequential)"`     | `"6900 MB/s"` → 6900                                                            |

---

### 7.6 `hdd_parser` → `hdds`

| Field         | Key in `#params`   | Notes                            |
| ------------- | ------------------ | -------------------------------- |
| `capacity`    | `"Capacity"`       | `"2 TB"` → 2000 via `tb_to_gb()` |
| `form_factor` | —                  | Not in `#params`. Always null    |
| `interface`   | `"Data Interface"` | `"SATA III"`                     |

---

### 7.7 `case_parser` → `cases`

| Field                   | Key in `#params`               | Notes                               |
| ----------------------- | ------------------------------ | ----------------------------------- |
| `form_factor`           | `"Form factor"`                | `"Extended ATX"`, `"ATX"`, `"mATX"` |
| `max_gpu_length`        | `"Max. Video card length, mm"` | `"380"` → 380                       |
| `max_cpu_cooler_height` | `"Max. CPU cooler height, mm"` | `"175"` → 175                       |
| `max_psu_length`        | `"Max. PSU length, mm"`        | Not seen yet, likely null           |
| `bays_25`               | `'2.5" internal HDD/SSD bays'` |                                     |
| `bays_35`               | `'3.5" internal HDD bays'`     |                                     |
| `psu_included`          | `"PSU"`                        | `"Nav"` → False                     |

**Note:** Mobo↔case form factor compatibility is handled in application logic (e.g. ATX fits Tower/Full-Tower, mATX fits Mid-Tower etc.), not via a stored field.

---

### 7.8 `fan_parser` → `fans`

| Field              | Key in `#params`             | Notes                    |
| ------------------ | ---------------------------- | ------------------------ |
| `size_mm`          | `"Size, mm"`                 | `"120"` → 120            |
| `connector`        | `"Output Interface"`         | `"4-pin (PWM)"`          |
| `rpm_max`          | `"RPM (MAX), rpm"`           | `"3000"` → 3000          |
| `rpm_min`          | `"RPM (MIN), rpm"`           | Often absent, null       |
| `noise_db`         | `"Sound level (MAX), dB(A)"` | `"Not specified"` → None |
| `units_in_package` | `"Units in package"`         |                          |

---

### 7.9 `psu_parser` → `psus`

| Field               | Key in `#params`          | Notes                                                            |
| ------------------- | ------------------------- | ---------------------------------------------------------------- |
| `wattage`           | `"Power output"`          | `"1200W"` → 1200                                                 |
| `efficiency_rating` | `"80 PLUS certification"` | `"80 PLUS Platinum"`                                             |
| `psu_type`          | `"Power supply type"`     | `"ATX"`, `"SFX"`                                                 |
| `modular`           | `"Modular cables"`        | `"Fully-Modular"/"Semi-Modular"` → True, `"Non-Modular"` → False |
| `fan_size_mm`       | `"Fan size"`              | `"120 mm"` → 120                                                 |
| `pcie_connectors`   | `"PCI-E"`                 | `"4 X 6+2pin"` → 4 via `parse_connector_count()`                 |
| `eps_connectors`    | `"Processor plug-in"`     | `"2 x 8-pin(4+4) EPS"` → 2                                       |
| `sata_connectors`   | `"SATA cconnectors"`      | **Typo in dateks HTML** — double-c, match as-is                  |

---

### 7.10 `cooler_parser` → `coolers`

| Field           | Key in `#params`              | Notes                                                                                        |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `compatibility` | `"Compatibility"`             | `"AM4, AM5, LGA1150, LGA 1700"` → `"AM4,AM5,LGA1150,LGA1700"` — same normalisation as socket |
| `tdp_support`   | `"Cooling capacity (TDP), W"` | `"Not specified"` → None                                                                     |
| `height_mm`     | `"Height, mm"`                | `"158"` → 158                                                                                |
| `fan_size_mm`   | `"Fan size, mm"`              | `"140"` → 140                                                                                |

---

## 8. Database Schema (Laravel Migration)

All tables match parser output exactly. See `2024_01_01_000000_create_pc_builder_tables.php`.

### Index strategy

- **Compatibility fields** (`socket`, `memory_type`, `form_factor`, `interface`, `compatibility`) → always indexed
- **Range filters** (`price`, `tdp`, `wattage`, `passmark`, `vram`, `capacity`, `length_mm`, `height_mm`) → indexed
- **Boolean filters** (`in_stock`, `integrated_graphics`, `cooler_included`, `wifi`, `modular`, `psu_included`) → indexed
- **Display-only** (`threads`, `clock_rate`, `noise_db`, `bays`, `power_connectors`) → not indexed

### Removed columns

- `supported_form_factors` (motherboards) — mobo↔case fit handled in app logic
- `depth_mm` (PSUs) — PSU↔case length check dropped for this project scope
- `max_psu_length` (cases) — counterpart to depth_mm, also dropped

### Column type corrections

- `fans.size_mm`, `psus.fan_size_mm`, `coolers.fan_size_mm` — `smallInteger` not `tinyInteger` (tinyInt max 127mm would exclude 140mm+ fans)

---

## 9. Error Handling

Each category tolerates up to **10 errors** before aborting that category. Individual product failures (duplicates, missing fields, network blips) are skipped and logged — the scraper continues to the next product.

```python
MAX_ERRORS_PER_CATEGORY = 10
```

Behaviour per product error:

- Prints `[SKIP N/10] <url>` and the exception message
- Increments error counter
- Continues to next product

At 10 errors for a category:

- Prints `[ABORT] CATEGORY reached 10 errors — stopping category`
- Moves on to the next selected category (does **not** exit the whole run)

At end of each category a summary is printed:

```
[CPU] Done: 142 inserted, 3 skipped
Skipped URLs:
  https://www.dateks.lv/... → 1264 (22003): Out of range value...
```

**Common skip reasons:**

- Duplicate `dateks_id` (same product listed in two category URLs) → MySQL unique constraint → skip silently
- Out-of-range value (e.g. tinyInteger overflow) → fix the column type in migration
- Missing `#params` block on the page → parser returns partial data

---

## 10. Compatibility Relationships

| Check                      | Source                     | Target                                |
| -------------------------- | -------------------------- | ------------------------------------- |
| CPU ↔ Motherboard          | `cpus.socket`              | `= motherboards.socket`               |
| Motherboard ↔ RAM type     | `motherboards.memory_type` | `= ram.memory_type`                   |
| Motherboard ↔ RAM speed    | `ram.frequency`            | `≤ motherboards.memory_max_speed`     |
| Motherboard ↔ RAM slots    | count of sticks            | `≤ motherboards.memory_slots`         |
| Motherboard ↔ NVMe SSD     | count of NVMe SSDs         | `≤ motherboards.m2_slots`             |
| Motherboard ↔ SATA storage | count of SATA SSDs + HDDs  | `≤ motherboards.sata_ports`           |
| Motherboard ↔ Case         | `motherboards.form_factor` | app logic (ATX fits tower etc.)       |
| GPU ↔ Case                 | `gpus.length_mm`           | `≤ cases.max_gpu_length`              |
| GPU ↔ PSU wattage          | `gpus.min_psu`             | `≤ psus.wattage`                      |
| CPU ↔ Cooler socket        | `cpus.socket`              | `IN coolers.compatibility`            |
| CPU ↔ Cooler TDP           | `cpus.tdp`                 | `≤ coolers.tdp_support`               |
| Cooler ↔ Case              | `coolers.height_mm`        | `≤ cases.max_cpu_cooler_height`       |
| PSU ↔ Case                 | `psus.depth_mm`            | `≤ cases.max_psu_length` (often null) |
| HDD ↔ Case bays            | count of HDDs              | `≤ cases.bays_35`                     |
| SSD 2.5" ↔ Case bays       | count of 2.5" SSDs         | `≤ cases.bays_25`                     |
| No GPU needed              | `cpus.integrated_graphics` | `= true`                              |
| Total TDP ↔ PSU            | sum of TDPs                | `≤ psus.wattage × 0.8`                |
