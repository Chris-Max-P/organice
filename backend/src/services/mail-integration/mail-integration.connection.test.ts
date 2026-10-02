// Integrationstest — verbindet sich mit dem echten Postfach über die realen Zugangsdaten.
// Testet ausschließlich die Verbindung (connect + logout), keine Suche/Parsing-Funktionalität.
// Benötigt eine gültige backend/envs/.env.local mit MAIL_HOST, MAIL_PORT, MAIL_SECURE,
// MAIL_USER und MAIL_PASSWORD (siehe .env.local.example).

import { describe, it, expect } from '@jest/globals';
import { MailIntegrationService } from './mail-integration.service.js';

describe('MailIntegrationService (Integration)', () => {
  it('hat MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER und MAIL_PASSWORD im Process Environment gesetzt', () => {
    expect(process.env.MAIL_HOST).toBeTruthy();
    expect(process.env.MAIL_PORT).toBeTruthy();
    expect(process.env.MAIL_SECURE).toBeTruthy();
    expect(process.env.MAIL_USER).toBeTruthy();
    expect(process.env.MAIL_PASSWORD).toBeTruthy();
  });

  it('baut eine echte Verbindung zum Postfach auf und meldet sich wieder ab', async () => {
    const service = new MailIntegrationService();

    await expect(service.testConnection()).resolves.toBeUndefined();
  });
});
