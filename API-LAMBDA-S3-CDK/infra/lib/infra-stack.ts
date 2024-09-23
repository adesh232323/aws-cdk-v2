import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const balanceStatuss3 = new s3.Bucket(this, "s3bucketlogicalid", {
      bucketName: "balancesttus0125",
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const iamBankingStatusRole = new iam.Role(this, "iambalancerolelogicalid", {
      roleName: "bankingLambdaRole",
      description: "Role for lambda to access S3 bucket",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    iamBankingStatusRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );

    const bankingLambdaFunction = new lambda.Function(this, "lambdalogicalid", {
      handler: "lambda_function.lambda_handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("../services/"),
      role: iamBankingStatusRole,
    });

    // Api gateway
    const bankingRestApi = new apigateway.LambdaRestApi(
      this,
      "bankingrestapi",
      {
        handler: bankingLambdaFunction,
        restApiName: "bankingrestapi",
        deploy: true,
        proxy: false,
      }
    );

    const bankstatus = bankingRestApi.root.addResource("bankstatus");
    bankstatus.addMethod("GET");
  }
}
