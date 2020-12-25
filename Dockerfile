FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build
WORKDIR /usr/src/app

EXPOSE 5555
CMD [ "node", "server.js"]