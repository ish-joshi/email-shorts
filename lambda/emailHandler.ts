import * as AWS from 'aws-sdk';
import { Context, LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda';
import { EmailSummarizer, EmailSummary } from './ai';
import { DynamoDBEntry } from './types';
import { CloudMailInWebhookEvent } from './cloudMailIn.types';
import { TestSummarizer } from './testSummarizer';


let emailSummarizer: EmailSummarizer = new TestSummarizer();


export const handler = async (event: LambdaFunctionURLEvent, context: Context): Promise<LambdaFunctionURLResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    console.log(`🚀 Log the whole email`)

    // Only allow POST method
    const method = event.requestContext.http.method;
    console.log(`Method: ${method}`);

    if (method.toLowerCase() !== 'post') {
        return {
            statusCode: 400, // Bad request
            body: JSON.stringify({
                message: `This should not be used with ${method} method.`,
            }),
        };
    }

    // Must include a body and parse the body
    const body = event.body
    console.log(JSON.stringify(body, null, 2));

    if (!body) {
        return {
            statusCode: 400, // Bad request
            body: JSON.stringify({
                message: `No body found.`,
            }),
        };
    }

    let emailEvent: CloudMailInWebhookEvent;
    try {
        emailEvent = JSON.parse(body) as CloudMailInWebhookEvent;
    } catch (error) {
        return {
            statusCode: 400, // Bad request
            body: JSON.stringify({
                message: `Invalid body format.`,
            }),
        };
    }


    // Check for auth key
    if ((!emailEvent.authKey || emailEvent.authKey !== process.env.CLOUDMAILIN_AUTH_KEY) &&
        !process.env.LOCALSTACK_HOSTNAME) { // run locally on localstack
        return {
            statusCode: 401, // Unauthorized
            body: JSON.stringify({
                message: `Unauthorized`,
            }),
        };
    }

    console.log(`🚀 email web-hook event`)
    console.log(emailEvent)


    const senderEmail = emailEvent.headers.from;
    const subject = emailEvent.headers.subject;
    const date = emailEvent.headers.date;
    const messageId = emailEvent.headers.message_id;
    const emailBody = emailEvent.plain;
    const htmlEmailBody = emailEvent.html;

    console.log(`Sender Email: ${senderEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Date: ${date}`);
    console.log(`Message ID: ${messageId}`);
    console.log(`Email Body: ${emailBody}`);

    let summary: EmailSummary;
    try {
        summary = await emailSummarizer.summarize({
            from: senderEmail,
            time: date,
            subject: subject,
            body: emailBody,
            htmlBody: htmlEmailBody
        });
    } catch (error) {
        console.log(`❌ Error summarizing email: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `❌ Error summarizing email: ${error}`,
            }),
        };
    }

    console.log(`✨ Summary: ${JSON.stringify(summary, null, 2)}`);


    // Add to DynamoDB
    const ddbEntry: DynamoDBEntry = {
        accountEmail: senderEmail,
        messageId: messageId,
        subject: subject,
        date: date,
        emailBody: emailBody,
        htmlEmailBody: htmlEmailBody,
        summary: summary
    };

    console.log(`📀 DynamoDB Entry: ${JSON.stringify(ddbEntry, null, 2)}`);

    const dynamoDB = new AWS.DynamoDB.DocumentClient({
        // endpoint for localstack
        endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined
    });

    try {
        await dynamoDB.put({
            TableName: process.env.EMAIL_SUMMARY_TABLE || '',
            Item: ddbEntry
        }).promise();
    } catch (error) {
        console.log(`Error adding entry to DynamoDB: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error adding entry to DynamoDB: ${error}`,
            }),
        };
    }


    return {
        statusCode: 200,
        body: JSON.stringify({ ...ddbEntry }, null, 2),
    };
};
