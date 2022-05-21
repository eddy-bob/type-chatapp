FROM node:16-alpine3.14
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
CMD  transpile-only ./src/server.ts,
