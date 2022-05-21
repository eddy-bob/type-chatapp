

FROM node:16-alpine3.14
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_CONN_STRING=mongodb+srv://eddymadu:Avugaraniniuboch22.@nodechatapp.khmbi.mongodb.net/?retryWrites=true&w=majority
ENV DB_NAME=VideoChatApp
ENV ENV DB_PASSWORD=Avugaraniniuboch22
ENV DB_USERNAME=eddymadu
ENV HASH_ROUND=10
ADD package*.json ./
RUN npm install -g typescript
RUN npm install -g ts-node

RUN npm install

ADD . .

CMD [ "node","./dist/server.js"]

