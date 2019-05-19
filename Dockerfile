FROM node:8.16.0-alpine
COPY ./dist /app/dist/
COPY ./spec /app/spec/
COPY ./node_modules /app/node_modules/
WORKDIR /app
EXPOSE 8001