// Mail integration — see docs/specs/spec-backend.md, section 3

import { config } from 'dotenv';
import { ImapFlow, SearchObject } from 'imapflow';
import { simpleParser } from 'mailparser';
import { MailMessage, MailSearchCriteria } from './mail.types.js';

config({ path: 'envs/.env.local' });

export class MailService {
  private buildClient(): ImapFlow {
    const host = process.env.MAIL_HOST;
    const port = process.env.MAIL_PORT;
    const secure = process.env.MAIL_SECURE;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD;
    if (!host || !port || !secure || !user || !pass) {
      throw new Error(
        'MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER or MAIL_PASSWORD is not set',
      );
    }

    return new ImapFlow({
      host,
      port: Number(port),
      secure: secure === 'true',
      auth: { user, pass },
      logger: false,
    });
  }

  async testConnection(): Promise<void> {
    const client = this.buildClient();
    await client.connect();
    await client.logout();
  }

  async searchMails(criteria: MailSearchCriteria): Promise<MailMessage[]> {
    const client = this.buildClient();

    await client.connect();
    try {
      await client.mailboxOpen('INBOX');

      const query: SearchObject = {};
      if (criteria.from) query.from = criteria.from;
      if (criteria.subject) query.subject = criteria.subject;
      if (criteria.since) query.since = criteria.since;

      const uids = await client.search(query);
      if (!uids || uids.length === 0) {
        return [];
      }

      const messages: MailMessage[] = [];
      for await (const message of client.fetch(uids, { source: true })) {
        if (!message.source) {
          continue;
        }
        const parsed = await simpleParser(message.source);
        messages.push({
          from: parsed.from?.text ?? '',
          subject: parsed.subject ?? '',
          date: parsed.date ?? new Date(0),
          html: typeof parsed.html === 'string' ? parsed.html : '',
          text: parsed.text ?? '',
        });
      }
      return messages;
    } finally {
      await client.logout();
    }
  }
}
