FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY favicon.svg /usr/share/nginx/html/favicon.svg
COPY og-image.svg /usr/share/nginx/html/og-image.svg
EXPOSE 80
