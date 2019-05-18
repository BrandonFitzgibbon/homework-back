FROM node:8.16.0-alpine
COPY ./dist /app
COPY ./spec /app
COPY ./node_modules /app
WORKDIR /app