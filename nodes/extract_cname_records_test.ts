import { ZoneFileInput } from '../gen/messages_pb';
import { extractCnameRecords } from './extract_cname_records';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractCnameRecords', () => {
  it('returns alias -> target for every CNAME record', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractCnameRecords(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(1);
    expect(result.getRecordsList()[0].getName()).toBe('blog');
    expect(result.getRecordsList()[0].getTarget()).toBe('www.example.com.');
  });

  it('returns an empty list for a zone with no CNAME records', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA ns1.example.com. admin.example.com. (1 2 3 4 5)\n@ IN NS ns1.example.com.\n');
    const result = extractCnameRecords(testContext, input);
    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(0);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractCnameRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
