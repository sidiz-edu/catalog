FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY server.js .
RUN mkdir public
COPY index.html public/index.html
COPY favicon.svg public/favicon.svg
COPY og-image.svg public/og-image.svg
EXPOSE 80
CMD ["node", "server.js"]
