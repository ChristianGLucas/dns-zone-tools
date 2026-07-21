import { ZoneFileInput } from '../gen/messages_pb';
import { extractSoa } from './extract_soa';
import { testContext, SAMPLE_ZONE, SOA_LESS_ZONE } from './testctx';

describe('ExtractSoa', () => {
  it('returns the SOA record fields exactly as authored in the fixture (hand-computed oracle)', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractSoa(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getMname()).toBe('ns1.example.com.');
    expect(result.getRname()).toBe('admin.example.com.');
    expect(result.getSerial()).toBe(2024031501);
    expect(result.getRefresh()).toBe(7200);
    expect(result.getRetry()).toBe(3600);
    expect(result.getExpire()).toBe(1209600);
    expect(result.getMinimum()).toBe(3600);
  });

  it('returns a structured error when the zone has no SOA record', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SOA_LESS_ZONE);
    const result = extractSoa(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('NO_SOA_RECORD');
  });

  it('returns a structured error for a truncated/malformed SOA rather than garbage numbers', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA\n@ IN NS ns1.example.com.\n');
    const result = extractSoa(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('NO_SOA_RECORD');
  });

  it('returns a structured error for empty input', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractSoa(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
