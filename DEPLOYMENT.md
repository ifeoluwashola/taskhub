# AWS EC2 Deployment Guide — Taskhub

This document describes how the Taskhub application was deployed to AWS EC2 using Docker Compose, with pre-built images pulled from Docker Hub.

## AWS Infrastructure

- AWS Region: us-west-1 (N. California)
- Availability Zone: us-west-1a
- VPC: kybern-taskhub-vpc
- VPC CIDR block: 10.0.0.0/16
- Public subnet: kybern-taskhub-public-subnet
- Public subnet CIDR block: 10.0.1.0/24
- Internet Gateway: kybern-taskhub-igw
- Public route table: kybern-taskhub-public-route-table (0.0.0.0/0 to Internet Gateway)
- EC2 instance: kybern-taskhub-server
- EC2 operating system: Ubuntu Server 24.04 LTS
- EC2 instance type: t3.micro
- EC2 public IPv4 address: 54.177.62.12

## Security Group Rules

- SSH (port 22): source restricted to my current public IP, updated as needed since it changes periodically
- Frontend (port 3000): source 0.0.0.0/0
- Backend (port 3001): source 0.0.0.0/0
- MongoDB (port 27017): no inbound rule, not publicly exposed, reachable only inside the Docker network

## Docker Hub Images

- Backend: adekolaleke/taskhub-backend:latest
- Frontend: adekolaleke/taskhub-frontend:v1 (rebuilt specifically for this deployment with NEXT_PUBLIC_API_URL set to the EC2 public IP)

## Environment Variables

PORT=3001
MONGODB_URI=mongodb://mongodb:27017/kybern-taskhub
JWT_SECRET=your-jwt-secret-here

See .env.example for the placeholder file committed to the repository. The real .env file is not committed and was transferred securely to the EC2 instance via scp.

## Docker Installation Steps (on EC2)

Connect to the instance:
ssh -i taskhub-aws-key.pem ubuntu@54.177.62.12

Update packages:
sudo apt update

Install Docker using the official convenience script:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

Allow the ubuntu user to run Docker without sudo:
sudo usermod -aG docker $USER

Log out and back in for the group change to apply, then verify:
docker --version
docker compose version

## Deployment Commands

Copy the required files to the EC2 instance:
scp -i taskhub-aws-key.pem compose.aws.yml ubuntu@54.177.62.12:~/
scp -i taskhub-aws-key.pem .env ubuntu@54.177.62.12:~/

Pull the images from Docker Hub:
docker compose -f compose.aws.yml pull

Start the application:
docker compose -f compose.aws.yml up -d

Check container status:
docker compose -f compose.aws.yml ps

Review startup logs:
docker compose -f compose.aws.yml logs --tail=30

## Application URL

http://54.177.62.12:3000

## Problems Encountered and Solutions

1. My local public IP address changed partway through the project, which broke SSH access since the Security Group rule was tied to my old IP. Fixed by checking my current public IP again and updating the SSH inbound rule in the Security Group to match. This happened more than once, so it is worth checking first if SSH access unexpectedly stops working.

2. The frontend image was initially built with NEXT_PUBLIC_API_URL set to localhost, which does not work once deployed, since the browser needs to reach the EC2 public IP, not the user's own machine. Fixed by rebuilding the frontend image locally with the correct EC2 public IP baked in at build time, tagging it as v1, and pushing that to Docker Hub specifically for this deployment.

3. A multi-line heredoc pasted into the terminal was cut off partway through, resulting in incomplete file content. Resolved by rebuilding the file in smaller, verified chunks instead of one large paste.

## Resource Cleanup

After submission and grading, the following AWS resources should be terminated to avoid ongoing charges:

- Terminate the EC2 instance: kybern-taskhub-server
- Delete the unused EBS volume attached to the instance, if not automatically removed on termination
- Delete the Security Group: kybern-taskhub-sg
- Delete the public route table: kybern-taskhub-public-route-table
- Detach and delete the Internet Gateway: kybern-taskhub-igw
- Delete the public subnet: kybern-taskhub-public-subnet
- Delete the custom VPC: kybern-taskhub-vpc

## Author

This deployment was set up by Owoade Adekola (adekolaleke) as part of the Kybern Academy DevOps assignment.
