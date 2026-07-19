# TaskHub — Deployment Guide

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) v2+
- A `.env` file in the project root (see [Environment Variables](#environment-variables))

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values before running any command:

```bash
cp .env.example .env
```

| Variable         | Description                        |
|------------------|------------------------------------|
| `MONGO_USERNAME` | MongoDB root username              |
| `MONGO_PASSWORD` | MongoDB root password (use a strong value) |
| `JWT_SECRET`     | Secret key used to sign JWT tokens (use a strong value) |

Generate strong secrets with:

```bash
openssl rand -base64 32   # for MONGO_PASSWORD
openssl rand -base64 64   # for JWT_SECRET
```

---

## Docker Hub Images

Pre-built images are published at:

| Service  | Docker Hub Repository                                                          | Tag     |
|----------|--------------------------------------------------------------------------------|---------|
| Backend  | [obicauka/taskhub-backend](https://hub.docker.com/r/obicauka/taskhub-backend)  | `1.1`, `latest` |
| Frontend | [obicauka/taskhub-frontend](https://hub.docker.com/r/obicauka/taskhub-frontend)| `1.1`, `latest` |

---

## How to Build the Images

Build both images locally from source:

```bash
sudo docker compose build
```

Build a single service:

```bash
sudo docker compose build backend
sudo docker compose build frontend
```

---

## How to Start the Application

Start all services (MongoDB, backend, frontend) in detached mode:

```bash
sudo docker compose up -d
```

The application will be available at:

- **Frontend:** http://localhost:3000
- **Backend API:** accessible internally by the frontend via `http://backend:3000`

Check running containers:

```bash
sudo docker ps
```

View live logs:

```bash
sudo docker compose logs -f
```

View logs for a specific service:

```bash
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
```

---

## How to Stop the Application

Stop all running containers (preserves volumes and images):

```bash
sudo docker compose down
```

Stop and remove volumes (deletes all MongoDB data):

```bash
sudo docker compose down -v
```

---

## How to Rebuild the Containers

Use this after making code changes to pick up the latest source:

```bash
sudo docker compose up -d --build
```

Rebuild a single service without restarting the others:

```bash
sudo docker compose up -d --build backend
sudo docker compose up -d --build frontend
```

---

## Publishing Images to Docker Hub

After building, push both images:

```bash
sudo docker login
sudo docker compose push backend frontend

# Also push as latest
sudo docker tag obicauka/taskhub-backend:1.1 obicauka/taskhub-backend:latest
sudo docker tag obicauka/taskhub-frontend:1.1 obicauka/taskhub-frontend:latest
sudo docker push obicauka/taskhub-backend:latest
sudo docker push obicauka/taskhub-frontend:latest
```

---

## Assumptions

- **Docker Hub username** is `obicauka`. Update image names in `docker-compose.yml` if the username differs.
- **MongoDB** is not exposed to the host — it is only reachable by the backend over the internal `taskhub` Docker network.
- **Backend** is not exposed to the host — the frontend communicates with it over the internal Docker network at `http://backend:3000`.
- **Frontend** is the only service exposed to the host on port `3000`.
- All containers run as **non-root users** (`nestjs` for backend, `nextjs` for frontend) and have all Linux capabilities dropped (`cap_drop: ALL`).
- The `.env` file must be present in the project root before running `docker compose up`. It is excluded from version control via `.gitignore`.
- `NODE_ENV=production` is set inside both Dockerfiles, ensuring production-mode behaviour for Node.js and Next.js.
