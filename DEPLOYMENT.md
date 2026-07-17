# TaskHub Deployment Guide

## Overview

TaskHub is a production-ready full-stack Project Management application developed as part of the Kybern DevOps training program.

The application consists of three services:

* **Frontend:** Next.js 16 (React 19)
* **Backend:** NestJS
* **Database:** MongoDB

The application has been containerized using Docker and orchestrated with Docker Compose so that all services can be started with a single command.

---

# Project Architecture

```
                Browser
                   │
                   ▼
          Frontend (Next.js)
                   │
                   ▼
          Backend (NestJS API)
                   │
                   ▼
             MongoDB Database
```

All services communicate through Docker's internal network created automatically by Docker Compose.

---

# Prerequisites

Before deploying the application, install:

* Docker Engine
* Docker Compose
* Git

Verify the installation:

```bash
docker --version
docker compose version
git --version
```

---

# Clone the Repository

```bash
git clone https://github.com/fidelii2004/taskhub--b.git
cd taskhub--b
```

---

# Project Structure

```
taskhub--b/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── DEPLOYMENT.md
├── README.md
└── docs/
```

---

# Build the Docker Images

Run:

```bash
docker compose build
```

This command builds the frontend and backend Docker images using the Dockerfiles located in each project directory.

---

# Start the Application

Run:

```bash
docker compose up
```

To run the application in detached mode:

```bash
docker compose up -d
```

Docker Compose starts:

* MongoDB
* Backend
* Frontend

---

# Verify the Deployment

Check the running containers:

```bash
docker compose ps
```

Expected output:

```
mongodb            Up
taskhub-backend    Up
taskhub-frontend   Up
```

Open the application:

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:3001
```

The backend should return:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": "Hello World!"
}
```

---

# View Logs

To view logs for all services:

```bash
docker compose logs
```

Backend logs:

```bash
docker compose logs backend
```

Frontend logs:

```bash
docker compose logs frontend
```

MongoDB logs:

```bash
docker compose logs mongodb
```

---

# Stop the Application

```bash
docker compose down
```

This stops and removes the containers while preserving MongoDB data.

---

# Remove Containers and Volumes

```bash
docker compose down -v
```

This removes:

* Containers
* Networks
* MongoDB persistent volume

---

# Rebuild the Application

If changes are made to the Dockerfiles or application source code:

```bash
docker compose up --build
```

Docker rebuilds the images before starting the containers.

---

# Environment Variables

## Backend

```
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/kybern-taskhub
JWT_SECRET=<your-secret>
```

## Frontend

```
NEXT_PUBLIC_API_URL=http://backend:3001/api
```

Environment variables are supplied through Docker Compose. Sensitive values are not hardcoded into the Dockerfiles.

---

# Docker Hub Images

Frontend Image

https://hub.docker.com/r/fidelii2004/taskhub-frontend

Backend Image

https://hub.docker.com/r/fidelii2004/taskhub-backend

---

# Security Best Practices Implemented

* Multi-stage Docker builds
* Production-only dependencies in runtime images
* Containers run as non-root users
* Minimal Alpine Linux base images
* Docker internal networking
* Persistent MongoDB volume
* Environment variables used instead of hardcoded configuration
* Optimized Docker image layers
* Unnecessary files excluded using `.dockerignore`

---

# Assumptions

The deployment assumes:

* Docker Engine is installed.
* Docker Compose is installed.
* Ports 3000, 3001, and 27017 are available.
* Internet access is available for downloading base images.

---

# Troubleshooting

Check running containers:

```bash
docker compose ps
```

Restart services:

```bash
docker compose restart
```

Restart a specific service:

```bash
docker compose restart backend
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

View MongoDB logs:

```bash
docker compose logs mongodb
```

---

# Deployment Summary

The TaskHub application has been successfully containerized following Docker and DevOps best practices.

The deployment includes:

* Dockerized Next.js frontend
* Dockerized NestJS backend
* MongoDB database
* Docker Compose orchestration
* Persistent MongoDB storage
* Production-ready Docker images
* Non-root container execution
* Docker Hub image publication
* Deployment documentation

The application can be deployed on any machine with Docker installed by running a single command:

```bash
docker compose up -d
```
