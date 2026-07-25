#build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

#production stage 
FROM node:22-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
RUN chown -R appuser:appgroup /app && chmod -R 755 /app

USER appuser

EXPOSE 5000
CMD ["node", "dist/main.js"]

