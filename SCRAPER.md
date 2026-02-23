# Dateks PC Parts Scraper

A Python web scraper that collects PC component listings from [dateks.lv](https://www.dateks.lv) and stores structured product data into a MySQL database.

## Overview

The scraper iterates through all major PC component categories on dateks.lv, extracts product specs from listing and detail pages, and persists the data into a relational MySQL database. Database tables are managed by Laravel migrations; this script only reads and writes data.

## Scraped Categories

| Category     | Subcategories |
| ------------ | ------------- |
| Processors   | Intel, AMD    |
| Motherboards | Intel, AMD    |
| RAM          | All           |
| GPUs         | All           |
| SSDs         | All           |
| HDDs         | 3.5", 2.5"    |
| Cases        | All           |
| Fans         | All           |
| PSUs         | All           |
| Coolers      | All           |

## Configuration

Copy the `.env.example` file in the dateks_scraper directory with your database credentials:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=pc_builder
```

Before running the scraper, ensure Laravel migrations have been executed to create the required tables:

```bash
php artisan migrate
```

Required tables: `processors`, `motherboards`, `rams`, `gpus`, `ssds`, `hdds_35`, `hdds_25`, `cases`, `fans`, `psus`, `coolers`

## Usage

```bash
python main.py
```

On each run, the scraper will:

1. Connect to the MySQL database and verify all required tables exist
2. Truncate all existing product data
3. Iterate through every category and paginated listing page
4. Parse and save each product to the database
5. Print progress logs per product and category totals

## How It Works

1. **`BaseScraper`** fetches each paginated listing page (`/pg/2`, `/pg/3`, ...) and stops when a redirect is detected (indicating the page doesn't exist).
2. For each product `div.prod`, it extracts the name, price, availability, URL, and inline spec table.
3. The appropriate **Parser** (e.g. `GpuParser`, `SsdParser`) maps the raw Latvian language spec keys to normalized fields.
4. **`ProcessorParser`** additionally calls `DetailScraper` to fetch the product's individual page for extended specs (GPU included, etc.).
5. Parsed data is saved to MySQL via the dedicated `save_*` functions in `database.py`.

## Data Fields by Component

| Component   | Key Fields                                                               |
| ----------- | ------------------------------------------------------------------------ |
| Processor   | socket, cores, frequency, cache, TDP, lithography, cooler included, iGPU |
| Motherboard | socket, chipset, form factor, memory type, memory slots, WiFi            |
| GPU         | GPU model, clock speed, VRAM, memory type, power connector, cooling      |
| SSD         | capacity, type, read/write speed, form factor, interface                 |
| HDD         | capacity, interface, RPM, cache                                          |
| RAM         | capacity, frequency, memory type, CAS latency, kit type                  |
| PSU         | wattage, 80 PLUS cert, fan size, modular cables, CPU/PCIe connectors     |
| Case        | form factor, case type, color, PSU included                              |
| Fan         | RPM (min/max), size, LED color, connector, quantity, noise level         |
| Cooler      | height, TDP, class, LED color, fan count                                 |

## Notes

- A 1-second delay (`time.sleep(1)`) is applied between paginated requests to avoid overloading the server.
- All existing records are truncated at the start of each run to ensure fresh data.
- Spec keys are in Latvian as they appear directly in the dateks.lv HTML (Dateks.lv has an english translated website, but the data there is not consistant).
- The full website scrape taskes about 5 minutes.
