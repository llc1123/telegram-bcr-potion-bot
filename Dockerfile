FROM node:latest AS builder
COPY . /root
WORKDIR /root
RUN npm install && npx tsc

FROM node:latest AS dependencies
COPY . /root
WORKDIR /root
RUN npm install --production

FROM node:alpine
VOLUME ["/root"]
ENV KEY=""
COPY --from=builder /root/dist/app.js /bot/
COPY --from=dependencies /root/node_modules /bot/node_modules
WORKDIR /root
CMD node /bot/app.js -k ${KEY}