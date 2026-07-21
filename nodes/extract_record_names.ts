import { ZoneFileInput, RecordNames } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse } from './helpers';

/**
 * Parse a zone file and return every distinct record owner name and
 * referenced host declared anywhere in it (the SOA name, every record's own
 * name, plus the target/host/alias field of NS/CNAME/MX/SRV/PTR records) —
 * deduplicated, in first-seen order. A malformed zone file returns a
 * structured error.
 */
export function extractRecordNames(ax: AxiomContext, input: ZoneFileInput): RecordNames {
  const result = new RecordNames();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;

  const seen = new Set<string>();
  const names: string[] = [];
  const add = (n: string | undefined) => {
    if (n && !seen.has(n)) {
      seen.add(n);
      names.push(n);
    }
  };

  add(raw.soa?.name);
  (raw.ns ?? []).forEach((r) => {
    add(r.name);
    add(r.host);
  });
  (raw.a ?? []).forEach((r) => add(r.name));
  (raw.aaaa ?? []).forEach((r) => add(r.name));
  (raw.cname ?? []).forEach((r) => {
    add(r.name);
    add(r.alias);
  });
  (raw.mx ?? []).forEach((r) => {
    add(r.name);
    add(r.host);
  });
  (raw.txt ?? []).forEach((r) => add(r.name));
  (raw.spf ?? []).forEach((r) => add(r.name));
  (raw.ptr ?? []).forEach((r) => {
    add(r.name);
    add(r.host);
  });
  (raw.srv ?? []).forEach((r) => {
    add(r.name);
    add(r.target);
  });
  (raw.caa ?? []).forEach((r) => add(r.name));
  (raw.ds ?? []).forEach((r) => add(r.name));

  result.setNamesList(names);
  return result;
}
