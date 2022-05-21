FROM node:16-alpine3.14
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
CMD ts-node-dev --respawn --transpile-only ./src/server.ts,
