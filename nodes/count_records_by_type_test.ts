import { ZoneFileInput } from '../gen/messages_pb';
import { countRecordsByType } from './count_records_by_type';
import { testContext, SAMPLE_ZONE } from './testctx';

function countFor(result: ReturnType<typeof countRecordsByType>, type: string): number {
  return result.getCountsByTypeList().find((c) => c.getRecordType() === type)?.getCount() ?? -1;
}

describe('CountRecordsByType', () => {
  it('counts every type correctly and totals them (hand-computed against the fixture)', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = countRecordsByType(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(countFor(result, 'SOA')).toBe(1);
    expect(countFor(result, 'NS')).toBe(2);
    expect(countFor(result, 'A')).toBe(3);
    expect(countFor(result, 'AAAA')).toBe(1);
    expect(countFor(result, 'CNAME')).toBe(1);
    expect(countFor(result, 'MX')).toBe(2);
    expect(countFor(result, 'TXT')).toBe(4);
    expect(countFor(result, 'SRV')).toBe(1);
    expect(countFor(result, 'CAA')).toBe(1);
    expect(countFor(result, 'PTR')).toBe(0);
    expect(countFor(result, 'DS')).toBe(0);

    const expectedTotal = 1 + 2 + 3 + 1 + 1 + 2 + 4 + 1 + 1; // SOA+NS+A+AAAA+CNAME+MX+TXT+SRV+CAA
    expect(result.getTotalRecords()).toBe(expectedTotal);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = countRecordsByType(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
