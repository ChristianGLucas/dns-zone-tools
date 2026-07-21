import { ZoneFileInput } from '../gen/messages_pb';
import { extractTxtRecords } from './extract_txt_records';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ExtractTxtRecords', () => {
  it('returns every TXT record with surrounding quotes stripped', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = extractTxtRecords(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(4);
    const spfRecord = result.getRecordsList().find((r) => r.getName() === '@');
    expect(spfRecord!.getText()).toBe('v=spf1 include:_spf.example.com ~all');
    // Quotes must be stripped, not left as literal characters.
    expect(spfRecord!.getText().startsWith('"')).toBe(false);
  });

  it('cleanly concatenates a multi-segment TXT record (RFC 1035 allows more than one quoted character-string per record)', () => {
    // Regression test: a naive "strip one outer quote pair" implementation
    // leaves stray literal quote characters embedded mid-string for a
    // realistic multi-segment TXT value (e.g. a long DKIM key split across
    // multiple 255-byte quoted segments) — this must come back as a clean
    // concatenation instead.
    const input = new ZoneFileInput();
    input.setZoneText(
      '@ IN SOA ns1.example.com. admin.example.com. (1 2 3 4 5)\n@ IN NS ns1.example.com.\nfoo IN TXT "part1" "part2"\n'
    );
    const result = extractTxtRecords(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(1);
    expect(result.getRecordsList()[0].getText()).toBe('part1part2');
    expect(result.getRecordsList()[0].getText()).not.toContain('"');
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractTxtRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
