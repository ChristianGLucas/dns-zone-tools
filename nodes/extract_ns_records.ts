import { ZoneFileInput, NsRecordList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, mapNs } from './helpers';

/**
 * Parse a zone file and return every NS (nameserver) record. A malformed
 * zone file returns a structured error.
 */
export function extractNsRecords(ax: AxiomContext, input: ZoneFileInput): NsRecordList {
  const result = new NsRecordList();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  result.setRecordsList((outcome.raw.ns ?? []).map(mapNs));
  return result;
}
