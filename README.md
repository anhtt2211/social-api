# Getting started

## Installation

Clone the repository

    git clone https://github.com/anhtt2211/nestjs-boilerplate.git

Switch to the repo folder

    cd nestjs-boilerplate

Install dependencies

    npm install

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts

---

##### TypeORM

---

Create a new mysql database with the name `nestjs-boilerplate`\
(or the name you specified in the ormconfig.json)

Copy TypeORM config example file for database settings

    cp ormconfig.json.example

Set mysql database settings in ormconfig.json

    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "your-mysql-username",
      "password": "your-mysql-password",
      "database": "nestjs-boilerplate",
      "entities": ["src/**/**.entity{.ts,.js}"],
      "synchronize": true
    }

Start local mysql server and create new database 'nestjs-boilerplate'

On application start, tables for all entities will be created.

---

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner
- `npm run start:prod` - Build application

---

## API Specification

This application adheres to the api specifications set by the [Thinkster](https://github.com/gothinkster) team. This helps mix and match any backend with any other frontend without conflicts.

> [Full API Spec](https://github.com/gothinkster/realworld/tree/master/api)

More information regarding the project can be found here https://github.com/gothinkster/realworld

---

## Start application

- `npm start`
- Test api with `http://localhost:3000/api/articles` in your favourite browser

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

---

# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)
