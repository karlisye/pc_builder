# DatorBuve

DatorBuve is a bilingual PC-building tool for the Latvian market. It lets people browse components with current Latvian store pricing, assemble and validate a build manually, generate compatible builds within a budget, save their work, and share builds by link.

The application is available in Latvian and English. Latvian is the default locale and English routes use the `/en/` prefix.

## Features

- Manual PC builder with ten component slots: CPU, motherboard, RAM, GPU, PSU, SSD, HDD, case, CPU cooler, and case fan.
- Compatibility-aware component browsing, filtering, sorting, pagination, and product detail pages.
- Full-build and single-component generation based on budget, build type, and CPU/GPU preferences.
- Loose compatibility checks for manual browsing and strict checks for automatic generation when specification data is missing.
- Hard compatibility issues, soft warnings, and manual-check indicators shown separately.
- Local draft recovery for unfinished builds.
- Saved builds with names, notes, build types, pagination, editing, deletion, and shareable links.
- Multiple store listings per component with price, stock status, and last-checked information.
- Registration, session-based login, password reset, email verification, profile editing, and self-service account deletion.
- Cloudflare Turnstile protection for login and registration.
- Consent-gated Google Analytics support.
- Server-rendered pages, localized SEO metadata, product structured data, `robots.txt`, and a dynamic bilingual sitemap.
- Responsive English and Latvian interfaces.

Automatic generation and saving require a signed-in, verified account. Manual building and component browsing are available to guests.

## Screenshots

![Builder page](screenshots/build.png)
_Builder_

![Component selection](screenshots/add_comp.png)
_Component browser_

![Incompatible component selection](screenshots/incompatible.png)
_Compatibility feedback_

![Automatic builder](screenshots/auto_build.png)
_Automatic builder_

![Saved builds](screenshots/saved.png)
_Saved builds_

![Store availability](screenshots/avail.png)
_Store listings_

## Technology

### Backend

- PHP 8.4 in the project containers; Composer allows PHP 8.2 or newer
- Laravel 12
- Laravel Sanctum cookie-based authentication
- MySQL 8.4
- Redis 7 for caching, rate limiting, and production queues
- Resend for production email and Mailpit for local email testing
- Pest 4 / PHPUnit
- Laravel Telescope in local development only

### Frontend

- React 19
- React Router 8 in framework mode with server-side rendering
- Vite 7
- Tailwind CSS 4
- TanStack Query
- Axios
- i18next

### Infrastructure

- Docker Compose for local development
- Separate frontend nginx, React SSR, Laravel, queue worker, MySQL, Redis, Mailpit, and phpMyAdmin services
- GitLab CI for backend tests, frontend builds, container images, and production deployment
- Cloudflare-proxied production traffic with TLS terminating at nginx

## Repository Layout

```text
.
├── backend/
│   ├── app/
│   │   ├── Console/Commands/
│   │   ├── Helpers/
│   │   ├── Http/Controllers/
│   │   ├── Http/Middleware/
│   │   ├── Mail/
│   │   ├── Models/
│   │   ├── Notifications/
│   │   ├── Services/
│   │   └── Support/
│   ├── database/
│   │   ├── ci/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── lang/{en,lv}/
│   ├── resources/views/emails/
│   ├── routes/
│   └── tests/Feature/
├── frontend/
│   ├── docker/
│   └── src/
│       ├── Contexts/
│       ├── Layouts/
│       ├── Pages/
│       ├── lib/
│       ├── locales/{en,lv}/
│       ├── routes/
│       └── routes.js
├── scripts/
├── docker-compose.yml
└── docker-compose.prod.yml
```


## Run With Docker

Docker Compose is the recommended way to run the complete stack.

### 1. Create the backend environment file

```bash
cp backend/.env.example backend/.env
```

For Docker, set the service hostnames in `backend/.env`:

```env
DB_HOST=mysql
REDIS_HOST=redis
MAIL_HOST=mailpit
```

The example credentials match the defaults in `docker-compose.yml`. Add Cloudflare Turnstile keys only if you want to exercise Turnstile locally; the integration stays disabled when its keys are empty.

### 2. Build the containers and generate an application key

```bash
docker compose build
docker compose run --rm backend php artisan key:generate
```

### 3. Start the services and migrate the database

```bash
docker compose up -d
docker compose exec backend php artisan migrate
```

### Local services

| Service | URL |
|---|---|
| DatorBuve | http://localhost |
| Laravel API | http://localhost:8000 |
| Mailpit | http://localhost:8025 |
| phpMyAdmin | http://localhost:8080 |

The database migrations create the schema but do not provide a full component catalog. Browsing and generation require imported component and listing data.

Backend application, language, configuration, route, and test directories are bind-mounted for live local changes. Rebuild containers when changing dependencies, migrations, Blade templates, bootstrap files, or other files that are copied into the image rather than mounted.

## Run Without Docker

You need PHP, Composer, Node.js, and MySQL available locally. Redis is only required when you configure the application to use it for queues or caching.

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

When running services directly on the host, use host addresses such as `DB_HOST=127.0.0.1` and `REDIS_HOST=127.0.0.1` in `backend/.env`.

Run the queue worker in another terminal if you want queued email and notification jobs to be processed:

```bash
cd backend
php artisan queue:work --tries=3
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs at `http://localhost:5173` and proxies `/api` and `/sanctum` requests to Laravel at `http://localhost:8000`.

## How Compatibility Works

Compatibility is enforced in three layers:

1. `ComponentFilters` applies per-component-type rules while browsing or generating.
2. `CompatibilityService` resolves selections, marks browser results, and validates assembled builds.
3. `BuilderSlotPicker` uses strict filtering and `ComponentScorer` to choose the best valid candidate during automatic generation.

Manual browsing uses loose checks: missing specification data does not automatically make a component incompatible, but the UI marks the component for manual verification. Automatic generation uses strict checks and excludes candidates whose fit cannot be verified.

Current rules cover:

- CPU, motherboard, and RAM socket or memory-family compatibility.
- RAM module count, capacity, and frequency against motherboard limits.
- GPU length and CPU cooler height against case clearance.
- CPU cooler socket and thermal support.
- Motherboard and case form factors.
- Case and PSU form factors, including cases with bundled power supplies.
- GPU PCIe power connector requirements.
- Combined CPU/GPU power demand, GPU recommendations, and PSU capacity.
- M.2 and SATA port availability across SSDs, HDDs, and motherboards.
- 3.5-inch HDD bays in cases.

Validation returns hard `issues` separately from advisory `warnings`. Automatic-builder recommendations and notes remain separate from compatibility validation.

## Builder and Data Model

Component product codes are the canonical identifiers used by the builder and API. Prices and availability belong to `Listing` records, allowing a component to have offers from multiple stores. Components expose the best available listing for summary displays while retaining the full listing collection for price comparison.

The builder supports these build types:

- Gaming
- Office
- Rendering
- Streaming

CPU, motherboard, RAM, SSD, and case are always required. GPU, cooler, and PSU become optional when the selected CPU or case already provides the relevant capability. HDDs and case fans are optional.

## Main API Routes

All routes below are prefixed with `/api`, except the Sanctum CSRF endpoint and sitemap.

### Authentication and account

- `GET /sanctum/csrf-cookie` (not prefixed with `/api`)
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /user`
- `POST /forgot-password`
- `POST /reset-password`
- `GET /email/verify/{id}/{hash}`
- `POST /email/verification-notification`
- `PATCH /users/{user}`
- `POST /users/{user}/delete-confirmation`
- `GET /users/delete/{id}/{hash}`

### Components and builder

- `GET /components/{type}`
- `GET /components/{type}/filters`
- `GET /components/{type}/{productCode}`
- `GET /builder`
- `POST /builder`
- `POST /builder/{type}`
- `POST /builder/validate`

### Saved builds

- `GET /builds`
- `POST /builds`
- `GET /builds/{build}`
- `PATCH /builds/{build}`
- `DELETE /builds/{build}`
- `POST /builds/{build}/share`

The public sitemap is served at `GET /sitemap.xml`.

Generation endpoints are limited to 10 requests per minute per user. Component browsing is limited to 60 requests per minute per user or guest IP. Login, registration, and password endpoints are limited to 5 requests per minute per IP. Test environments bypass these limits.

## Frontend Routes and Rendering

React Router owns the full route tree and renders it on the server. Important routes include:

- `/` and `/en/`
- `/builder`
- `/builder/components/{type}`
- `/builder/components/{type}/{productCode}`
- `/builds/{id?}`
- `/guide`, `/guide/auto`, and `/guide/saved`
- `/login`, `/register`, `/forgot-password`, and `/reset-password`
- `/profile`
- `/about`, `/contact`, `/privacy`, and `/terms`

Latvian routes are unprefixed. English versions use `/en/`. Requests under `/lv/` permanently redirect to the unprefixed equivalent.

## Testing

Run the backend feature suite inside the existing Docker development container:

```bash
./backend/run-tests.sh
```

Pass Pest arguments through the wrapper when needed:

```bash
./backend/run-tests.sh --filter=ValidateBuildTest
```

The principal feature suites are:

- `BuilderApiTest.php`
- `CompatibilityFiltersTest.php`
- `ValidateBuildTest.php`
- `PasswordResetTest.php`

The tests rely on component data. CI migrates a clean MySQL database and imports the sanitized fixture at `backend/database/ci/components-dump.sql.gz` before running Pest.

Build the frontend to catch route, SSR, JSX, and locale-file problems:

```bash
cd frontend
npm run build
```

## Production

The `main` branch is the production branch. GitLab CI runs backend tests and the frontend build, creates SHA-tagged backend, frontend nginx, and frontend SSR images, then deploys the exact image versions to the production host. Deployment runs migrations, refreshes Laravel caches, restarts queue workers, and performs internal and external health checks.

Production secrets and the real `.env.production` file are managed outside the repository. Frontend `VITE_*` values are build-time variables and must be supplied when the frontend image is built.

## Localization

Frontend translations live under `frontend/src/locales/{en,lv}/`. Backend messages live under `backend/lang/{en,lv}/`. The frontend derives locale from the URL and sends it to Laravel, where `SetLocaleFromHeader` selects the matching backend language.

Any new user-facing text should be added in both languages. Compatibility placeholders such as `:cpu_socket` and `:gpu_length` must remain consistent between translations.
