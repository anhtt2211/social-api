#!/usr/bin/env bash

# setup elasticsearch indices
curl -i -X PUT -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:9200/article?include_type_name=true -d @configs/es-indexes/es-article-index.json

# setup elasticsearch sink
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @configs/sink-connectors/es-article-sink.json

# setup connector
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @configs/source-connectors/postgres-article-source.json