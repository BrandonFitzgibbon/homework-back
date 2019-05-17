FROM node:8.16.0-alpine

COPY . /app

WORKDIR /app

CMD npm start