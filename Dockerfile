

FROM node:16-alpine3.14
WORKDIR /app
ADD package*.json ./
ADD  tsconfig.json ./
RUN npm install -g typescript
COPY src ./src
ENV NODE_ENV=development
ENV PORT=3000
ENV DB_CONN_STRING=mongodb+srv://eddymadu:Avugaraniniuboch22.@nodechatapp.khmbi.mongodb.net/?retryWrites=true&w=majority
ENV DB_NAME=VideoChatApp
ENV DB_PASSWORD=Avugaraniniuboch22
ENV DB_USERNAME=eddymadu
ENV HASH_ROUND=10
RUN ls -a
RUN npm install
RUN tsc
ADD . .
CMD [ "node","./dist/server.js"]

