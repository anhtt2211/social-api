FROM node:20.4.0-alpine

WORKDIR /social

COPY package.json yarn.lock ./

RUN apk add g++ make py3-pip

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]
