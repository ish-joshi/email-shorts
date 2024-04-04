import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// nodejs lambda function
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');


export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    const emailSummaryTable = new dynamodb.Table(this, 'EmailSummaries', {
      partitionKey: { name: 'messageId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a lambda function
    const emailHandlerLambda = new nodeLambda.NodejsFunction(this, 'emailHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda', 'emailHandler.ts'),
      bundling: {
        minify: true,
      },
      timeout: cdk.Duration.seconds(30),
      environment: {
        EMAIL_SUMMARY_TABLE: emailSummaryTable.tableName,
      },
    });

    const emailHandlerHTTPHandler = emailHandlerLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      },
    });

    // Grant the lambda function read/write permissions to the dynamoDB table
    emailSummaryTable.grantWriteData(emailHandlerLambda);

    // Create a lambda function
    const summaryHandlerLambda = new nodeLambda.NodejsFunction(this, 'summaryHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda', 'getSummaryHandler.ts'),
      bundling: {
        minify: true,
      },
      timeout: cdk.Duration.seconds(30),
      environment: {
        EMAIL_SUMMARY_TABLE: emailSummaryTable.tableName,
      },
    });

    const summaryHTTPHandler = summaryHandlerLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      },
    });

    // Grant the lambda function read/write permissions to the dynamoDB table
    emailSummaryTable.grantReadData(summaryHandlerLambda);

    // Relevant outputs
    new cdk.CfnOutput(this, 'emailHandlerFunctionURL', {
      value: emailHandlerHTTPHandler.url,
    });

    new cdk.CfnOutput(this, 'summaryHandlerFunctionURL', {
      value: summaryHTTPHandler.url,
    });

    new cdk.CfnOutput(this, 'emailSummaryTable', {
      value: emailSummaryTable.tableName,
    });


  }
}
