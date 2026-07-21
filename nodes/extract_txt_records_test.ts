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

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = extractTxtRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
