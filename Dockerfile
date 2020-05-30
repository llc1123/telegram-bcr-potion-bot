FROM node:latest AS builder
COPY . /root
WORKDIR /root
RUN npm install && npm run build

FROM node:alpine
VOLUME ["/root"]
ENV KEY=""
COPY --from=builder /root/app.js /
WORKDIR /root
CMD node /app.js -k ${KEY}