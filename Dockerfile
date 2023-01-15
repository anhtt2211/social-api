FROM node:14

# Create app directory
WORKDIR /social-api/

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

RUN npm run migration:run

# Bundle app source
COPY . .

# Start the server using the production build
CMD [ "npm", "run", "start" ]
