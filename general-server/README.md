# Deployment-Ready App

A lightweight Node.js + Express application built as a reusable template for deployment on Render, Vercel, and Google Cloud Run.

## Features

- Real frontend dashboard with live status cards, polling refresh, and message composer
- SQLite-backed data layer using `better-sqlite3`
- `/health` readiness endpoint
- `/api/status` and `/api/metrics` reporting endpoints
- `/api/messages` CRUD-style JSON API for persisted message storage
- Client-side rendering that avoids unsafe HTML injection and keeps the dashboard resilient
- Docker image support for Cloud Run
- Render configuration via `render.yaml`
- Vercel rewrite setup via `vercel.json`
- Environment variables via `.env.example`

## Local development

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/api/status
- http://localhost:3000/api/messages

If PowerShell blocks `npm` on Windows, run the CLI directly:

```powershell
& "C:\Users\fligh\OneDrive\networkbuster-cloud\OneDrive\Attachments\node.exe" "C:\Users\fligh\OneDrive\networkbuster-cloud\OneDrive\Attachments\node_modules\npm\bin\npm-cli.js" install
```

## Environment

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/app.db
```

## Deploy to Cloud Run

Use the included deployment script:

```bash
chmod +x deploy-cloud-run.sh
export PROJECT_ID=my-project-id
./deploy-cloud-run.sh
```

Or run the equivalent gcloud commands manually:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/platform-dashboard
gcloud run deploy platform-dashboard --image gcr.io/PROJECT_ID/platform-dashboard --platform managed --region us-central1 --allow-unauthenticated --port 3000
```

## Deploy to Render

Push this repository to GitHub and add it as a web service in Render. The included `render.yaml` config sets up the service automatically.

## Deploy to Vercel

Use the included `vercel.json` and deploy the project as a Node serverless app.

## Project structure

```text
.
├── Dockerfile
├── README.md
├── .env.example
├── .gitignore
├── .dockerignore
├── api/
│   └── index.js
├── data/
├── deploy-cloud-run.sh
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── database.js
├── package.json
├── render.yaml
├── server.js
├── server.test.js
├── vercel.json
└── package-lock.json
```
