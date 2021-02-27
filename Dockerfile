FROM  nginx:latest
LABEL maintainer="Richard Thombs <richard@gearstone.uk>"

COPY _site/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
