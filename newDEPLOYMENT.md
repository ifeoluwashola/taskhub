# TaskHub AWS Deployment

## Infrastructure

- AWS EC2 Ubuntu
- Docker
- Docker Compose
- MongoDB
- Backend (NestJS)
- Frontend (Next.js)

## Deployment Steps

1. Launch EC2 instance.
2. Install Docker and Docker Compose.
3. Clone repository.
4. Configure .env.
5. Build Docker images.
6. Push images to Docker Hub.
7. Pull images on EC2.
8. Run:

```bash
docker compose -f compose.aws.yml up -d
```

## Public URLs

Frontend

```
http://13.51.242.75:3000
```

Backend

```
http://13.51.242.75:3001/api
```

## Docker Images

Frontend

```
emex2275/taskhub-frontend:v3
```

Backend

```
emex2275/taskhub-backend:v1
```

## Challenges

- Docker storage exhausted
- MongoDB authentication issue
- Frontend API URL incorrectly pointed to localhost
- Docker compose configuration issue

## Resolution

- Increased EC2 storage
- Corrected MongoDB credentials
- Rebuilt frontend image
- Updated compose.aws.yml