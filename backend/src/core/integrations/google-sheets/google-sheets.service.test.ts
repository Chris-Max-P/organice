// Integration test — fetches the real Google Sheet via the service account.
// Requires a valid backend/envs/.env.local with SHEET_ID, SHEET_NAME and
// GOOGLE_SERVICE_ACCOUNT_KEY_FILE (see .env.local.example) plus the keyfile it references.

import { describe, it, expect } from '@jest/globals';
import { GoogleSheetsService } from './google-sheets.service.js';

describe('GoogleSheetsService (integration)', () => {
  it('has SHEET_ID, SHEET_NAME and GOOGLE_SERVICE_ACCOUNT_KEY_FILE set in the process environment', () => {
    expect(process.env.SHEET_ID).toBeTruthy();
    expect(process.env.SHEET_NAME).toBeTruthy();
    expect(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE).toBeTruthy();
  });

  it('loads headers and rows from the real Google Sheet', async () => {
    const service = new GoogleSheetsService();

    const table = await service.fetchSheetData();

    expect(table.headers.length).toBeGreaterThan(0);
    expect(Array.isArray(table.rows)).toBe(true);
  });
});
