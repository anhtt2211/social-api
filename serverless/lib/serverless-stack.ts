import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as queue from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

import { EOpenSearchIndex, ESQSQueue } from "../src/constants";

export class ServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SQS
    const createArticleQueue = new queue.Queue(this, "CreateArticleQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: ESQSQueue.CREATE_ARTICLE_QUEUE,
    });

    // Lambda
    const migrateToOpenSearchFn = new lambda.Function(
      this,
      "MigrateToOpenSearchFn",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        functionName: `MigrateToOpenSearchFn`,
        handler: "index.handler",
        code: lambda.Code.fromAsset("src/handlers"),
        environment: {
          QUEUE_URL: createArticleQueue.queueUrl,
          OPENSEARCH_ENDPOINT:
            "https://search-sphere-zylrvjudikl6jkavvvvncg2bpy.aos.ap-southeast-1.on.aws",
        },
      }
    );

    // Open Search
    const openSearchDomain = opensearch.Domain.fromDomainAttributes(
      this,
      "SphereOpenSearchDomain",
      {
        domainArn: "arn:aws:es:ap-southeast-1:925113307263:domain/sphere",
        domainEndpoint:
          "https://search-sphere-zylrvjudikl6jkavvvvncg2bpy.aos.ap-southeast-1.on.aws",
      }
    );

    // Grant Permission
    createArticleQueue.grantConsumeMessages(migrateToOpenSearchFn);
    openSearchDomain.grantIndexReadWrite(
      EOpenSearchIndex.ARTICLES,
      migrateToOpenSearchFn
    );
  }
}
