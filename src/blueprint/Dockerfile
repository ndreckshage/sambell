FROM node:5.7-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
RUN NODE_ENV=production npm install

COPY . /usr/src/app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]
