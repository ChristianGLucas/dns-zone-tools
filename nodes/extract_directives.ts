import { ZoneFileInput, ZoneDirectives } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse } from './helpers';

/**
 * Parse a zone file and return just its $ORIGIN and $TTL directive values,
 * with has_origin/has_ttl flags distinguishing "absent" from a legitimate
 * empty/zero value. A malformed zone file returns a structured error.
 */
export function extractDirectives(ax: AxiomContext, input: ZoneFileInput): ZoneDirectives {
  const result = new ZoneDirectives();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;
  if (typeof raw.$origin === 'string') {
    result.setOrigin(raw.$origin);
    result.setHasOrigin(true);
  }
  if (typeof raw.$ttl === 'string' && raw.$ttl.trim() !== '') {
    const ttlNum = Number(raw.$ttl);
    if (Number.isFinite(ttlNum)) {
      result.setTtl(ttlNum);
      result.setHasTtl(true);
    }
  }
  return result;
}
