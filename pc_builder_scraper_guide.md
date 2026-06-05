# PC Builder Scraper Guide

This guide documents the current Python scraper used by the PC Builder project. The scraper imports component data from Dateks into the MySQL tables used by the Laravel + Inertia + React app.

The guide is meant for maintenance work: adding a new component type, fixing a parser, understanding which Dateks fields populate which database columns, or running scraper jobs from Docker/admin tooling.

## 1. Overview

The scraper lives in `scraper/` and collects products from [dateks.lv/en](https://www.dateks.lv/en). It has two runtime modes:

- CLI mode through `main.py`
- HTTP streaming mode through `server.py`, used by the Laravel admin scraper page

The normal scrape flow is:

1. Select one or more categories.
2. Connect to MySQL using `.env` values.
3. Delete existing rows for each selected component table.
4. Collect product URLs, prices, stock status, stock quantity, and Dateks IDs from listing pages.
5. Fetch each product detail page.
6. Parse only the needed specifications from `#params`.
7. Insert parsed rows into the matching Laravel component table.
8. Print plain log lines and `[META]` lines for the admin UI/history flow.

The scraper intentionally imports only fields needed for display, filtering, generation, or compatibility checks.

## 2. Tech Stack

| Tool                   | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| Python 3               | Runtime                                  |
| Flask                  | HTTP wrapper for admin-triggered scrapes |
| requests               | HTTP client                              |
| BeautifulSoup          | HTML parsing                             |
| mysql-connector-python | MySQL writes                             |
| python-dotenv          | Environment loading                      |
| Docker                 | Scraper service in local Sail stack      |

Install dependencies directly with:

```bash
pip install -r scraper/requirements.txt
```

## 3. File Structure

```text
scraper/
|-- Dockerfile
|-- config.py
|-- database.py
|-- main.py
|-- requirements.txt
|-- server.py
|-- parsers/
|   |-- case_parser.py
|   |-- cooler_parser.py
|   |-- cpu_parser.py
|   |-- fan_parser.py
|   |-- gpu_parser.py
|   |-- hdd_parser.py
|   |-- helpers.py
|   |-- motherboard_parser.py
|   |-- psu_parser.py
|   |-- ram_parser.py
|   `-- ssd_parser.py
`-- scrapers/
    |-- base_scraper.py
    |-- detail_scraper.py
    `-- list_scraper.py
```

Supporting Laravel files:

```text
website/
|-- app/Http/Controllers/AdminController.php
|-- app/Services/ComponentFilters.php
|-- app/Services/CompatibilityService.php
|-- app/Helpers/CompatibilityHelper.php
|-- database/migrations/2026_03_06_191334_create_component_tables.php
|-- database/migrations/2026_05_21_080759_create_scrape_sessions_table.php
|-- database/migrations/2026_05_21_084545_create_scrape_results_table.php
`-- compose.yaml
```

## 4. Running The Scraper

### CLI

Run from `scraper/`:

```bash
python3 main.py
```

Without arguments, the scraper prompts for categories.

Run one category:

```bash
python3 main.py cpu
```

Run several categories:

```bash
python3 main.py cpu,gpu,ram
```

Run everything:

```bash
python3 main.py all
```

Optional arguments:

```bash
python3 main.py <category-or-all> <max-errors> <page-delay>
```

Example:

```bash
python3 main.py gpu 10 0.2
```

### Docker / Sail

`website/compose.yaml` defines a `scraper` service. It mounts `../scraper` into `/app` and shares `website/.env` as `/app/.env`, so the scraper uses the same database credentials as Laravel.

From `website/`:

```bash
./vendor/bin/sail exec scraper python3 main.py all
```

### Admin HTTP Mode

`server.py` exposes:

```text
POST /scrape
```

Expected JSON body:

```json
{
  "category": "cpu",
  "max_errors": 10,
  "page_delay": 0.2
}
```

The Flask server starts:

```bash
python3 server.py
```

Inside Docker it listens on `0.0.0.0:5000`. Laravel calls it at `http://scraper:5000/scrape` and streams the response to the browser.

## 5. Environment

The scraper reads database settings with `python-dotenv`:

```env
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=website
DB_USERNAME=sail
DB_PASSWORD=password
```

When running directly on the host machine, `DB_HOST` is usually `127.0.0.1` or `localhost`. In the Docker/Sail network, use the MySQL service name, usually `mysql`.

The old `scraper/.env.example` notes that the scraper can use the website `.env` in Docker. That is still how `website/compose.yaml` is wired.

## 6. Categories

Categories are configured in `scraper/config.py`.

| Category      | Dateks source                        | Parser               | Table          |
| ------------- | ------------------------------------ | -------------------- | -------------- |
| `cpu`         | Intel CPUs, AMD CPUs                 | `cpu_parser`         | `cpus`         |
| `motherboard` | Intel motherboards, AMD motherboards | `motherboard_parser` | `motherboards` |
| `ram`         | RAM                                  | `ram_parser`         | `rams`         |
| `gpu`         | Video cards                          | `gpu_parser`         | `gpus`         |
| `ssd`         | SSDs                                 | `ssd_parser`         | `ssds`         |
| `hdd`         | 3.5-inch HDDs                        | `hdd_parser`         | `hdds`         |
| `case`        | PC cases                             | `case_parser`        | `cases`        |
| `fan`         | Case fans                            | `fan_parser`         | `fans`         |
| `psu`         | Power supplies                       | `psu_parser`         | `psus`         |
| `cooler`      | Air CPU coolers                      | `cooler_parser`      | `coolers`      |

## 7. Scraping Pipeline

### HTTP Fetching

`scrapers/base_scraper.py` creates a shared `requests.Session` with browser-like headers:

- `User-Agent`
- `Accept-Language`

`fetch(url)` follows redirects, times out after 15 seconds, and raises for non-success status codes.

### Listing Pages

`scrapers/list_scraper.py` reads each category listing page and follows pagination:

- Page 1 is the base URL.
- Later pages use `/pg/{page}`.
- If Dateks redirects away from the expected paginated URL, pagination stops.

For each `a.imp[data-id]`, it extracts:

| Field            | Source                                                     |
| ---------------- | ---------------------------------------------------------- |
| `dateks_id`      | `data-id` attribute                                        |
| `url`            | product link `href`, prefixed with `https://www.dateks.lv` |
| `price`          | `.price` text, with euro sign and commas removed           |
| `stock_status`   | `.avail` text mapped to enum values                        |
| `stock_quantity` | `>?\d+ units` text when available                          |

Stock status values:

| Listing text                                     | Stored value   |
| ------------------------------------------------ | -------------- |
| starts with `in stock` or `in office`            | `in_stock`     |
| contains `can be ordered` or starts with `order` | `orderable`    |
| anything else or missing availability            | `out_of_stock` |

### Detail Pages

`scrapers/detail_scraper.py` fetches the product detail page and returns raw HTML to the parser.

### Database Writes

`database.py` provides:

- `get_connection()` - opens a MySQL connection from `.env`.
- `wipe_table(conn, table)` - deletes all rows from the selected table and resets auto-increment.
- `insert_row(conn, table, data)` - builds a parameterized `INSERT` for parser output.

Each selected category is wiped before that category is imported.

## 8. HTML Extraction Rules

### Product Name

`extract_name(soup)` reads:

```text
h1.name
```

If the heading contains a nested `span`, the span text is used.

### Specification Table

`extract_specs(soup)` reads rows from:

```text
#params .fv
```

Expected Dateks shape:

```html
<div class="fv closed">
  <span class="k">Socket</span>
  <span class="v">AM4</span>
</div>
```

The helper returns:

```python
dict[str, str]
```

Keys are stripped of a trailing colon. Values are stripped text.

### Duplicate Spec Keys

Most parsers use `extract_specs`, so duplicate Dateks keys will be overwritten by the last value. SSDs are the special case: `ssd_parser.py` manually scans `#params .fv` to capture the first `Interface` value because Dateks can show more than one `Interface` row.

## 9. Shared Parser Helpers

| Helper                | Current behavior                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `extract_name(soup)`  | Reads product name from `h1.name`, preferring nested `span` text.                                                                         |
| `extract_specs(soup)` | Builds a dict from `#params .fv span.k/span.v`.                                                                                           |
| `to_bool(value)`      | Returns `None` only when input is `None`; returns `True` for `ir`, `yes`, `is`, `true`, `1`; returns `False` for any other non-null text. |
| `to_int(value)`       | Returns first integer found after removing commas. Treats `not specified`, `nav norādīts`, `nav`, and empty text as `None`.               |
| `to_float(value)`     | Returns first decimal/number, replacing comma with dot. Same empty/not-specified handling as `to_int`.                                    |
| `tb_to_gb(value)`     | Converts `TB` to decimal GB (`2 TB` -> `2000`), otherwise returns the integer GB value.                                                   |

Several parser-specific helpers also exist, such as socket normalization, chipset cleanup, connector counts, GPU vendor detection, and SSD form-factor normalization.

## 10. Field Mappings By Parser

Every parser includes these shared columns:

```text
dateks_id, url, name, price, stock_status, stock_quantity, scraped_at
```

### `cpu_parser.py` -> `cpus`

| Column                | Source                                                                  | Notes                                                                                    |
| --------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `type`                | Product URL                                                             | `intel` if URL contains `procesori-intel`, otherwise `amd`.                              |
| `socket`              | `Socket`                                                                | Removes leading `Socket` and all spaces.                                                 |
| `cores`               | `Number of Performance Cores` + `Efficient number of cores`, or `Cores` | Intel hybrid cores are summed.                                                           |
| `threads`             | `Threads`                                                               | Integer.                                                                                 |
| `clock_rate`          | `Clock rate`                                                            | Float.                                                                                   |
| `turbo_frequency`     | `Turbo frequency`                                                       | Float.                                                                                   |
| `tdp`                 | `TDP` or `Thermal Design Power`                                         | Integer watts.                                                                           |
| `integrated_graphics` | `Integrated graphics`                                                   | False for `nav`, `no`, `not`, `nav norādīts`, or empty; true for other non-empty values. |
| `cooler_included`     | `Cooler included`                                                       | Uses `to_bool`.                                                                          |
| `passmark`            | `Performance (PassMark)`                                                | Removes `+`, then parses integer.                                                        |

Socket examples:

| Raw           | Stored    |
| ------------- | --------- |
| `Socket AM4`  | `AM4`     |
| `LGA 1700`    | `LGA1700` |
| `LGA 1851`    | `LGA1851` |
| `Socket sTR5` | `sTR5`    |

### `motherboard_parser.py` -> `motherboards`

| Column             | Source                        | Notes                                       |
| ------------------ | ----------------------------- | ------------------------------------------- |
| `socket`           | `CPU Socket` or `Socket`      | Same normalization as CPU socket.           |
| `chipset`          | `Chipset`                     | Strips leading `Intel`, `AMD`, or `NVIDIA`. |
| `form_factor`      | `Form factor` or `Plate size` | Stored as Dateks text.                      |
| `memory_type`      | `Type`                        | Usually `DDR4` or `DDR5`.                   |
| `memory_slots`     | `RAM Slots`                   | Integer.                                    |
| `memory_max_speed` | `Memory support`              | Highest parsed 4-5 digit speed.             |
| `m2_slots`         | `M.2 Port` or `M.2 ports`     | Integer.                                    |
| `sata_ports`       | `SATA3 ports`                 | Integer.                                    |
| `wifi`             | `Built-in Wi-Fi`              | Uses `to_bool`.                             |

`_parse_memory_speeds` returns `(base_speed, max_speed)`, but only `max_speed` is stored.

### `ram_parser.py` -> `rams`

| Column          | Source              | Notes                                                                                   |
| --------------- | ------------------- | --------------------------------------------------------------------------------------- |
| `memory_type`   | `Type`              | Usually `DDR4` or `DDR5`.                                                               |
| `capacity`      | `Capacity`          | GB integer.                                                                             |
| `frequency`     | `Maximum frequency` | MHz integer.                                                                            |
| `cl_latency`    | `CL`                | First integer from text like `CL 40`.                                                   |
| `modules_count` | `KIT`               | First integer in the kit text; returns `None` when missing even though DB default is 1. |

### `gpu_parser.py` -> `gpus`

| Column             | Source                           | Notes                                                                                                                |
| ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `type`             | Product name                     | `amd`, `nvidia`, `intel`, or `None`.                                                                                 |
| `gpu_model`        | `GPU model`                      | Raw Dateks value.                                                                                                    |
| `vram`             | `RAM`                            | GB integer.                                                                                                          |
| `tdp`              | `Power consumption (TDP)`        | Watts.                                                                                                               |
| `min_psu`          | `Minimum power supply output`    | Watts.                                                                                                               |
| `pcie_version`     | `PCI-E version`                  | Leading decimal such as `5.0`.                                                                                       |
| `length_mm`        | `Length (mm)`                    | Integer.                                                                                                             |
| `power_connectors` | `Power sockets`                  | Raw text.                                                                                                            |
| `cuda`             | `Stream processors / CUDA Cores` | First integer.                                                                                                       |
| `bus`              | `Bus width`                      | First integer.                                                                                                       |
| `vram_freq`        | `Memory type`                    | First integer, if present. This field name is misleading: Dateks may provide memory type text rather than frequency. |

GPU type detection checks the lowercased name:

| Match                      | Type     |
| -------------------------- | -------- |
| `radeon` or `rx`           | `amd`    |
| `geforce`, `rtx`, or `gtx` | `nvidia` |
| `arc` or `intel`           | `intel`  |

### `ssd_parser.py` -> `ssds`

| Column        | Source                     | Notes                                               |
| ------------- | -------------------------- | --------------------------------------------------- |
| `capacity`    | `Capacity`                 | `TB` converted to decimal GB.                       |
| `type`        | `Type`                     | Raw Dateks value, such as `NVMe` or `SATA`.         |
| `form_factor` | `Form factor`              | Normalizes prefixes to `M.2`, `2.5`, or `3.5`.      |
| `interface`   | first `Interface` row      | Captured manually to avoid duplicate-key overwrite. |
| `read_speed`  | `Read speed (sequential)`  | MB/s integer.                                       |
| `write_speed` | `Write speed (sequential)` | MB/s integer.                                       |

### `hdd_parser.py` -> `hdds`

| Column      | Source           | Notes                         |
| ----------- | ---------------- | ----------------------------- |
| `capacity`  | `Capacity`       | `TB` converted to decimal GB. |
| `interface` | `Data Interface` | Raw Dateks value.             |

The current HDD table does not include `form_factor`.

### `case_parser.py` -> `cases`

| Column                  | Source                       | Notes                                                                   |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| `form_factor`           | `Form factor`                | Raw Dateks value.                                                       |
| `max_gpu_length`        | `Max. Video card length, mm` | Integer.                                                                |
| `max_cpu_cooler_height` | `Max. CPU cooler height, mm` | Integer.                                                                |
| `bays_25`               | `2.5" internal HDD/SSD bays` | Integer.                                                                |
| `bays_35`               | `3.5" internal HDD bays`     | Integer.                                                                |
| `psu_wattage`           | `PSU`                        | `0` for `nav`, `no`, `not`, empty, or missing; otherwise first integer. |

`psu_wattage` represents an included case PSU. The current app uses it to avoid suggesting a separate PSU when the case already includes a sufficient one.

### `fan_parser.py` -> `fans`

| Column             | Source             | Notes             |
| ------------------ | ------------------ | ----------------- |
| `size_mm`          | `Size, mm`         | Integer.          |
| `connector`        | `Output Interface` | Raw Dateks value. |
| `rpm_max`          | `RPM (MAX), rpm`   | Integer.          |
| `units_in_package` | `Units in package` | Integer.          |

The current fan parser does not store `rpm_min` or `noise_db`.

### `psu_parser.py` -> `psus`

| Column              | Source                                  | Notes                                                                                                         |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `wattage`           | `Power output`                          | Integer watts.                                                                                                |
| `efficiency_rating` | `80 PLUS certification`                 | Raw Dateks value.                                                                                             |
| `psu_type`          | `Power supply type`                     | Raw Dateks value.                                                                                             |
| `modular`           | `Modular cables`                        | False if text contains `non` or equals `nav`, `no`, `not`; true if text contains `modular`; otherwise `None`. |
| `fan_size_mm`       | `Fan size`                              | Integer.                                                                                                      |
| `pcie_connectors`   | `PCI-E`                                 | Leading connector count from patterns like `4 X ...`.                                                         |
| `eps_connectors`    | `Processor plug-in`                     | Leading connector count from patterns like `2 x ...`.                                                         |
| `sata_connectors`   | `SATA cconnectors` or `SATA connectors` | Handles the Dateks typo and the corrected spelling.                                                           |

### `cooler_parser.py` -> `coolers`

| Column          | Source                      | Notes                                                                                                  |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `compatibility` | `Compatibility`             | Split on commas or slashes, remove leading `Socket`, remove spaces, then store comma-separated values. |
| `tdp_support`   | `Cooling capacity (TDP), W` | Integer watts.                                                                                         |
| `height_mm`     | `Height, mm`                | Integer.                                                                                               |
| `fan_size_mm`   | `Fan size, mm`              | Integer.                                                                                               |

Compatibility example:

```text
AM4, AM5, LGA 1700 -> AM4,AM5,LGA1700
```

## 11. Database Schema

The component tables are created by:

```text
website/database/migrations/2026_03_06_191334_create_component_tables.php
```

Every component table has:

- `id`
- `dateks_id` unique
- `url`
- `name`
- `price`
- `stock_status`
- `stock_quantity`
- component-specific columns
- `scraped_at`

Current table-specific columns:

| Table          | Specific columns                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `cpus`         | `type`, `socket`, `cores`, `threads`, `clock_rate`, `turbo_frequency`, `tdp`, `integrated_graphics`, `cooler_included`, `passmark` |
| `motherboards` | `socket`, `chipset`, `form_factor`, `memory_type`, `memory_slots`, `memory_max_speed`, `m2_slots`, `sata_ports`, `wifi`            |
| `gpus`         | `type`, `gpu_model`, `vram`, `tdp`, `cuda`, `bus`, `vram_freq`, `min_psu`, `pcie_version`, `length_mm`, `power_connectors`         |
| `ssds`         | `capacity`, `type`, `form_factor`, `interface`, `read_speed`, `write_speed`                                                        |
| `hdds`         | `capacity`, `interface`                                                                                                            |
| `cases`        | `form_factor`, `max_gpu_length`, `max_cpu_cooler_height`, `bays_25`, `bays_35`, `psu_wattage`                                      |
| `fans`         | `size_mm`, `connector`, `rpm_max`, `units_in_package`                                                                              |
| `psus`         | `wattage`, `efficiency_rating`, `psu_type`, `modular`, `fan_size_mm`, `pcie_connectors`, `eps_connectors`, `sata_connectors`       |
| `coolers`      | `compatibility`, `tdp_support`, `height_mm`, `fan_size_mm`                                                                         |
| `rams`         | `memory_type`, `capacity`, `frequency`, `cl_latency`, `modules_count`                                                              |

Scrape history is stored separately:

| Table             | Purpose                                |
| ----------------- | -------------------------------------- |
| `scrape_sessions` | One row per admin-recorded scrape run. |
| `scrape_results`  | Category totals for a scrape session.  |

## 12. Indexing Strategy

The migration indexes fields used for compatibility checks, filtering, sorting, and generation.

Examples:

- `socket`, `memory_type`, `form_factor`, `compatibility`
- `price`, `tdp`, `wattage`, `passmark`, `vram`, `capacity`, `length_mm`, `height_mm`
- `stock_status`, `integrated_graphics`, `cooler_included`, `wifi`, `modular`
- compound indexes such as `socket + price`, `socket + memory_type + price`, `vram + price`, `capacity + interface`

Some display fields are also indexed in the current migration, such as component `name`.

## 13. Error Handling And Logs

Defaults in `config.py`:

```python
PAGE_DELAY = 0.2
MAX_ERRORS_PER_CATEGORY = 10
```

Per category:

1. The scraper wipes the target table.
2. It collects all listing URLs.
3. It scrapes each product detail page.
4. It skips failed products until the category error limit is reached.

Duplicate `dateks_id` errors are handled specially:

- If MySQL error `1062` occurs, the scraper prints `[DUP] <url>` and continues.
- This can happen when the same product appears in more than one source URL for a category.

Other product errors:

- Increment the category error counter.
- Print `[SKIP N/max] <url>`.
- Print the exception message.
- Continue until the category reaches `max_errors`.

At the end of each category, the scraper prints a summary:

```text
[GPU] Done: 120 inserted, 2 skipped
[META] inserted_gpu=120 skipped_gpu=2
```

Important `[META]` lines:

| Meta line                                 | Meaning                                         |
| ----------------------------------------- | ----------------------------------------------- |
| `[META] start_time=...`                   | Scrape run start timestamp.                     |
| `[META] categories=cpu,gpu`               | Selected categories.                            |
| `[META] total_cpu=...`                    | Count of listing products found for a category. |
| `[META] inserted_cpu=... skipped_cpu=...` | Category result.                                |
| `[META] done=true`                        | Scrape process finished.                        |
| `[META] finished_at=...`                  | Scrape finish timestamp.                        |

The Laravel admin UI can parse these lines and store scrape history through the admin API.

## 14. Current Compatibility Usage In Laravel

Scraped columns feed these compatibility checks.

| Check               | Data used                                          | Current behavior                                        |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| CPU vs motherboard  | `cpus.socket`, `motherboards.socket`               | Must match.                                             |
| CPU vs cooler       | `cpus.socket`, `coolers.compatibility`             | Cooler compatibility may contain CPU socket.            |
| CPU TDP vs cooler   | `cpus.tdp`, `coolers.tdp_support`                  | Cooler support must be at least CPU TDP.                |
| CPU/RAM family hint | `cpus.socket`, `rams.memory_type`                  | DDR4/DDR5 memory type narrows compatible sockets.       |
| Motherboard vs RAM  | `motherboards.memory_type`, `rams.memory_type`     | Must match.                                             |
| Motherboard vs case | `motherboards.form_factor`, `cases.form_factor`    | Uses `CompatibilityHelper` known form-factor map.       |
| GPU vs case         | `gpus.length_mm`, `cases.max_gpu_length`           | GPU length must fit.                                    |
| GPU vs PSU          | `gpus.min_psu`, `psus.wattage`                     | PSU wattage must meet GPU minimum.                      |
| CPU/GPU TDP vs PSU  | `cpus.tdp`, `gpus.tdp`, `psus.wattage`             | Required wattage is `(cpu_tdp + gpu_tdp) * 1.3`.        |
| Case included PSU   | `cases.psu_wattage`                                | If sufficient, separate PSU suggestions can be skipped. |
| Cooler vs case      | `coolers.height_mm`, `cases.max_cpu_cooler_height` | Cooler height must fit.                                 |

Some columns are imported for future or UI filtering but are not fully enforced by compatibility logic yet:

- `motherboards.memory_max_speed`
- `motherboards.memory_slots`
- `motherboards.m2_slots`
- `motherboards.sata_ports`
- `cases.bays_25`
- `cases.bays_35`
- `psus.pcie_connectors`
- `psus.eps_connectors`
- `psus.sata_connectors`
- `ssds.interface`
- `ssds.form_factor`
- `hdds.interface`
- fan compatibility fields

## 15. Adding Or Updating A Parser

To add a new component category:

1. Add a table or columns in Laravel migrations.
2. Add a model if the app needs to read the table through Eloquent.
3. Add a parser file in `scraper/parsers/`.
4. Make the parser return a dict whose keys exactly match table columns.
5. Add the category entry to `scraper/config.py`.
6. Add the component type to `CompatibilityService::VALID_TYPES` if it will be exposed through the app/API.
7. Add compatibility and filtering rules in Laravel if needed.
8. Test the scraper with a single category before running `all`.

When updating an existing parser:

- Keep `dateks_id` unique and stable.
- Keep parser output aligned with the migration column names.
- Prefer `#params` fields over less structured page areas.
- Use parser-specific normalization when exact string matching is required.

## 16. Known Caveats

- Scraping a category deletes that component table before importing fresh rows.
- If the scrape aborts partway through a category, that table can be partially populated.
- `extract_specs` overwrites duplicate keys except where a parser handles duplicates manually.
- Some imported columns are not currently enforced by compatibility logic.
- The Flask service streams plain text output; long full-category runs can take many minutes.
