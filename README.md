# AI News Portal

A full-stack multilingual news platform that fetches live headlines, rewrites and summarizes them with AI, and lets admins publish curated stories for readers.

## What This Project Does

This project automates the news publishing pipeline:

1. Pulls fresh news from GNews by category (India, world, technology, business, sports, and more).
2. Uses Gemini to rewrite raw article text into cleaner editorial content.
3. Generates AI summaries for quick reading.
4. Stores all fetched stories as drafts.
5. Lets an admin review, publish, unpublish, or delete articles.
6. Shows published stories on a public React website.
7. Translates article title, content, and summary on demand into multiple languages.
8. Caches translations so repeated requests are fast and cost-efficient.

In short, it is a lightweight digital newsroom with AI-assisted writing and multilingual delivery.

## Core Features

- Public news feed with category filtering and pagination
- Article details page
- Admin login with JWT authentication
- Protected admin actions for fetching and managing articles
- Draft to publish workflow
- AI rewrite and summary generation
- On-demand translation with cached results
- Health endpoint for uptime checks
- Rate limiting and security middleware
- Dockerized backend and frontend services
- Jenkins pipeline for install, test, lint, build, deploy, and health verification

## User Experience

- Readers can browse published articles by category.
- Readers can switch language to view translated article content.
- Editors can log in, fetch fresh stories, inspect drafts, and publish selected content.
- Admin dashboard provides article stats such as total, drafts, published, and AI-rewritten count.

## Tech Stack

Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Axios
- Helmet, CORS, and rate limiting

Frontend:
- React
- Vite
- React Router
- Axios

External APIs:
- GNews API for source news
- Google Gemini API for rewrite, summary, and translation

DevOps:
- Docker and Docker Compose
- Jenkins CI/CD pipeline

## High-Level Flow

1. Admin triggers fetch for a category.
2. System pulls headlines from GNews.
3. For each new story, AI rewrite and summary are generated.
4. Story is stored as draft.
5. Admin publishes selected drafts.
6. Public site lists published stories.
7. Reader opens an article and can request translation.
8. Translation is generated once and stored for reuse.

## Environment Variables

Set these values for backend runtime:

- MONGODB_URI
- GNEWS_API_KEY
- GEMINI_API_KEY
- GEMINI_MODEL (optional, fallback models are used automatically)
- JWT_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- PORT

## API Overview

Public:
- GET /api/news
- GET /api/news/:id
- POST /api/translate

Auth:
- POST /api/auth/login

Admin (JWT required):
- POST /api/admin/fetch
- GET /api/admin/drafts
- GET /api/admin/articles
- GET /api/admin/stats
- PUT /api/admin/publish/:id
- PUT /api/admin/unpublish/:id
- DELETE /api/admin/articles/:id

Ops:
- GET /health

## Running the Project

Local development:
1. Install backend dependencies.
2. Install frontend dependencies.
3. Configure environment variables.
4. Start backend service.
5. Start frontend service.

Containerized run:
1. Build containers.
2. Start services with Docker Compose.
3. Open frontend in browser.
4. Check backend health endpoint.

## Testing and Quality

- Backend includes smoke tests that validate critical module loading and auth middleware behavior.
- Frontend linting is included in CI.
- CI pipeline performs dependency install, tests, lint, frontend build, container build, deployment, and health check.

## Why This Project Is Useful

This project is ideal for teams that want:
- Faster editorial throughput
- AI-assisted content refinement
- Multilingual reader reach
- A clear admin moderation layer before publishing
- A deployable, production-oriented full-stack baseline

## Future Enhancements

- Role-based permissions beyond single admin
- Scheduled auto-fetch jobs
- Rich text editor for manual edits before publish
- Search and tagging
- Analytics dashboard for reader behavior
- Image optimization and CDN integration
