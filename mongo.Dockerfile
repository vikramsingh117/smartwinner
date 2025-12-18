FROM mongo:7

# Simple MongoDB container for local development
# Database name: test_db (matches backend/src/connector.js)

ENV MONGO_INITDB_DATABASE=test_db

EXPOSE 27017

# Default CMD from mongo image will start mongod


