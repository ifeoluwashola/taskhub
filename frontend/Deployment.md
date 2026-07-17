# TaskHub Docker Deployment Guide

# 1&2. Building and Starting the Docker Images

Navigate to the project root directory (the directory containing the `docker-compose.yml` file):

```bash
cd Taskhub
```

Build and start the application simultaneously:

```bash
docker compose up --build
```

This command builds the images for:

* Frontend (Next.js)
* Backend (NestJS)

and downloads the MongoDB image if it is not already available locally.

---


# 3. Accessing the Application

Once all containers are running, the services are available at:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3005 |
| Backend API | http://localhost:3001 |

To verify that the containers are running:

```bash
docker compose ps
```

---

# 4. Stopping the Application

To stop all running containers and remove them:

```bash

docker compose down
```

The MongoDB data volume is preserved, so the database contents remain available the next time the application is started.

---

# 5. Rebuilding the Containers

Whenever changes are made to the application source code, dependencies, or Dockerfiles, rebuild the containers using:

```bash
docker compose up --build
```


---

# 6. Restarting the Application

Restart all services:

```bash
docker compose restart
```
---

# 7. Dockerhub Links

link for the frontend image https://hub.docker.com/repository/docker/samakn/taskhub/tags/frontend-v1/sha256-a24bf02354d3f62d4450ddcee3a6ec168c4ed35bd65a33316a59106aa61b12ad


link for the backend image https://hub.docker.com/repository/docker/samakn/taskhub/tags/backend-v1/sha256-a9c23349f9d148d001158a50c006534602434e734ffb6cbd09f603d956f4cba9


---



