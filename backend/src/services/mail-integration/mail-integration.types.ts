// Daten-Model — siehe docs/specs/spec-backend.md, Abschnitt 3
// Generische Roh-Mail-Daten; providerunabhängig, kein PayPal-spezifisches Parsing hier
// (das übernimmt der Payment-Matching-Service, Abschnitt 6).

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
