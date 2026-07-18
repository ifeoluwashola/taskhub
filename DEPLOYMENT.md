# TaskHub Deployment Guide

## Project Overview

This project containerizes the TaskHub application using Docker and Docker Compose.

The application consists of:
- Next.js Frontend
- NestJS Backend
- MongoDB Database

All services are started with a single Docker Compose command.

---

## Build the Application

From the project root, run:

```bash
docker compose build
```

This builds the frontend and backend Docker images.

---

## Start the Application

To start all services:

```bash
docker compose up
```

Or, if you want to rebuild the images before starting:

```bash
docker compose up --build
```

After the containers start successfully:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Documentation: http://localhost:3001/api/docs

---

## Stop the Application

To stop all running containers:

```bash
docker compose down
```

---

## Rebuild the Containers

If changes are made to the Dockerfiles or application:

```bash
docker compose up --build
```

---

## Docker Hub Images

Frontend Image

https://hub.docker.com/r/devmarvel1/taskhub-frontend

Backend Image

https://hub.docker.com/r/devmarvel1/taskhub-backend

---

## Environment Variables

The deployment uses environment variables instead of hardcoding values.

Backend:

- `PORT`
- `MONGODB_URI`

Frontend:

- `NEXT_PUBLIC_API_URL`

---

## Persistent Storage

MongoDB data is stored using a Docker volume (`mongo-data`) so that database data is preserved even if the MongoDB container is removed.

---

## Assumptions

During deployment, the following assumptions were made:

- Docker Desktop is installed and running.
- Docker Compose is available.
- MongoDB runs as a Docker container.
- Docker Compose provides networking between the frontend, backend, and MongoDB.
- The backend connects to MongoDB using the `MONGODB_URI` environment variable.
- The frontend communicates with the backend using the `NEXT_PUBLIC_API_URL` environment variable.