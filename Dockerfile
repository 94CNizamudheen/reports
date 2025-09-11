# Start from Debian
FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm ci --legacy-peer-deps
EXPOSE 1995
CMD ["node", "dist/main.js"]
