#!/bin/bash

CONNECTOR_URL="http://localhost:8083/connectors"

# Create Postgres Debezium Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @postgres-connector.json

# Create Elasticsearch Sink Connector
curl -X POST $CONNECTOR_URL -H "Content-Type: application/json" --data @elastic-sink.json

echo "Connectors created successfully!"
