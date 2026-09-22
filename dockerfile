FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["node", "server.js"]