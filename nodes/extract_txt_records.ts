import { ZoneFileInput, TxtRecordList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, mapTxt } from './helpers';

/**
 * Parse a zone file and return every TXT record, with any surrounding
 * quote characters from the zone-file literal stripped. For classifying
 * TXT records as SPF/DKIM/DMARC specifically, use FindSpfDkimDmarcRecords.
 * A malformed zone file returns a structured error.
 */
export function extractTxtRecords(ax: AxiomContext, input: ZoneFileInput): TxtRecordList {
  const result = new TxtRecordList();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  result.setRecordsList((outcome.raw.txt ?? []).map(mapTxt));
  return result;
}
