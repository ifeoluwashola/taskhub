# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nestjs -G nodejs

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
