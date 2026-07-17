# DEPLOYMENT.md

## TaskHub — Docker Deployment Documentation

This document describes how to build, run, stop, and rebuild the containerized TaskHub application (Next.js frontend, NestJS backend, MongoDB database) using Docker and Docker Compose.

---

## 1. Project Structure

```
taskhub-hub/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   └── ...
├── docker-compose.yaml
└── .env
```

---

## 2. Prerequisites

- Docker Engine and Docker Compose installed
- Git (to clone the repository)
- A `.env` file at the project root, and one inside each of `backend/` and `frontend/` (see section 6)

---

## 3. How to Build the Images

To build both the frontend and backend images via Docker Compose:

```bash
docker compose build
```
To build the all images
```bash
docker compose up
```

To build an individual service:

```bash
docker compose build backend
docker compose build frontend
```

To build and tag an image manually for Docker Hub (used prior to publishing):

```bash
docker build -t temigodson/taskhub-hub-backend:latest ./backend
docker build -t temigodson/taskhub-hub-frontend:latest ./frontend
```

---

## 4. How to Start the Application

From the project root (where `docker-compose.yaml` lives):

```bash
docker compose up
```

To run in detached mode (background):

```bash
docker compose up -d
```

Once started:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)
- **MongoDB:** exposed on `localhost:27017` (internally reachable by the backend as `mongodb://mongodb:27017`)

---

## 5. How to Stop the Application

To stop running containers without removing them:

```bash
docker compose stop
```

To stop and remove containers, networks, but keep volumes (MongoDB data persists):

```bash
docker compose down
```

To stop and remove containers **and** volumes (this will delete all MongoDB data):

```bash
docker compose down -v
```

---

## 6. How to Rebuild the Containers

If application code or a Dockerfile changes, rebuild before starting again:

```bash
docker compose up --build
```

To force a clean rebuild with no cached layers:

```bash
docker compose build --no-cache
docker compose up
```

To rebuild a single service:

```bash
docker compose up --build backend
```

---

## 7. Environment Variables

Environment variables are split across three `.env` files rather than hardcoded in any Dockerfile or `docker-compose.yaml`.

### Root `.env`
Used by Docker Compose to configure MongoDB and cross-service values (ports, API URL).


### `backend/.env`
Backend-specific configuration (not related to Mongo connection, which is injected by Compose).

### `frontend/.env`

> **Note:** No secrets are hardcoded in any Dockerfile. All sensitive values (Mongo credentials, JWT secret) are supplied via `.env` files, which are excluded from version control via `.gitignore` and from the Docker build context via `.dockerignore`.

---

## 8. Docker Hub Image Links

| Service  | Docker Hub Repository                                                                 |
|----------|-----------------------------------------------------------------------------------------|
| Backend  | [temigodson/taskhub-hub-backend](https://hub.docker.com/repository/docker/temigodson/taskhub-hub-backend)   |
| Frontend | [temigodson/taskhub-hub-frontend](https://hub.docker.com/repository/docker/temigodson/taskhub-hub-frontend) |

To pull the published images directly:

```bash
docker pull temigodson/taskhub-hub-backend:latest
docker pull temigodson/taskhub-hub-frontend:latest
```

---

## 9. Assumptions Made During Deployment

- **MongoDB was kept as a containerized service** using the official `mongo:7-jammy` image, pulled rather than built, per the assignment's requirement not to replace or restructure the database layer.
- **Backend port assumed to be `3001`** and **frontend port assumed to be `3000`** (Next.js default), based on standard NestJS/Next.js conventions, since no custom port configuration was specified in the original application code.
- **MongoDB authentication** uses root credentials (`MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD`) with `authSource=admin` in the connection string, matching the default behavior of the official Mongo image when root env vars are set.
- **Both application images run as a non-root user** (`appuser`) inside the container, per the assignment's security requirements — this required explicit `--chown` flags on `COPY` instructions from the build stage to ensure the non-root user has read/execute access to application files.
- **No `.env` files are committed to the repository.** They are excluded via `.gitignore`; only `.env.example`-style documentation (this file) shows the expected variable names.
- **Persistent storage** for MongoDB is handled via a named Docker volume (`mongo-data`), so data survives `docker compose down` (but not `docker compose down -v`).

---

## 10. Verifying the Deployment

After running `docker compose up`, confirm all three services report as healthy/running:

```bash
docker compose ps
```

Check logs for a specific service if something fails to start:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```