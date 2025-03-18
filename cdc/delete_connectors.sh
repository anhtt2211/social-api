#!/bin/bash

CONNECTOR_URL="http://localhost:8083/connectors"

# Delete Postgres Connector
curl -X DELETE $CONNECTOR_URL/postgres-connector

# Delete Elasticsearch Sink for Articles Connector
curl -X DELETE $CONNECTOR_URL/es-sink-articles

# Delete Elasticsearch Sink for Blocks Connector
curl -X DELETE $CONNECTOR_URL/es-sink-blocks

# Delete Elasticsearch Sink for Users Connector
curl -X DELETE $CONNECTOR_URL/es-sink-users

echo "Connectors deleted successfully!"
