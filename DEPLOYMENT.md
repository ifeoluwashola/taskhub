# TaskHub — Docker Deployment Documentation

This document describes how to build, run, stop, and manage the containerized TaskHub application (Next.js frontend, NestJS backend, MongoDB database) using Docker and Docker Compose.

---

## 1. Project Structure

```text
taskhub-hub/
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yaml
└── .env
```

---

## 2. Prerequisites

- Docker Engine and Docker Compose installed
- Git (to clone the repository)
- A single, fully populated `.env` file at the project root directory (containing database secrets, app ports, and the `IMAGE_VERSION` tag)

---

## 3. How to Build and Tag Images

Docker Compose handles both building your code and applying your custom image tags dynamically using the `IMAGE_VERSION` variable defined in your root `.env` file.

To build and tag all images cleanly from scratch (ignoring cache layers):

```bash
docker compose build --no-cache
```

To build a specific service independently:

```bash
docker compose build backend
docker compose build frontend
```

---

## 4. How to Start the Application

From the project root (where `docker-compose.yaml` lives), use the following commands:

**Development / Foreground Mode:**

```bash
docker compose up
```

**Production / Detached Mode (runs in background):**

```bash
docker compose up -d
```

**Force a Build + Launch Sequence:**

```bash
docker compose up --build
```

### Active Ports

Once started, services are accessible locally via these ports:

| Service | Address |
|---|---|
| Frontend Dashboard | http://localhost:3000 |
| Backend API Engine | http://localhost:3001 |
| MongoDB Instance | localhost:27017 (internally resolved within the bridge network as `mongodb://taskhub-mongodb:27017`) |

---

## 5. How to Stop the Application

To stop running containers safely without losing state or removing network definitions:

```bash
docker compose stop
```

To stop containers and tear down virtual networks, but preserve your database records:

```bash
docker compose down
```

To wipe the environment completely, including permanently deleting all MongoDB data:

```bash
docker compose down -v
```

---

## 6. Environment Architecture

All configuration parameters are consolidated within a single root-level `.env` file. This central file drives the variable substitution inside `docker-compose.yaml`, configures runtime values inside the containers, and passes build-time arguments to Next.js.

> ⚠️ **Security Policy:** Under no circumstances should the `.env` file be committed to version control. It is explicitly excluded via `.gitignore` and ignored via `.dockerignore` configs.

---

## 7. Docker Hub Repositories

| Service | Docker Hub Registry Repository |
|---|---|
| Backend | `temigodson/taskhub-hub-backend` |
| Frontend | `temigodson/taskhub-hub-frontend` |

To pull images directly from the registry using a specific tag (e.g., `v2`), update your shell environment or execute:

```bash
IMAGE_VERSION=v2 docker compose pull
```

---

## 8. Core Deployment Principles

- **Data Persistence:** Database files are mapped to a named, isolated Docker volume (`mongo-data`). Your records safely survive application code updates and basic `down` routines.
- **Next.js Compilation Handling:** The `NEXT_PUBLIC_API_URL` variable is injected as a Docker build argument (`ARG`), ensuring it is compiled directly into the Next.js production client bundles during the build layer.
- **Security & Least Privilege:** Both production application containers run under dedicated, unprivileged non-root accounts (`node` for frontend, `appuser` for backend) to isolate container processes from host kernel execution vulnerabilities.
- **Dependency Integrity:** Production runtime files copy over fresh lockfile builds via `npm ci --omit=dev`. Directory ownership permissions are updated during compilation to ensure dependency layers remain readable by the active non-root application accounts.

---

## 9. Verifying the Deployment

Run this command to verify that all components are up and running cleanly:

```bash
docker compose ps
```

If a service crashes or refuses to connect, review its runtime stream directly using the service log tool:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```