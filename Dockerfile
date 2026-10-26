FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY server.js .
RUN mkdir public
COPY index.html public/index.html
COPY robots.txt public/robots.txt
COPY favicon.ico favicon-32.png apple-touch-icon.png og-image.png public/
EXPOSE 80
CMD ["node", "server.js"]
