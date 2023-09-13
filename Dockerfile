FROM node
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "./build/index.js"]
EXPOSE 3000