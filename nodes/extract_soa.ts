import { ZoneFileInput, SoaRecord } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, isWellFormedSoa, mapSoa, makeError } from './helpers';

/**
 * Parse a zone file and return just its SOA (Start of Authority) record:
 * primary nameserver (mname), admin mailbox (rname, DNS-encoded), serial,
 * and the refresh/retry/expire/minimum timers. Returns a structured error
 * if the zone file has no SOA record or is malformed.
 */
export function extractSoa(ax: AxiomContext, input: ZoneFileInput): SoaRecord {
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    const msg = new SoaRecord();
    msg.setError(outcome.error);
    return msg;
  }
  if (!isWellFormedSoa(outcome.raw.soa)) {
    const msg = new SoaRecord();
    msg.setError(makeError('NO_SOA_RECORD', 'Zone file has no valid SOA record.'));
    return msg;
  }
  return mapSoa(outcome.raw.soa);
}
