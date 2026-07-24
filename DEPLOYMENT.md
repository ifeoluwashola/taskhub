# TaskHub — AWS EC2 Deployment Documentation

## Overview

This document describes the deployment of the TaskHub full-stack application
(Next.js frontend, NestJS backend, MongoDB) to a single AWS EC2 instance using
Docker Compose and pre-built Docker Hub images.

---

## AWS Infrastructure

| Resource | Value |
|---|---|
| AWS Region | us-east-1 |
| Availability Zone | us-east-1a |
| VPC Name | kybern-taskhub-vpc |
| VPC CIDR Block | 10.0.0.0/16 |
| Public Subnet Name | kybern-taskhub-public-subnet |
| Public Subnet CIDR Block | 10.0.0.0/24 |
| Internet Gateway | kybern-taskhub-igw |
| Public Route Table | kybern-taskhub-RT |
| Route Table Rule | 0.0.0.0/0 → Internet Gateway |
| Security Group | kybern-taskhub-SG |
| EC2 Instance Name | kybern-taskhub-server |
| EC2 Operating System | Ubuntu (Ubuntu Server, latest LTS) |
| EC2 Public IPv4 Address | 44.202.206.132 |

---

## Security Group Rules

| Type | Protocol | Port | Source | Purpose |
|---|---|---|---|---|
| SSH | TCP | 22 | My public IP only (x.x.x.x/32) | Admin access |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend (Next.js) public access |
| Custom TCP | TCP | 3001 | 0.0.0.0/0 | Backend (NestJS) public access |
| — | — | 27017 | Not exposed | MongoDB — internal Docker network only |

---

## Docker Hub Images

| Service | Image | Tag |
|---|---|---|
| Backend | `temigodson/taskhub-hub-backend` | `v2` |
| Frontend | `temigodson/taskhub-hub-frontend` | `v2` |

---

## Environment Variables

The following environment variables are required (see `.env.example` for
placeholder values — real values are not committed to the repository):

- `IMAGE_VERSION`
- `MONGO_ROOT_USER`
- `MONGO_ROOT_PASSWORD`
- `MONGO_DB_NAME`
- `MONGO_PORT`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `NEXT_PUBLIC_API_URL` — set to `http://<EC2_PUBLIC_IP>:3001`
- `NODE_ENV`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN` — set to `http://<EC2_PUBLIC_IP>:3000`

The backend connects to MongoDB using the Docker Compose service name
(`mongodb`), not `localhost`:

```
MONGODB_URI=mongodb://<user>:<password>@mongodb:27017/<db>?authSource=admin
```

---

## Docker Installation Steps (on EC2)

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to the docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## Deployment Commands

```bash
# Clone the repository / navigate to project directory
cd ~/taskhub-hub

# Configure environment variables
nano .env

# Pull the latest images from Docker Hub
docker compose -f docker-compose.yaml pull

# Start the application
docker compose -f docker-compose.yaml up -d

# Verify containers are running
docker compose -f docker-compose.yaml ps

# Review logs
docker compose -f docker-compose.yaml logs --tail=30
```

---

## Application URL

```
http://44.202.206.132:3000
```

---

## Problems Encountered and Solutions

1. **SSH open to the internet.** The Security Group initially allowed SSH
   (port 22) from `0.0.0.0/0`. This was corrected by restricting the SSH
   inbound rule to the deployer's public IP address only (`/32`), in line with
   least-privilege access.

2. **Frontend/backend port rules briefly swapped with the SSH restriction.**
   While editing inbound rules, the IP restriction was momentarily applied to
   the frontend port instead of SSH. This was caught and corrected so that SSH
   is restricted and the application ports remain publicly accessible.

---

## Resource Cleanup

After grading/submission, the following resources were reviewed for removal
to avoid ongoing AWS charges:

- [ ] Terminate EC2 instance (`kybern-taskhub-server`)
- [ ] Delete unused EBS volumes
- [ ] Delete Security Group (`kybern-taskhub-SG`)
- [ ] Delete public route table (`kybern-taskhub-RT`)
- [ ] Detach and delete Internet Gateway (`kybern-taskhub-igw`)
- [ ] Delete public subnet (`kybern-taskhub-public-subnet`)
- [ ] Delete custom VPC (`kybern-taskhub-vpc`) 
