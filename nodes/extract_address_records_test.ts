import { ExtractAddressRecordsInput } from '../gen/messages_pb';
import { extractAddressRecords } from './extract_address_records';
import { testContext, SAMPLE_ZONE } from './testctx';

function makeInput(zoneText: string, versionFilter: number): ExtractAddressRecordsInput {
  const input = new ExtractAddressRecordsInput();
  input.setZoneText(zoneText);
  input.setVersionFilter(versionFilter);
  return input;
}

describe('ExtractAddressRecords', () => {
  it('returns both A and AAAA records by default (version_filter 0)', () => {
    const result = extractAddressRecords(testContext, makeInput(SAMPLE_ZONE, 0));
    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(4); // 3 A + 1 AAAA
    const v4 = result.getRecordsList().filter((r) => r.getVersion() === 4);
    const v6 = result.getRecordsList().filter((r) => r.getVersion() === 6);
    expect(v4).toHaveLength(3);
    expect(v6).toHaveLength(1);
    expect(v6[0].getAddress()).toBe('2001:db8::10');
    expect(v6[0].getName()).toBe('www');
  });

  it('filters to A-only when version_filter=4', () => {
    const result = extractAddressRecords(testContext, makeInput(SAMPLE_ZONE, 4));
    expect(result.getRecordsList()).toHaveLength(3);
    expect(result.getRecordsList().every((r) => r.getVersion() === 4)).toBe(true);
  });

  it('filters to AAAA-only when version_filter=6', () => {
    const result = extractAddressRecords(testContext, makeInput(SAMPLE_ZONE, 6));
    expect(result.getRecordsList()).toHaveLength(1);
    expect(result.getRecordsList()[0].getVersion()).toBe(6);
  });

  it('returns a structured error for an invalid version_filter', () => {
    const result = extractAddressRecords(testContext, makeInput(SAMPLE_ZONE, 5));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('INVALID_VERSION_FILTER');
  });

  it('returns a structured error for empty zone_text', () => {
    const result = extractAddressRecords(testContext, makeInput('', 0));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
