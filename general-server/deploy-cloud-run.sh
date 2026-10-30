#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-platform-dashboard}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "PROJECT_ID is required. Example: export PROJECT_ID=my-project" >&2
  exit 1
fi

echo "Building container for ${IMAGE_NAME}..."
gcloud builds submit --tag "${IMAGE_NAME}"

echo "Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 3000

printf "\nDeployment complete. Visit the Cloud Run URL shown above.\n"
