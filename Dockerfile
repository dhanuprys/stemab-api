FROM node:18
WORKDIR /app
COPY . .
RUN npm ci && npm run build
CMD ["npm", "run", "start"]
EXPOSE 3010