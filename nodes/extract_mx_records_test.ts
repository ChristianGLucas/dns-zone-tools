import { ZoneFileInput } from '../gen/messages_pb';
import { extractMxRecords } from './extract_mx_records';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractMxRecords', () => {
  it('sorts MX records ascending by preference, even though the fixture lists them out of order', () => {
    // SAMPLE_ZONE deliberately lists MX 20 (mail2) before MX 10 (mail1) in
    // the source text, so this proves the node actually sorts rather than
    // just passing through parse order.
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractMxRecords(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(2);
    expect(result.getRecordsList()[0].getPreference()).toBe(10);
    expect(result.getRecordsList()[0].getHost()).toBe('mail1.example.com.');
    expect(result.getRecordsList()[1].getPreference()).toBe(20);
    expect(result.getRecordsList()[1].getHost()).toBe('mail2.example.com.');
  });

  it('returns an empty list (not an error) for a zone with no MX records', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA ns1.example.com. admin.example.com. (1 2 3 4 5)\n@ IN NS ns1.example.com.\n');
    const result = extractMxRecords(testContext, input);
    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(0);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractMxRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
