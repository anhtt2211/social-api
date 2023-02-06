# Use an official Node.js image as the base image
FROM node:14.19.1-alpine

# Set the working directory in the image
WORKDIR /social

# Copy the package.json and yarn.lock files to the container
COPY package.json package*.json yarn.lock ./

RUN apk add g++ make py3-pip

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the NestJS application
# RUN npm run build

# Expose port 8000 for incoming traffic
EXPOSE 8000

# Specify the command to run when the container starts
CMD ["npm", "run", "start"]
