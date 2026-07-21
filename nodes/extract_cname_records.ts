import { ZoneFileInput, CnameRecordList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, mapCname } from './helpers';

/**
 * Parse a zone file and return every CNAME record as alias -> target pairs.
 * A malformed zone file returns a structured error.
 */
export function extractCnameRecords(ax: AxiomContext, input: ZoneFileInput): CnameRecordList {
  const result = new CnameRecordList();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  result.setRecordsList((outcome.raw.cname ?? []).map(mapCname));
  return result;
}
