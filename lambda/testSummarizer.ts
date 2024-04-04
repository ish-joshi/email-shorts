import { Email, EmailSummarizer, EmailSummary } from "./ai";

export class TestSummarizer implements EmailSummarizer {
    async summarize(email: Email): Promise<EmailSummary> {
        return {
            category: "informational",
            summary: "Test summary",
            sender: email.from,
            sentiment: "neutral",
            senderName: "Test Sender",
            senderEmail: "test@email.com",
            actionChips: [{ text: "Developer GitHub", link: "https://github.com/ish-joshi" }]
        }
    }
}