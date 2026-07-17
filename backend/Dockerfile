#build stage

FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build



#production stage
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

RUN addgroup -S appgroup && \
adduser -S appuser -G appgroup

USER appuser

EXPOSE 3001

CMD ["node", "dist/main"]
