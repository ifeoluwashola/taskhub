# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

# Create a non-root user/group to run the app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Switch to non-root user before running the app
USER appuser

EXPOSE 3001

CMD ["node", "dist/main.js"]