#!/bin/bash

CONNECTOR_URL="http://localhost:8083/connectors"

# Delete Postgres Connector
curl -X DELETE $CONNECTOR_URL/postgres-connector

# Delete Elasticsearch Sink Connector
curl -X DELETE $CONNECTOR_URL/elastic-sink

echo "Connectors deleted successfully!"
