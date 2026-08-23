// Google-Integration-Service — siehe docs/specs/spec-backend.md, Abschnitt 2

import { config } from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import { SheetTable } from './google-integration.types.js';

config({ path: 'envs/.env.local' });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export class GoogleIntegrationService {
  async fetchSheetData(): Promise<SheetTable> {
    const spreadsheetId = process.env.SHEET_ID;
    const range = process.env.SHEET_NAME;
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
    if (!spreadsheetId || !range || !keyFile) {
      throw new Error(
        'SHEET_ID, SHEET_NAME oder GOOGLE_SERVICE_ACCOUNT_KEY_FILE ist nicht gesetzt',
      );
    }

    const auth = new GoogleAuth({ keyFile, scopes: SCOPES });
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) {
      throw new Error('Kein Access-Token für den Service Account erhalten');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(
        `Google-Sheet-Abruf fehlgeschlagen: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { values?: string[][] };
    const [headers, ...dataRows] = data.values ?? [];
    if (!headers) {
      throw new Error('Google-Sheet ist leer');
    }

    return {
      headers,
      rows: dataRows.map((row) =>
        Object.fromEntries(headers.map((header, i) => [header, row[i] ?? ''])),
      ),
    };
  }
}
