#!/usr/bin/env bash
# Builds the sanitized component-data fixture used by the CI test stage
# (backend/database/ci/components-dump.sql.gz). Run from the repo root while
# the dev docker compose stack is up. Re-run whenever the local component data
# changes enough that CI should follow.
#
# Sanitization (real scraped values never reach the repo):
#   - listings.price  -> perturbed +/-15% (fully random prices would break the
#     budget-tier Pest tests, so the distribution must stay realistic)
#   - listings.url    -> random https://example.test/l/<hash>
#   - <component>.image_url -> NULL everywhere
# Only component + listing tables are dumped — never users/builds/sessions.

set -euo pipefail

MYSQL_CONTAINER="${MYSQL_CONTAINER:-pc_builder-mysql-1}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-password}"
SOURCE_DB="${SOURCE_DB:-pc_builder}"
SCRATCH_DB="ci_dump_scratch"
OUT="backend/database/ci/components-dump.sql.gz"

TABLES="cpus motherboards rams gpus ssds hdds cases coolers psus fans listings"
COMPONENT_TABLES="cpus motherboards rams gpus ssds hdds cases coolers psus fans"

mysql_exec() {
  docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$@"
}

echo "==> Creating scratch database"
mysql_exec -e "DROP DATABASE IF EXISTS $SCRATCH_DB; CREATE DATABASE $SCRATCH_DB;"

echo "==> Copying schema + data for: $TABLES"
docker exec "$MYSQL_CONTAINER" sh -c \
  "mysqldump -u$DB_USER -p$DB_PASS $SOURCE_DB $TABLES" | mysql_exec "$SCRATCH_DB"

echo "==> Sanitizing"
mysql_exec "$SCRATCH_DB" -e "
  UPDATE listings
    SET price = ROUND(price * (0.85 + RAND() * 0.30), 2)
    WHERE price IS NOT NULL;
  UPDATE listings
    SET url = CONCAT('https://example.test/l/', MD5(RAND()));
"
for t in $COMPONENT_TABLES; do
  mysql_exec "$SCRATCH_DB" -e "UPDATE $t SET image_url = NULL;"
done

echo "==> Dumping sanitized data (data only — CI gets schema from artisan migrate)"
mkdir -p "$(dirname "$OUT")"
docker exec "$MYSQL_CONTAINER" sh -c \
  "mysqldump -u$DB_USER -p$DB_PASS --no-create-info --skip-triggers $SCRATCH_DB $TABLES" \
  | gzip -9 > "$OUT"

echo "==> Dropping scratch database"
mysql_exec -e "DROP DATABASE $SCRATCH_DB;"

echo "==> Done: $OUT ($(du -h "$OUT" | cut -f1))"
