FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM node:16-alpine as runner
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev \
    && npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./

ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]