import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // IAM Role
    const retailFeedIamRole = new iam.Role(this, "reatiliamlogicalid", {
      roleName: "inventoryfeedlambdarole",
      description: "role for lambda service",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    retailFeedIamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    retailFeedIamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    retailFeedIamRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchFullAccess")
    );

    const retailLambda = new lambda.Function(this, "retaillambdalogicalid", {
      role: retailFeedIamRole,
      handler: "lambda_function.lambda_handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("../service/"),
    });

    retailLambda.node.addDependency(retailFeedIamRole);

    //S3 bucket
    const retailS3Bucket = new s3.Bucket(this, "retails3logicalid", {
      bucketName: "retailfeeds3bucket232323",
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    retailS3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(retailLambda)
    );

    const retailDynamoDb = new dynamodb.Table(this, "retaildynamodblogicalid", {
      tableName: "retaildynamodbtable",
      partitionKey: {
        name: "customername",
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
