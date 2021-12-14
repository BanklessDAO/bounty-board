# Use an official node runtime as a parent image
FROM node:14-alpine

WORKDIR /app

# Install dependencies
RUN yarn --silent

EXPOSE 3000

CMD yarn dev