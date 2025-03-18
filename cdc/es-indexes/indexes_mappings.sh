#!/bin/bash

ARTICLE_INDEXES="social_articles"
BLOCK_INDEXES="social_blocks"
USER_INDEXES="social_users"

CONNECTOR_URL="http://localhost:8083/"

# Create social_articles index mapping
curl -X PUT "http://localhost:9200/social.public.article" -H "Content-Type: application/json" --data @social_articles_mapping.json

# Create social_blocks index mapping
curl -X PUT "http://localhost:9200/social.public.block" -H "Content-Type: application/json" --data @social_blocks_mapping.json

# Create social_users index mapping
curl -X PUT "http://localhost:9200/social.public.user" -H "Content-Type: application/json" --data @social_users_mapping.json

echo "Indexes mappings created successfully!"