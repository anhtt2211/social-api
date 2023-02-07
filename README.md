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

    npm run migration:run <db_name>

---

## Running on docker
Build images

    docker-compose build

Run on docker

    docker-compose up

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner
- `npm run start:prod` - Build application

---

# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)
