FROM node
WORKDIR /app
COPY . .
RUN yarn install --production && yarn run build
CMD ["node", "./build/index.js"]
EXPOSE 3000