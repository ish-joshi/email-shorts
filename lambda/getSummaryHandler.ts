import { Context } from "aws-lambda";
import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda/trigger/lambda-function-url";


const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    // Localstack configuration
    endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined,
});

export const handler = async (event: LambdaFunctionURLEvent, context: Context): Promise<LambdaFunctionURLResult> => {

    // Method must be a get method
    const method = event.requestContext.http.method;
    if (method.toLowerCase() !== 'get') {
        return {
            statusCode: 400, // Bad request
            body: JSON.stringify({
                message: `This should not be used with ${method} method.`,
            }),
        };
    }

    // Now we create a ddbclient and scan based on email. 
    // TODO: limit to 10 items, sort by importance etc...
    const params = {
        TableName: process.env.EMAIL_SUMMARY_TABLE,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error: ${error}`,
            }),
        };

    }
}
