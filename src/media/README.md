# Media Module

## Overview

The Media Module is responsible for handling media-related functionalities, such as uploading, storing, and retrieving media files like images and videos.

## Architecture

- **Core:** Consists of business logic for media handling and storage.
- **Application:** Application logic for processing and managing media files.
- **Presentation:** REST API endpoints for media operations.

## REST API Endpoints

- `POST /media/img/presigned-url`: Generate a presigned url.

## Technologies and Libraries

- NestJS
- TypeScript
- File storage service (Amazon S3, Dropbox)

## Special Instructions

Configure the necessary file storage service and ensure proper integration.

## File Upload Flow

### Generating a Signed URL

1. **Client Request:** The client initiates an upload process by requesting a signed URL for file upload. This is done by sending a request to the `POST /media/img/presigned-url` endpoint.

2. **Server Response:** The server generates a presigned URL using the AWS S3 SDK. This URL allows the client to upload a file directly to an S3 bucket. The server responds with the signed URL and any required fields.

### Uploading the File

1. **Client Upload:** The client uses the received signed URL to upload the file directly to S3. This is achieved by making a PUT request to the signed URL with the file content in the request body.

2. **Successful Upload:** On a successful upload, S3 returns a response indicating success. The client then notifies the server of the successful upload.

### Security and Configuration

- Ensure that AWS IAM permissions for the server include `s3:PutObject`.
- The S3 bucket policy should be configured to allow the necessary actions.
- The signed URL should have an expiration time appropriate for the expected upload duration.
