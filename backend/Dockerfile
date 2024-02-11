#  Dockerfile for Node Express Backend

FROM node:20.11-alpine
LABEL version="1.0"
LABEL description="Docker Image for Foodiee-Backend"
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 3030
CMD ["npm","start"]