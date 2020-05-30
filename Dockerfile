FROM node:latest AS builder
WORKDIR /root
COPY . /root
RUN npm install && npx tsc

FROM node:alpine
VOLUME ["/root"]
ENV KEY=""
COPY --from=builder /root/dist/app.js /
WORKDIR /root
RUN node /app.js -k ${KEY}