FROM node:latest
COPY . /bot
WORKDIR /bot
RUN npm install && npx tsc

VOLUME ["/root"]
ENV KEY=""
WORKDIR /root
CMD node /bot/dist/app.js -k ${KEY}