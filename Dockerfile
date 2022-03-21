FROM node:14.19.1
LABEL maintainer="Richard Thombs <richard@gearstone.uk>"

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 80
ENTRYPOINT ["npx", "next", "start", "-p", "80"]
