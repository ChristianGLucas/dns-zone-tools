import { ExtractAddressRecordsInput, AddressRecordList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, makeError, mapAddress } from './helpers';

/**
 * Parse a zone file and return every A and/or AAAA record as name -> address
 * pairs, each tagged with its IP version (4 or 6). version_filter narrows
 * to just A (4) or just AAAA (6) records; 0 (the default) returns both. A
 * malformed zone file returns a structured error.
 */
export function extractAddressRecords(ax: AxiomContext, input: ExtractAddressRecordsInput): AddressRecordList {
  const result = new AddressRecordList();
  const filter = input.getVersionFilter();
  if (filter !== 0 && filter !== 4 && filter !== 6) {
    result.setError(makeError('INVALID_VERSION_FILTER', 'version_filter must be 0, 4, or 6.'));
    return result;
  }

  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;

  const records = [
    ...(filter === 6 ? [] : (raw.a ?? []).map((r) => mapAddress(r, 4))),
    ...(filter === 4 ? [] : (raw.aaaa ?? []).map((r) => mapAddress(r, 6))),
  ];
  result.setRecordsList(records);
  return result;
}
