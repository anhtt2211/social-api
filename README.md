# Getting started

## Installation

Clone the repository

    git clone https://github.com/anhtt2211/social-api.git

Switch to the repo folder

    cd social-api

Install dependencies

    npm install

Create file .env from .env.example and fill it

    cp .env.example .env

Run migration

    npm run migration:run

---

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner
- `npm run start:prod` - Build application

---

## Start application

- `npm start`
- Test api with `http://localhost:8000/api/articles` in your favourite browser

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

---

# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)
