import { SQSEvent, Context } from "aws-lambda";
import { Client } from "@elastic/elasticsearch";
import { EOpenSearchIndex } from "../constants";

const esClient = new Client({ node: process.env.OPENSEARCH_ENDPOINT });

export const handler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  for (const record of event.Records) {
    const article = JSON.parse(record.body).article;
    console.log("🚀 ~ file: migrateToOpenSeach.ts:9 ~ article:", article);

    // Index the article into OpenSearch
    await esClient.index({
      index: EOpenSearchIndex.ARTICLES,
      body: article,
    });
  }
};
