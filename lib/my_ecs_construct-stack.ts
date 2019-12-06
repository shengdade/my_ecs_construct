import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

export class MyEcsConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        cluster: cluster, // Required
        cpu: 512, // Default is 256
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample')
        },
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true // Default is false
      }
    );

    const scaling = fargateService.service.autoScaleTaskCount({
      minCapacity: 5,
      maxCapacity: 100
    });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      policyName: 'TargetCpuScaling',
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      policyName: 'TargetMemoryScaling',
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
  }
}
