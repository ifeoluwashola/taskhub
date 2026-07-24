#--------BUILD STAGE-----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build
#------PRODUCTION STAGE
FROM node:22-alpine

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app ./

RUN chown -R appuser:appgroup /app && chmod -R 755 /app
USER appuser
EXPOSE 3000
CMD ["npm", "start"]
