FROM node:latest AS builder
COPY . /root
WORKDIR /root
RUN npm install -g typescript && npm install --production && tsc

FROM node:alpine
VOLUME ["/root"]
ENV KEY=""
COPY --from=builder /root/dist/app.js /bot/
COPY --from=builder /root/node_modules /bot/
WORKDIR /root
CMD node /app.js -k ${KEY}