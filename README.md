# NestJS Social Network API

## Project Overview

This project is a robust social networking platform built using NestJS. It features a microservices architecture, integrating technologies like RabbitMQ for message queuing and Redis for caching. The platform includes modules for user management, article handling, profiles, tags, and media management, showcasing a scalable and modular design.

## Technology Stack

- NestJS
- TypeScript
- RabbitMQ
- Redis
- PostgreSQL
- Docker

## Architecture

The application adopts a microservices architecture with distinct modules:

- **User Module:** Manages user registration, authentication, and profile operations.
- **Article Module:** Handles article creation, updates, deletion, and commenting features.
- **Profile Module:** Manages user profiles.
- **Tag Module:** Responsible for tag management associated with articles.
- **Media Module:** Handles uploading and retrieving media content.
- **Database Module:** Manages database connections and migrations.

Each module follows the CLEAN architecture, promoting separation of concerns and maintainability.

## Getting Started

### Prerequisites

- Node.js
- Docker
- RabbitMQ server
- Redis server
- PostgreSQL server

Auto-Generate migration

    npm run migration:generate -c <orm_connection> -n <migration_name>

---

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/anhtt2211/social-api.git
cd social-api
yarn install
```

### Running on docker

Build images

    docker-compose build

Run on docker

    docker-compose up

### Running the Application

```
yarn start
```

## API Documentation

Swagger-based API documentation is available at `http://localhost:8000/docs`.

## Environment Variables

Refer to the env.example file for necessary environment variables.
