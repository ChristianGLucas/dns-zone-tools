import { ZoneFileInput } from '../gen/messages_pb';
import { validateZoneStructure } from './validate_zone_structure';
import { testContext, SAMPLE_ZONE, SOA_LESS_ZONE } from './testctx';

describe('ValidateZoneStructure', () => {
  it('reports a well-formed zone as valid with no issues', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = validateZoneStructure(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getHasSoa()).toBe(true);
    expect(result.getHasNs()).toBe(true);
    expect(result.getSerialIsNumeric()).toBe(true);
    expect(result.getIsValid()).toBe(true);
    expect(result.getIssuesList()).toHaveLength(0);
  });

  it('flags a zone missing SOA and NS records, with specific issue codes', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SOA_LESS_ZONE);
    const result = validateZoneStructure(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getHasSoa()).toBe(false);
    expect(result.getHasNs()).toBe(false);
    expect(result.getIsValid()).toBe(false);
    const codes = result.getIssuesList().map((i) => i.getCode());
    expect(codes).toContain('MISSING_SOA');
    expect(codes).toContain('MISSING_NS');
  });

  it('flags a non-numeric/truncated SOA serial specifically', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA\n@ IN NS ns1.example.com.\n');
    const result = validateZoneStructure(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getHasSoa()).toBe(true); // an SOA record IS present, just malformed
    expect(result.getSerialIsNumeric()).toBe(false);
    expect(result.getIsValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('NON_NUMERIC_SERIAL');
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = validateZoneStructure(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
