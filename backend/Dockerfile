# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Stage 2: Runtime ----------
# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Ensure our user owns the working directory before running npm install
RUN chown appuser:appgroup /app

ENV NODE_ENV=${NODE_ENV}

COPY --from=builder --chown=appuser:appgroup /app/package*.json ./

# Switch to your non-root user BEFORE running npm ci so the dependencies are owned by them!
USER appuser

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]