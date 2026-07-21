import { ZoneFileInput } from '../gen/messages_pb';
import { extractNsRecords } from './extract_ns_records';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractNsRecords', () => {
  it('returns every NS record from the fixture', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractNsRecords(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(2);
    expect(result.getRecordsList().map((r) => r.getHost())).toEqual(['ns1.example.com.', 'ns2.example.com.']);
    expect(result.getRecordsList().every((r) => r.getName() === '@')).toBe(true);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractNsRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
