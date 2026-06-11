FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY sidiz-kiosk.html /usr/share/nginx/html/sidiz-kiosk.html
EXPOSE 80
