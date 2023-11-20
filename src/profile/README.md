# Profile Module

## Overview

The Profile Module handles user profile operations, such as viewing and updating profile information.

## Architecture

- **Core:** Contains business logic related to user profiles.
- **Application:** Manages application-specific logic for profile operations.
- **Presentation:** Provides REST API endpoints for profile management.

## REST API Endpoints

- `GET /profiles/:userId`: Fetch a user's profile.
- `PUT /profiles/:userId`: Update a user's profile.

## Technologies and Libraries

- NestJS
- TypeScript
- PostgreSQL
