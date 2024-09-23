import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from "aws-cdk-lib/aws-s3";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3DemoBucket = new s3.Bucket(this, "s3demobucket012253", {
      bucketName: "demos3bucket012220223",
      versioned: true,
      publicReadAccess: false,
      // add this property for delete the empty s3 bucket for destroy cmd
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // this property for delete for s3 with data
      autoDeleteObjects: true,
    });
  }
}
