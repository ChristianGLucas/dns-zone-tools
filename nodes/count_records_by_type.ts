import { ZoneFileInput, ZoneSummary, RecordTypeCount } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, isWellFormedSoa } from './helpers';

function count(type: string, n: number): RecordTypeCount {
  const c = new RecordTypeCount();
  c.setRecordType(type);
  c.setCount(n);
  return c;
}

/**
 * Parse a zone file and return a summary count of records per type (SOA,
 * NS, A, AAAA, CNAME, MX, TXT, SPF, PTR, SRV, CAA, DS) plus the total
 * record count. A malformed zone file returns a structured error.
 */
export function countRecordsByType(ax: AxiomContext, input: ZoneFileInput): ZoneSummary {
  const result = new ZoneSummary();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;

  const soaCount = isWellFormedSoa(raw.soa) ? 1 : 0;
  const counts: Array<[string, number]> = [
    ['SOA', soaCount],
    ['NS', raw.ns?.length ?? 0],
    ['A', raw.a?.length ?? 0],
    ['AAAA', raw.aaaa?.length ?? 0],
    ['CNAME', raw.cname?.length ?? 0],
    ['MX', raw.mx?.length ?? 0],
    ['TXT', raw.txt?.length ?? 0],
    ['SPF', raw.spf?.length ?? 0],
    ['PTR', raw.ptr?.length ?? 0],
    ['SRV', raw.srv?.length ?? 0],
    ['CAA', raw.caa?.length ?? 0],
    ['DS', raw.ds?.length ?? 0],
  ];

  result.setCountsByTypeList(counts.map(([type, n]) => count(type, n)));
  result.setTotalRecords(counts.reduce((sum, [, n]) => sum + n, 0));
  return result;
}
