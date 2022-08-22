FROM node:alpine
WORKDIR /opt/secinterview
COPY package*.json .
RUN npm ci
COPY . .

RUN npm install pm2 -g
CMD [ "pm2-runtime", "start","./bin/www"]