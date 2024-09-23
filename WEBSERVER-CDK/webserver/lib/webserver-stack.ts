import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { readFileSync } from "fs";

export class WebserverStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //VPC and Subnets
    const demoVpc = new ec2.Vpc(this, "demoVPC", {
      vpcName: "demoVPC",
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      natGateways: 0,
    });

    const demoSG = new ec2.SecurityGroup(this, "demoSG", {
      vpc: demoVpc,
      securityGroupName: "allow http traffic",
      allowAllOutbound: true,
    });

    demoSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "allow http traffic"
    );

    //EC2 Instance
    // const demoEC2 = new ec2.Instance(this, "demoEC2", {
    //   vpc: demoVpc,
    //   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.T2,
    //     ec2.InstanceSize.MICRO
    //   ),
    //   securityGroup: demoSG,
    //   machineImage: ec2.MachineImage.latestAmazonLinux2(),
    //   keyName: "demo_keyname",
    // });

    // const userData = readFileSync("./lib/userData.sh", "utf8");
    // demoEC2.addUserData(userData);
  }
}
