// Unit test with a mocked IMAP client (no real mailbox needed) — see CLAUDE.md, step 3.

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

const { MailService } = await import('./mail.service.js');

async function* fakeMessages(sources: string[]) {
  for (const source of sources) {
    yield { source: Buffer.from(source) };
  }
}

describe('MailService', () => {
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
      subject: 'Subject',
      date: new Date('2026-01-01'),
      html: '<p>Body</p>',
      text: 'Body',
    });
  });

  it('throws when MAIL_USER, MAIL_PASSWORD, MAIL_HOST or MAIL_PORT is not set', async () => {
    delete process.env.MAIL_HOST;
    const service = new MailService();

    await expect(service.searchMails({})).rejects.toThrow(/MAIL_/);
  });

  it('opens INBOX and searches with the given criteria', async () => {
    const service = new MailService();
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

  it('parses found raw messages into MailMessage objects', async () => {
    mockSimpleParser.mockResolvedValueOnce({
      from: { text: 'service@paypal.de' },
      subject: 'Du hast eine Zahlung erhalten',
      date: new Date('2026-01-02'),
      html: '<p>Erhaltener Betrag: 175,00 €</p>',
      text: 'Erhaltener Betrag: 175,00 €',
    });

    const service = new MailService();
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

  it('returns an empty list when nothing matches the criteria', async () => {
    mockSearch.mockResolvedValueOnce([]);
    mockFetch.mockReturnValueOnce(fakeMessages([]));

    const service = new MailService();
    const result = await service.searchMails({ subject: 'Nothing matches' });

    expect(result).toEqual([]);
  });

  it('logs out even on error (logout in finally)', async () => {
    mockSearch.mockRejectedValueOnce(new Error('Search failed'));

    const service = new MailService();

    await expect(service.searchMails({})).rejects.toThrow('Search failed');
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('throws when connecting to the mailbox fails', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connection refused'));

    const service = new MailService();

    await expect(service.searchMails({})).rejects.toThrow('connection refused');
  });

  it('testConnection connects and logs out without opening INBOX or searching', async () => {
    const service = new MailService();

    await service.testConnection();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockMailboxOpen).not.toHaveBeenCalled();
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
