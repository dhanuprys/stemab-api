FROM node
WORKDIR /app
COPY . .
RUN npm ci && npm run build
CMD ["node", "./build/index.js"]
EXPOSE 3000