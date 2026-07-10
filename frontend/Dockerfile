FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN rm -rf /app/build /app/.react-router /app/node_modules/.vite /tmp/*
RUN npm run build

FROM node:24-alpine AS ssr

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["npx", "react-router-serve", "./build/server/index.js"]

FROM nginx:alpine AS web

RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY --from=build /app/build/client /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
