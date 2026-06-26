# PC Builder

PC Builder is a full-stack web app for creating, saving, sharing, and reviewing compatible custom PC builds. It combines a Laravel JSON API backend, a standalone React frontend, and a Python scraper that imports live component data from Dateks into MySQL.

## Features

- Guided PC build generator based on budget, build type, and CPU/GPU preferences.
- Manual component selection with compatibility-aware filtering.
- Compatibility validation for CPU sockets, motherboard RAM type, GPU/case clearance, cooler/case clearance, cooler sockets, cooler TDP, motherboard/case form factor, and PSU wattage.
- Saved builds with notes, names, total price, visibility controls, and component relationships.
- Shared public builds with search, sorting, filtering, likes, bookmarks, and star reviews.
- User registration, login, profile pages, public profiles, and account management.
- Admin dashboard for running scraper jobs and viewing scrape history.
- Python scraper for CPUs, motherboards, RAM, GPUs, SSDs, HDDs, cases, fans, PSUs, and coolers.

## Screenshots

![Home](screenshots/home.png)
_Home Screen_

![Builder](screenshots/builder_page.png)
_Builder Page_

![Builder](screenshots/component_select.png)
_Component Selection_

![Builder](screenshots/incompatible.png)
_Incompatible Component Selection_

![Builder](screenshots/auto_builder_section.png)
_Automatic Builder Section_

![Saved](screenshots/saved_page.png)
_Saved Page_

![Shared](screenshots/shared_page.png)
_Shared Build Page_

![Profile](screenshots/profile_page.png)
_Profile Page_

![Admin](screenshots/scraper_page.png)
_Scraper Page_

![Admin](screenshots/history_page.png)
_Scrape History Page_

## Tech Stack

### Backend

- PHP 8.4
- Laravel 12
- Laravel Sanctum (session-based cookie auth)
- MySQL 8.4
- Pest / PHPUnit

### Frontend

- React 19
- React Router v7
- Vite 7
- Tailwind CSS 4
- Axios

### Scraper

- Python 3
- Flask
- Requests
- BeautifulSoup
- mysql-connector-python
- python-dotenv

## Repository Structure

```text
.
├── README.md
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   ├── Dockerfile
│   └── composer.json
├── frontend/
│   ├── src/
│   │   ├── app.jsx
│   │   ├── Contexts/
│   │   ├── Layouts/
│   │   └── Pages/
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
└── scraper/
    ├── main.py
    ├── server.py
    ├── config.py
    ├── database.py
    ├── parsers/
    └── scrapers/
```

## Running With Docker

The easiest way to run the full stack is with Docker Compose.

Copy the backend environment file and fil in your values:

```bash
cp backend/.env.example backend/.env
```

The key values for Docker are already set correctly by default:

```env
DB_HOST=mysql
DB_DATABASE=pc_builder
DB_USERNAME=sail
DB_PASSWORD=password
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:80
CACHE_STORE=file
```

Generate an app key if `.env` doesn't already have one:

```bash
docker compose run --rm backend php artisan key:generate
```

Start all services:

```bash
docker compose up -d
```

Run migrations:

```bash
docker compose exec backend php artisan migrate
```

| Service    | URL                   |
| ---------- | --------------------- |
| App        | http://localhost      |
| phpMyAdmin | http://localhost:8080 |

To create an admin account, register normally then update your user's role to `admin` via phpMyAdmin or the MySQL CLI.

## Running Without Docker

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` and `/sanctum` to `http://localhost:8000`, so the backend and frontend work together without any extra config.

The app is available at `http://localhost:5173`.

## Scraper Usage

The scraper can be run from the Admin Dashboard in the app (when Docker is running), or directly from the command line.

### Through the Admin Dashboard

Once you have an account with role `admin`, head to the Scraper page and select which categories to scrape.

### From the Command Line

MySQL must be reachable on `127.0.0.1:3306`. If using Docker Compose, the port is exposed by default.

```bash
cd scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run all categories:

```bash
DB_HOST=127.0.0.1 python3 main.py all
```

Run specific categories:

```bash
DB_HOST=127.0.0.1 python3 main.py cpu,gpu,ram
```

Supported categories:

```text
cpu, motherboard, ram, gpu, ssd, hdd, case, fan, psu, cooler
```

Each category maps to one or more Dateks listing URLs, a parser module, and a database table in `scraper/config.py`.

## Main Application Areas

### Builder

The builder lets users generate a complete build or fill individual component slots. The main services are:

- `BuilderService` - coordinates build generation, budget tiers, component allocations, warnings, and notes.
- `BuilderSlotPicker` - chooses compatible components for each slot.
- `CompatibilityService` - resolves selected component IDs, fetches compatible components, and validates full builds.
- `ComponentFilters` and `ComponentQueryFilter` - apply compatibility and UI filters to component queries.
- `ComponentScorer` - ranks component options during generation.

### Saved Builds

Users can save generated or manually assembled builds. A build can store a name, notes, type, total price, public/private status, and references to selected component records.

### Shared Builds

Public builds can be browsed on the shared page. Users can filter by price, type, CPU/GPU preference, rating, liked builds, bookmarked builds, and personal builds. Shared builds support likes, bookmarks, and one rating per user.

### Admin Scraper

Admin users can start scraper runs from the app. The Laravel backend streams logs from the Python scraper service, then stores scrape session metadata and category-level results.

## API Routes

### Auth

- `GET /sanctum/csrf-cookie` - fetch CSRF cookie
- `POST /api/register` - register
- `POST /api/login` - login
- `POST /api/logout` - logout
- `GET /api/user` - current authenticated user

### Components

- `GET /api/components/{type}` - list compatible components
- `GET /api/components/{type}/filters` - get filter options
- `GET /api/components/{type}/{id}` - get a single component

### Builder

- `GET /api/builder` - load an existing build into the builder
- `POST /api/builder` - generate a build
- `POST /api/builder/validate` - validate selected components
- `POST /api/builder/{type}` - generate one component slot

### Builds

- `GET /api/builds` - list saved builds
- `POST /api/builds` - save a build
- `GET /api/builds/{build}` - fetch a build
- `PATCH /api/builds/{build}` - update a build
- `DELETE /api/builds/{build}` - delete a build
- `PATCH /api/builds/{build}/publish` - toggle public visibility

### Shared

- `GET /api/shared` - fetch public builds
- `POST /api/shared/{build}/like` - toggle like
- `POST /api/shared/{build}/bookmark` - toggle bookmark
- `POST /api/shared/{build}/review` - create or update rating

### Profile

- `GET /api/profile` - current user's profile builds
- `GET /api/profile/bookmarked` - bookmarked builds
- `GET /api/profile/{user}` - public profile of a user
- `PATCH /api/users/{user}` - update user
- `DELETE /api/users/{user}` - delete user

### Admin

- `GET /api/admin` - dashboard stats
- `POST /api/admin/scrape` - run scraper and stream logs
- `POST /api/admin/populate` - generate sample builds

## Compatibility Rules

Compatibility checks are handled in Laravel. Current checks include:

- CPU socket must match motherboard socket.
- Motherboard memory type must match RAM memory type.
- GPU length must fit inside the selected case.
- CPU cooler height must fit inside the selected case.
- CPU cooler socket support must include the selected CPU socket.
- CPU cooler TDP support must be sufficient for the CPU.
- Motherboard form factor must fit the selected case.
- PSU wattage must satisfy CPU/GPU demand and GPU minimum PSU recommendations.

## Testing

Tests live in `backend/tests/Feature/BuilderApiTest.php` and cover build generation response structure, budget tiers, build-type rules, CPU/GPU preferences, compatibility expectations, and warnings.

Tests require a database with scraped component data. Run with:

```bash
cd backend
./vendor/bin/pest
```

Alternatively, use the Populate feature in the Admin Dashboard to generate 17 sample builds across different budgets and preferences. Generated builds are automatically published and accessible on the shared builds page.

## Development Notes

- The scraper extracts only fields needed for display or compatibility matching.
- Component prices, stock status, and stock quantity come from Dateks listing pages.
- Detailed specs come from Dateks product pages.
- Admin scraper logs are streamed from the Python Flask service through Laravel to the browser.
- The project uses admin role middleware for scraper and dashboard pages.
