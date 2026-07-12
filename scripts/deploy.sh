#!/bin/sh
# Runs ON THE SERVER, piped over SSH by the deploy job:
#   ssh ... "IMAGE_TAG=<sha> sh -s" < scripts/deploy.sh
# Deploys the exact image tag built by this pipeline — never a moving `latest`,
# so overlapping pipelines can't swap images underneath a deploy.
set -e

: "${IMAGE_TAG:?IMAGE_TAG must be set to the commit SHA image tag}"
export IMAGE_TAG

cd /opt/datorbuve

compose() {
  docker compose --env-file .env.production -f docker-compose.prod.yml "$@"
}

echo "==> Deploying image tag: $IMAGE_TAG"
compose pull
compose up -d

echo "==> Migrations + optimizations"
compose exec -T backend php artisan migrate --force
compose exec -T backend php artisan config:cache
compose exec -T backend php artisan route:cache
compose exec -T backend php artisan view:cache

# graceful worker restart — no-op right after a container recreate, but covers
# redeploys where the queue-worker container wasn't replaced
compose exec -T backend php artisan queue:restart

echo "==> Health check"
compose exec -T backend curl -fsS http://localhost:8000/up > /dev/null
echo "==> Deploy OK ($IMAGE_TAG)"
