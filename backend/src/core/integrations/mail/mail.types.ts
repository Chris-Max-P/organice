// Data model — see docs/specs/dashboard-backend.md, "Mail integration"
// Generic raw mail data; provider-independent, no PayPal-specific parsing here
// (that is done by the payment matching service, section 6).

export interface MailSearchCriteria {
  from?: string;
  subject?: string;
  since?: Date;
}

export interface MailMessage {
  from: string;
  subject: string;
  date: Date;
  html: string;
  text: string;
}
