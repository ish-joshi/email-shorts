
type Email = {
    from: string
    time: string
    subject: string
    body: string
    htmlBody: string
}

type ActionChip = {
    text: string
    link: string
}

type EmailSummary = {
    category: "reminder" | "promotion" | "social" | "action" | "informational";
    summary: string
    sender: string
    sentiment: "positive" | "negative" | "neutral"
    actionChips?: ActionChip[],
    todoItem?: string,
    senderName?: string,
    senderEmail?: string
}

interface EmailSummarizer {
    summarize(email: Email): Promise<EmailSummary>
}

export {
    Email,
    EmailSummary,
    EmailSummarizer
}

