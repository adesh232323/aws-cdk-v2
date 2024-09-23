import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const demoLambda = new lambda.Function(this, "demolambdalogicalid", {
      handler: "lambda_function.lambda_handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("../services/"),
      functionName: "lambdademocdk",
    });

    const cloudWatchDemo = new cloudwatch.Alarm(this, "cloudwtchlogicalid", {
      evaluationPeriods: 1,
      threshold: 1,
      metric: demoLambda.metricErrors(),
    });
  }
}
