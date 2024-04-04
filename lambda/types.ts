import { EmailSummary } from "./ai"

// create a type DynamoDBEntry
type DynamoDBEntry = {
    accountEmail: string,
    messageId: string,
    subject: string,
    date: string,
    emailBody: string,
    htmlEmailBody: string,
    summary: EmailSummary
}

export { DynamoDBEntry }