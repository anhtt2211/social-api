FROM node:16

# Create app directory
WORKDIR /social-api/

COPY --chown=node:node package*.json ./
COPY ormconfig.js ./ormconfig.js
COPY --chown=node:node . .
COPY .env ./

RUN npm i
RUN npm run migration:run

USER node

# Start the server using the production build
CMD [ "npm", "run", "start" ]
