# Dockerfile for React client

FROM node:20.11-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]
RUN npm run build

FROM nginx:1.25.2-alpine-slim
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]