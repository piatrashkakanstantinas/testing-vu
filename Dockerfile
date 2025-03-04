FROM node:22-alpine
RUN apk add chromium-chromedriver
WORKDIR /app