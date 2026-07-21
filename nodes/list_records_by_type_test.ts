import { ListRecordsByTypeInput } from '../gen/messages_pb';
import { listRecordsByType } from './list_records_by_type';
import { testContext, SAMPLE_ZONE } from './testctx';

function makeInput(zoneText: string, recordType: string): ListRecordsByTypeInput {
  const input = new ListRecordsByTypeInput();
  input.setZoneText(zoneText);
  input.setRecordType(recordType);
  return input;
}

describe('ListRecordsByType', () => {
  it('lists MX records generically, matching ExtractMxRecords data', () => {
    const result = listRecordsByType(testContext, makeInput(SAMPLE_ZONE, 'mx'));
    expect(result.hasError()).toBe(false);
    expect(result.getRecordType()).toBe('MX');
    expect(result.getRecordsList()).toHaveLength(2);
    const fields = result.getRecordsList().map((r) => r.getFieldsMap().get('host'));
    expect(fields.sort()).toEqual(['mail1.example.com.', 'mail2.example.com.']);
  });

  it('lists CAA records (a type with no dedicated extraction node)', () => {
    const result = listRecordsByType(testContext, makeInput(SAMPLE_ZONE, 'CAA'));
    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(1);
    expect(result.getRecordsList()[0].getFieldsMap().get('tag')).toBe('issue');
  });

  it('lists SRV records (another type with no dedicated node)', () => {
    const result = listRecordsByType(testContext, makeInput(SAMPLE_ZONE, 'srv'));
    expect(result.hasError()).toBe(false);
    expect(result.getRecordsList()).toHaveLength(1);
    expect(result.getRecordsList()[0].getFieldsMap().get('target')).toBe('sipserver.example.com.');
  });

  it('returns a structured error for an unrecognized record_type', () => {
    const result = listRecordsByType(testContext, makeInput(SAMPLE_ZONE, 'BOGUS'));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('UNKNOWN_RECORD_TYPE');
  });

  it('returns a structured error for empty zone_text', () => {
    const result = listRecordsByType(testContext, makeInput('', 'A'));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
