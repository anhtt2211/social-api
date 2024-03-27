# debezium-postgresql-elasticsearch

## Target Architecture

## Tech Stack

- Docker
- Postgresql
- Zookeeper
- Schema Registry (Avro)
- Kafka
- Debezium
- Elasticsearch

## How to Run

```sh
# load environment variables
source .env

# Run all docker instances
docker-compose up
```

```sh
# Check if debezium is UP
curl -H "Accept:application/json" localhost:8083/
```

```sh
# Check if elasticsearch is UP
curl http://localhost:9200
```

```sh
# Deploy all configurations when elasticsearch and debezium is UP
sh deploy-configurations.sh
```

```sh
# Check installed debezium connector plugins
curl -H "Accept:application/json" http://localhost:8083/connector-plugins
```

```sh
# Check installed debezium configurations
curl -H "Accept:application/json" http://localhost:8083/connectors
```

```sh
# Check installed source connector status
curl -H "Accept:application/json" http://localhost:8083/connectors/postgres-article-source/status
```

```sh
# Check installed sink connector status
curl -H "Accept:application/json" http://localhost:8083/connectors/es-article-sink/status
```

```sh
# Check elasticsearch configurations
curl -H "Accept:application/json" http://localhost:9200/cdc.article_db.public.article
```

```sh
# Check if debezium topic is created
docker-compose exec kafka /kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list
```

```sh
# Check if elasticsearch already has content
curl -H "Accept:application/json" http://localhost:9200/cdc.article_db.public.article/_search?pretty
```

```sh
# Open new tab to manipulate table
docker-compose exec postgres env PGOPTIONS="--search_path=public" bash -c 'psql -U $POSTGRES_USER postgres'
```

```sh
# Check insert query
curl -X GET "localhost:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "id": {
        "query": 6
      }
    }
  }
}'
```

```sh
# Check update query
curl -X GET "localhost:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "id": {
        "query": 5
      }
    }
  }
}'
```

```sh
# Check delete query
curl -X GET "localhost:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "id": {
        "query": 5
      }
    }
  }
}'
```

```sh
# Watch messages from debezium topic as Binary
docker-compose exec kafka /kafka/bin/kafka-console-consumer.sh \
    --bootstrap-server kafka:9092 \
    --from-beginning \
    --property print.key=true \
    --topic cdc.article_db.public.article

# Watch messages from debezium topic as Converted Avro to Json
docker run -it --rm --name avro-consumer --network=debezium-postgresql-elasticsearch_default \
    --link cdc_zookeeper \
    --link cdc_kafka \
    --link cdc_postgres \
    --link cdc_schema_registry \
    debezium/connect:0.10 \
    /kafka/bin/kafka-console-consumer.sh \
      --bootstrap-server kafka:9092 \
      --property print.key=true \
      --formatter io.confluent.kafka.formatter.AvroMessageFormatter \
      --property schema.registry.url=http://schema-registry:8081 \
      --topic cdc.article_db.public.article

# Terminate all docker instances
docker-compose down
```

## References

- https://github.com/YegorZaremba/sync-postgresql-with-elasticsearch-example/
- https://github.com/debezium/debezium-examples/tree/main/tutorial
- https://medium.com/dana-engineering/streaming-data-changes-in-mysql-into-elasticsearch-using-debezium-kafka-and-confluent-jdbc-sink-8890ad221ccf
- https://debezium.io/documentation/reference/stable/connectors/mysql.html
- https://debezium.io/documentation/reference/connectors/postgresql.html
- https://docs.confluent.io/debezium-connect-mysql-source/current/mysql_source_connector_config.html
- https://debezium.io/documentation/reference/0.10/configuration/avro.html
- https://debezium.io/documentation/reference/1.2/configuration/event-flattening.html
- https://github.com/confluentinc/demo-scene/blob/master/kafka-to-elasticsearch/README.adoc
