// region Types
/**
 * 
 */
export interface CloudMailInWebhookEvent {
    headers: Headers
    envelope: Envelope
    plain: string
    html: string
    reply_plain: string
    attachments: any[]
    authKey?: string
}

export interface Headers {
    received: string
    date: string
    from: string
    to: string
    message_id: string
    in_reply_to: string
    references: string
    subject: string
    mime_version: string
    content_type: string
    dkim_signature: string
    x_google_dkim_signature: string
    x_gm_message_state: string
    x_google_smtp_source: string
    x_received: string
}

export interface Envelope {
    to: string
    recipients: string[]
    from: string
    helo_domain: string
    remote_ip: string
    tls: boolean
    tls_cipher: string
    md5: string
    spf: Spf
}

export interface Spf {
    result: string
    domain: string
}




// endregion 
