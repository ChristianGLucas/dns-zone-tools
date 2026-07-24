import { ZoneFileInput, ZoneFile } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, buildZoneFile } from './helpers';

/**
 * Parse a full BIND/RFC1035 zone file into a structured record set grouped
 * by type (SOA, NS, A, AAAA, CNAME, MX, TXT, SPF, PTR, SRV, CAA, DS) plus
 * the $ORIGIN/$TTL directives. A zone file the parser cannot make sense of
 * returns a structured error instead of a crash.
 */
export function parseZoneFile(ax: AxiomContext, input: ZoneFileInput): ZoneFile {
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    const zf = new ZoneFile();
    zf.setError(outcome.error);
    return zf;
  }
  return buildZoneFile(outcome.raw);
}
