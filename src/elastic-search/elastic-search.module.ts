import { Module } from "@nestjs/common";
import { ElasticsearchModule as EsModule } from "@nestjs/elasticsearch";
import { SearchService } from "./elastic-search.service";

@Module({
  imports: [
    EsModule.register({
      node: process.env.ELASTICSEARCH_NODE,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    }),
  ],
  providers: [SearchService],
  exports: [EsModule, SearchService],
})
export class ElasticSearchModule {}
