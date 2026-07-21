import { ZoneFileInput, MxRecordList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, mapMx } from './helpers';

/**
 * Parse a zone file and return every MX record (mail exchange preference +
 * host), sorted ascending by preference per RFC 5321 (the lowest-numbered
 * preference is the most-preferred exchange). A malformed zone file returns
 * a structured error.
 */
export function extractMxRecords(ax: AxiomContext, input: ZoneFileInput): MxRecordList {
  const result = new MxRecordList();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const records = (outcome.raw.mx ?? [])
    .slice()
    .sort((a, b) => (a.preference ?? 0) - (b.preference ?? 0))
    .map(mapMx);
  result.setRecordsList(records);
  return result;
}
