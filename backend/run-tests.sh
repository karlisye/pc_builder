#!/usr/bin/env sh
# Run Pest tests inside the backend Docker container.
# Usage: ./run-tests.sh [pest options]
#   ./run-tests.sh
#   ./run-tests.sh --filter=CompatibilityFiltersTest
#   ./run-tests.sh tests/Feature/ValidateBuildTest.php

set -e

CONTAINER="pc_builder-backend-1"

# Install dev dependencies if pest binary is missing
docker exec "$CONTAINER" sh -c '
  if [ ! -f /var/www/vendor/bin/pest ]; then
    composer install --working-dir=/var/www
  fi
  # Ensure a blank .env exists so phpdotenv does not emit a warning
  touch /var/www/.env
'

docker exec -w /var/www "$CONTAINER" ./vendor/bin/pest "$@"
