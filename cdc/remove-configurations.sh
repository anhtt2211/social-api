#!/usr/bin/env bash

# remove source connector
curl -i -X DELETE localhost:8083/connectors/postgres-article-source

# remove sink connector
curl -i -X DELETE localhost:8083/connectors/es-article-sink

# remove indices
curl -X DELETE "localhost:9200/article"
