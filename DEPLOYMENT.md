# TaskHub Deployment Guide

## Prerequisites

- Docker
- Docker Compose

## Clone Repository

```bash
git clone <repository-url>
cd taskhub
```

## Build Images

```bash
docker compose build
```

## Start the Application

```bash
docker compose up
```

To rebuild after changes:

```bash
docker compose up --build
```

## Stop the Application

```bash
docker compose down
```

## Services

Frontend:
http://localhost:3000

Backend:
http://localhost:3001/api

MongoDB:
mongodb://mongodb:27017

## Docker Images

Frontend:
emex2275/taskhub-frontend:v1

Backend:
emex2275/taskhub-backend:v1