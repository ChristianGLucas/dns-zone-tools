import { ZoneFileInput } from '../gen/messages_pb';
import { extractRecordNames } from './extract_record_names';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractRecordNames', () => {
  it('returns every distinct declared name/host, deduplicated, in first-seen order', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractRecordNames(testContext, input);

    expect(result.hasError()).toBe(false);
    const names = result.getNamesList();

    // No duplicates.
    expect(new Set(names).size).toBe(names.length);

    // Every name/host declared anywhere in the fixture must be present.
    for (const expected of [
      '@',
      'ns1.example.com.',
      'ns2.example.com.',
      'www',
      'mail1',
      'mail2',
      'blog',
      'www.example.com.',
      'mail1.example.com.',
      'mail2.example.com.',
      'selector1._domainkey',
      '_dmarc',
      'other',
      '_sip._tcp',
      'sipserver.example.com.',
      'host1',
    ]) {
      expect(names).toContain(expected);
    }

    // '@' (the SOA's own name) must be first, since it's added before any
    // other record is walked.
    expect(names[0]).toBe('@');
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractRecordNames(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
