#BASE IMAGE
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup


#This stage is to first install the dependencies and then copy them to the build stage to avoid re-installing them every time we build the image.  
FROM base AS deps
COPY package*.json ./
RUN npm install

FROM base AS build
#This copies the node_modules from the deps stage to the build stage.
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
