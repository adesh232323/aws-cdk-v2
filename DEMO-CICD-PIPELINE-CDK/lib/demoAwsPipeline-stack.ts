import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { PipelineAppStage } from "./demoAwsPipeline-app-stack";
import { ManualApprovalStep } from "aws-cdk-lib/pipelines";

export class DemoCicdPipelineCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const demoCICDPipline = new CodePipeline(this, "demopipline", {
      synth: new ShellStep("Synth", {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: CodePipelineSource.gitHub(
          "adesh232323/demo_aws_cicd_pipeline",
          "master"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const testingStage = demoCICDPipline.addStage(
      new PipelineAppStage(this, "test")
    );

    testingStage.addPost(new ManualApprovalStep("approval"));

    const prodStage = demoCICDPipline.addStage(
      new PipelineAppStage(this, "prod")
    );
  }
}
