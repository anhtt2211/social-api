# NestJS Social Network API

## Project Overview

This project is a robust social networking platform built using NestJS. It features a microservices architecture, integrating technologies Redis for caching. The platform includes modules for user management, article handling, profiles, tags, and media management, showcasing a scalable and modular design.

## Technology Stack

- NestJS
- TypeScript
- Redis
- PostgreSQL
- Docker

## Architecture

### High level design

![alt text](./assets/architect.png)

The application adopts a microservices architecture with distinct modules:

- **User Module:** Manages user registration, authentication, and profile operations.
- **Article Module:** Handles article creation, updates, deletion, and commenting features.
- **Profile Module:** Manages user profiles.
- **Tag Module:** Responsible for tag management associated with articles.
- **Media Module:** Handles uploading and retrieving media content.
- **Persistence Module:** Manages database connections and migrations.
- **Redis Module:** Handles cached user login.

Each module follows the CLEAN architecture, promoting separation of concerns and maintainability.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Redis server
- PostgreSQL server
- Kafka server

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

### Configuring Debezium for Change Data Capture (CDC)

Debezium is used in this project to enable near real-time data streaming from PostgreSQL to Elasticsearch.

#### Prerequisites

Ensure that you have Kafka and Zookeeper running before proceeding.

#### Running Debezium Connectors

To configure Debezium, follow these steps:

Run the shell scripts to set up Elasticsearch indexes and Debezium connectors.

```bash
bash cdc/es-indexes/indexes_mappings.sh
bash cdc/create_connectors.sh
```

### Explanation of Shell Scripts

- **`cdc/es-indexes/indexes_mappings.sh`**: Creates index mappings in Elasticsearch to store CDC data.
- **`cdc/create_connectors.sh`**: Configures Debezium connectors to capture changes from PostgreSQL and stream them to Kafka.

### Verifying the Setup

To verify that the connectors are working correctly, you can check the status of registered connectors:

```bash
curl -s -X GET http://localhost:8083/connectors | jq .
```

### Running the Application

```
yarn start
```

Auto-Generate migration

    npm run migration:generate -c <orm_connection> -n <migration_name>

## API Documentation

Swagger-based API documentation is available at `http://localhost:8000/docs`.

## Environment Variables

Refer to the env.example file for necessary environment variables.
