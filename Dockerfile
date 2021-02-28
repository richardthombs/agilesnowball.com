FROM node:alpine
LABEL maintainer="Richard Thombs <richard@gearstone.uk>"

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 80
ENTRYPOINT ["npx", "next", "start", "-p", "80"]
