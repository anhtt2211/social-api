# Article Module

## Overview

The Article Module manages the functionalities related to articles and comments in the social network application. It includes creating, updating, deleting, and fetching articles, as well as managing comments.

## Architecture

Following the CLEAN architecture, the module is organized into:

- **Core:** Contains business logic, entities, and interfaces.
- **Application:** Handles application-specific logic like queries, commands, and events.
- **Presentation:** Manages the presentation layer with RESTful API endpoints and RabbitMQ integration.

## REST API Endpoints

### Articles

- `POST /articles`: Create a new article.
- `GET /articles`: Get a list of articles.
- `PUT /articles/:id`: Update a specific article.
- `DELETE /articles/:id`: Delete a specific article.
- `POST /articles/:id/favorite`: Favorite an article.
- `DELETE /articles/:id/favorite`: Unfavorite an article.

### Comments

- `POST /articles/:id/comments`: Add a comment to an article.
- `GET /articles/:id/comments`: Get all comments for an article.
- `DELETE /articles/:id/comments/:commentId`: Delete a specific comment.

## Special Instructions

- Ensure RabbitMQ and the PostgreSQL database are properly set up and connected.
- Swagger documentation is available for detailed API information.

## Technologies and Libraries

- NestJS
- TypeScript
- RabbitMQ
- PostgreSQL
