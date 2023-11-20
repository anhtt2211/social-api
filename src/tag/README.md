# Tag Module

## Overview

The Tag Module is designed to manage tags within the application. It handles operations like creating, retrieving, and managing tags associated with other entities like articles.

## Architecture

- **Core:** Contains business logic related to tag management, including entities and interfaces.
- **Application:** Manages application-specific logic for tag operations.
- **Presentation:** Provides REST API endpoints for tag-related actions.

## REST API Endpoints

- `POST /tags`: Create a new tag.
- `GET /tags`: Retrieve all tags.
- `GET /tags/:id`: Retrieve a specific tag.

## Technologies and Libraries

- NestJS
- TypeScript
- PostgreSQL
