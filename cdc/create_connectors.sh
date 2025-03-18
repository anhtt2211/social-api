#!/bin/bash

CONNECTOR_URL="http://localhost:8083/connectors"

# Create Postgres Debezium Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @postgres-connector.json

# Create Elasticsearch Sink for Article Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @es-sink/elastic-sink-articles.json

# Create Elasticsearch Sink for Block Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @es-sink/elastic-sink-blocks.json

# Create Elasticsearch Sink for User Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @es-sink/elastic-sink-users.json

echo "Connectors created successfully!"
