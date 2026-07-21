import { ZoneFileInput } from '../gen/messages_pb';
import { extractDirectives } from './extract_directives';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractDirectives', () => {
  it('returns $ORIGIN and $TTL exactly as authored', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractDirectives(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getHasOrigin()).toBe(true);
    expect(result.getOrigin()).toBe('example.com.');
    expect(result.getHasTtl()).toBe(true);
    expect(result.getTtl()).toBe(3600);
  });

  it('reports has_origin/has_ttl false, not zero values, when directives are absent', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA ns1.example.com. admin.example.com. (1 2 3 4 5)\n@ IN NS ns1.example.com.\n');
    const result = extractDirectives(testContext, input);
    expect(result.hasError()).toBe(false);
    expect(result.getHasOrigin()).toBe(false);
    expect(result.getHasTtl()).toBe(false);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractDirectives(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
