import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';

export class PublicSnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'SampleTopic', {
      displayName: 'sample-sns-topic',
    });

    const topicPolicy = new sns.TopicPolicy(this, 'TopicPolicy', {
      topics: [topic],
    });

    topicPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['SNS:Publish', 'SNS:RemovePermission', 'SNS:SetTopicAttributes', 'SNS:DeleteTopic', 'SNS:ListSubscriptionsByTopic', 'SNS:GetTopicAttributes', 'SNS:AddPermission', 'SNS:Subscribe'],
        resources: [topic.topicArn],
        conditions: { StringEquals: { 'AWS:SourceAccount': this.account } },
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['SNS:Publish'],
        resources: [topic.topicArn],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['SNS:Subscribe'],
        resources: [topic.topicArn],
      })
    );
  }
}
