# Deployment Guide — TaskHub

This document describes how to build, run, stop, and rebuild the TaskHub application (frontend, backend, and MongoDB database) using Docker Compose, along with links to the published Docker Hub images.



## 1. Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin) installed and running.
- A `.env` file in the project root containing at minimum:
- Docker Hub account (for /pushing new images).

---

## 2. Building the Images

Images are built individually using `docker build`, one for each service.

**Backend:**
```bash
docker build -t taskhub-backend .
```

**Frontend:**
```bash
docker build -t taskhub-frontend .
```

Run both commands. Each picks up the `Dockerfile` inside its respective folder.

---

## 3. Starting the Application

Start all services (db, backend, frontend) in the foreground, with logs streaming to the terminal and docker logs:

```bash
docker compose up
```

Once running, the services are available at:

| Service   | URL / Port                  |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:3001        |
| MongoDB   | localhost:27017               |

The `backend` service waits for the `db` service's healthcheck to pass before starting, so MongoDB should be fully ready before the backend attempts to connect.

---

## 4. Stopping the Application

The application is started via `docker compose up`, but containers are stopped individually using `docker stop`.

First, list running containers to get their names and container:

```bash
docker ps
```

Then stop each one:

```bash
docker stop <Container-Id>

```

---

## 5. Rebuilding the Containers

If you've made code changes and need to rebuild and restart, the images are rebuilt manually and the app is restarted via Compose:

Rebuild the changed image(s):
   ```bash
   docker build -t taskhub-backend .
   docker build -t taskhub-frontend .
   ```

 Start everything again with Compose:
   ```bash
   docker compose up
   ```
---

## 6. Docker Hub Image Links


| Image              | Docker Hub Link                                                        |
|--------------------|-------------------------------------------------------------------------|
| taskhub-backend    | https://hub.docker.com/r/beejay12/taskhub-backend                  |
| taskhub-frontend   | https://hub.docker.com/r/beejay12/taskhub-frontend                 |


To tag and push local builds:

```bash
docker login
docker compose push
```
---

## 7. Assumptions Made During Deployment

- **MongoDB runs as a separate container** (`mongo:7.0`) rather than a managed/external database service, with persistent data stored in the named volume `mongo-data`.
- **`MONGODB_URI` uses the Compose service name (`db`) as the hostname**, since backend and db communicate over the internal Docker network, not via `localhost`.
- **`NEXT_PUBLIC_API_URL` is a build-time variable** required by Next.js (values prefixed `NEXT_PUBLIC_` are inlined into the client bundle at build time). It must point to `http://localhost:3001` — the address reachable from the *browser* — not the internal service name `backend`.
- **No authentication is configured on MongoDB** (`MONGO_INITDB_ROOT_USERNAME` / `PASSWORD` are not set). This setup is assumed suitable for local development only; production deployments should enable Mongo access control and use secrets management instead of a plain `.env` file.
- **Ports 3000, 3001, and 27017 are assumed free** on the host machine. If any are already in use, update the left-hand side of the corresponding `ports:` mapping in `docker-compose.yml`.
- **`.env` is not committed to version control** and must be created manually (or from a `.env.example` template) on any machine deploying this stack.
- **`restart: always`** is used for all services, assuming this stack should automatically recover after a crash or host reboot; adjust to `unless-stopped` if manual control over restarts is preferred.
- **A mixed workflow is used**: images are built manually with `docker build`, containers are stopped manually with `docker stop`, but the app is started with `docker compose up`. Since `docker-compose.yml` uses `build: context:` (not a pinned `image:` name), `docker compose up` will build its own image for each service if one matching its expected name/tag isn't already present, and may ignore manually built images with different tags. To ensure the manually built images are the ones actually used, tag them to match what Compose expects (typically `<project-folder>-<service>`, e.g. `taskhub-backend`, `taskhub-frontend`) before running `docker compose up`.