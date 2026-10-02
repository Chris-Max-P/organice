// Unit-Test mit gemocktem IMAP-Client (kein echtes Postfach nötig) — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockConnect = jest.fn<() => Promise<void>>();
const mockLogout = jest.fn<() => Promise<void>>();
const mockMailboxOpen = jest.fn<(path: string) => Promise<unknown>>();
const mockSearch = jest.fn<(query: unknown) => Promise<number[]>>();
const mockFetch = jest.fn<(range: unknown, options: unknown) => AsyncGenerator<{ source: Buffer }>>();

jest.unstable_mockModule('imapflow', () => ({
  ImapFlow: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    logout: mockLogout,
    mailboxOpen: mockMailboxOpen,
    search: mockSearch,
    fetch: mockFetch,
  })),
}));

const mockSimpleParser = jest.fn<(source: Buffer) => Promise<Record<string, unknown>>>();

jest.unstable_mockModule('mailparser', () => ({
  simpleParser: mockSimpleParser,
}));

const { MailIntegrationService } = await import('./mail-integration.service.js');

async function* fakeMessages(sources: string[]) {
  for (const source of sources) {
    yield { source: Buffer.from(source) };
  }
}

describe('MailIntegrationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MAIL_USER = 'user@example.com';
    process.env.MAIL_PASSWORD = 'secret';
    process.env.MAIL_HOST = 'imap.example.com';
    process.env.MAIL_PORT = '993';
    process.env.MAIL_SECURE = 'true';

    mockConnect.mockResolvedValue(undefined);
    mockLogout.mockResolvedValue(undefined);
    mockMailboxOpen.mockResolvedValue(undefined);
    mockSearch.mockResolvedValue([1]);
    mockFetch.mockReturnValue(fakeMessages(['raw-mail-1']));
    mockSimpleParser.mockResolvedValue({
      from: { text: 'someone@example.com' },
      subject: 'Betreff',
      date: new Date('2026-01-01'),
      html: '<p>Body</p>',
      text: 'Body',
    });
  });

  it('wirft Fehler, wenn MAIL_USER, MAIL_PASSWORD, MAIL_HOST oder MAIL_PORT nicht gesetzt sind', async () => {
    delete process.env.MAIL_HOST;
    const service = new MailIntegrationService();

    await expect(service.searchMails({})).rejects.toThrow(/MAIL_/);
  });

  it('öffnet INBOX und sucht mit den übergebenen Kriterien', async () => {
    const service = new MailIntegrationService();
    const since = new Date('2026-01-01');

    await service.searchMails({ from: 'service@paypal.de', subject: 'Zahlung erhalten', since });

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockMailboxOpen).toHaveBeenCalledWith('INBOX');
    expect(mockSearch).toHaveBeenCalledWith({
      from: 'service@paypal.de',
      subject: 'Zahlung erhalten',
      since,
    });
  });

  it('parst gefundene Rohnachrichten zu MailMessage-Objekten', async () => {
    mockSimpleParser.mockResolvedValueOnce({
      from: { text: 'service@paypal.de' },
      subject: 'Du hast eine Zahlung erhalten',
      date: new Date('2026-01-02'),
      html: '<p>Erhaltener Betrag: 175,00 €</p>',
      text: 'Erhaltener Betrag: 175,00 €',
    });

    const service = new MailIntegrationService();
    const result = await service.searchMails({ from: 'service@paypal.de' });

    expect(mockSimpleParser).toHaveBeenCalledWith(Buffer.from('raw-mail-1'));
    expect(result).toEqual([
      {
        from: 'service@paypal.de',
        subject: 'Du hast eine Zahlung erhalten',
        date: new Date('2026-01-02'),
        html: '<p>Erhaltener Betrag: 175,00 €</p>',
        text: 'Erhaltener Betrag: 175,00 €',
      },
    ]);
  });

  it('liefert eine leere Liste, wenn nichts zum Kriterium passt', async () => {
    mockSearch.mockResolvedValueOnce([]);
    mockFetch.mockReturnValueOnce(fakeMessages([]));

    const service = new MailIntegrationService();
    const result = await service.searchMails({ subject: 'Nichts passt' });

    expect(result).toEqual([]);
  });

  it('meldet sich auch bei einem Fehler wieder ab (logout im finally)', async () => {
    mockSearch.mockRejectedValueOnce(new Error('Suche fehlgeschlagen'));

    const service = new MailIntegrationService();

    await expect(service.searchMails({})).rejects.toThrow('Suche fehlgeschlagen');
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('wirft einen Fehler, wenn die Verbindung zum Postfach fehlschlägt', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connection refused'));

    const service = new MailIntegrationService();

    await expect(service.searchMails({})).rejects.toThrow('connection refused');
  });

  it('testConnection verbindet sich und meldet sich wieder ab, ohne INBOX zu öffnen oder zu suchen', async () => {
    const service = new MailIntegrationService();

    await service.testConnection();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockMailboxOpen).not.toHaveBeenCalled();
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
