# User Module

## Overview

The User Module is responsible for managing user-related functionalities like registration, authentication, and user profile management.

## Architecture

- **Core:** Contains core business logic, entities, and interfaces.
- **Application:** Handles user-specific logic, such as user registration and authentication commands and queries.
- **Presentation:** Manages REST API endpoints for user operations.

## REST API Endpoints

- `POST /users`: Create a new user (registration).
- `POST /users/login`: Authenticate a user (login).
- `GET /users/:id`: Retrieve user details.
- `PUT /users/:id`: Update user information.

## Technologies and Libraries

- NestJS
- TypeScript
- PostgreSQL
- Redis (for caching or session management)
