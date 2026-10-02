// Integration test — connects to the real mailbox using the real credentials.
// Tests only the connection (connect + logout), no search/parsing functionality.
// Requires a valid backend/envs/.env.local with MAIL_HOST, MAIL_PORT, MAIL_SECURE,
// MAIL_USER and MAIL_PASSWORD (see .env.local.example).

import { describe, it, expect } from '@jest/globals';
import { MailService } from './mail.service.js';

describe('MailService (integration)', () => {
  it('has MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER and MAIL_PASSWORD set in the process environment', () => {
    expect(process.env.MAIL_HOST).toBeTruthy();
    expect(process.env.MAIL_PORT).toBeTruthy();
    expect(process.env.MAIL_SECURE).toBeTruthy();
    expect(process.env.MAIL_USER).toBeTruthy();
    expect(process.env.MAIL_PASSWORD).toBeTruthy();
  });

  it('opens a real connection to the mailbox and logs out again', async () => {
    const service = new MailService();

    await expect(service.testConnection()).resolves.toBeUndefined();
  });
});
