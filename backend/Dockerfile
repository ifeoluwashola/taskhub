
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev

FROM base AS build
ENV NODE_ENV=development
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

USER appuser

EXPOSE 3001
CMD ["node", "dist/main.js"]
