// Integrationstest — ruft das echte Google Sheet über den Service Account ab.
// Benötigt eine gültige backend/envs/.env.local mit SHEET_ID, SHEET_NAME und
// GOOGLE_SERVICE_ACCOUNT_KEY_FILE (siehe .env.local.example) sowie das dort referenzierte Keyfile.

import { describe, it, expect } from '@jest/globals';
import { GoogleIntegrationService } from './google-integration.service.js';

describe('GoogleIntegrationService (Integration)', () => {
  it('hat SHEET_ID, SHEET_NAME und GOOGLE_SERVICE_ACCOUNT_KEY_FILE im Process Environment gesetzt', () => {
    expect(process.env.SHEET_ID).toBeTruthy();
    expect(process.env.SHEET_NAME).toBeTruthy();
    expect(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE).toBeTruthy();
  });

  it('lädt Header und Zeilen vom echten Google Sheet', async () => {
    const service = new GoogleIntegrationService();

    const table = await service.fetchSheetData();

    expect(table.headers.length).toBeGreaterThan(0);
    expect(Array.isArray(table.rows)).toBe(true);
  });
});
