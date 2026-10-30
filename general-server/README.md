# Deployment-Ready App

A lightweight Node.js + Express application built as a reusable template for deployment on Render, Vercel, and Google Cloud Run.

## Features

- Simple root response for app health
- `/health` readiness endpoint
- `/api/status` status endpoint
- Docker image support for Cloud Run
- Render configuration via `render.yaml`
- Vercel rewrite setup via `vercel.json`
- Environment variable support via `.env.example`

## Local development

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/api/status

## Environment

```env
PORT=3000
NODE_ENV=development
```

## Deploy to Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/deployment-ready-app
gcloud run deploy deployment-ready-app --image gcr.io/PROJECT_ID/deployment-ready-app --platform managed --region us-central1 --allow-unauthenticated
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
├── package.json
├── render.yaml
├── server.js
├── vercel.json
└── package-lock.json
```
