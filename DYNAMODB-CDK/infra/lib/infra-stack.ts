import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDbDemo = new dynamodb.Table(this, "dynamodblogicalid23", {
      readCapacity: 3,
      writeCapacity: 3,
      partitionKey: { name: "customerid", type: dynamodb.AttributeType.NUMBER },
      tableName: "dynamodbV2Demo23",
    });
  }
}
