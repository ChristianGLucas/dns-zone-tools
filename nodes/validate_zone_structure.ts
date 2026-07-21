import { ZoneFileInput, ZoneValidationResult, ZoneIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse } from './helpers';

function issue(code: string, message: string): ZoneIssue {
  const i = new ZoneIssue();
  i.setCode(code);
  i.setMessage(message);
  return i;
}

/**
 * Parse a zone file and check basic structural correctness: does it have an
 * SOA record, does it have at least one NS record, and is the SOA serial a
 * valid (finite) number. Returns is_valid plus a list of specific issues
 * found (e.g. "MISSING_SOA", "MISSING_NS", "NON_NUMERIC_SERIAL") — this is
 * a structural sanity check, not full RFC1035 conformance validation. A
 * zone file the parser cannot process at all returns a structured error
 * instead.
 */
export function validateZoneStructure(ax: AxiomContext, input: ZoneFileInput): ZoneValidationResult {
  const result = new ZoneValidationResult();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;
  const issues: ZoneIssue[] = [];

  const hasSoa = !!raw.soa;
  if (!hasSoa) {
    issues.push(issue('MISSING_SOA', 'Zone file has no SOA record.'));
  }

  const hasNs = (raw.ns?.length ?? 0) > 0;
  if (!hasNs) {
    issues.push(issue('MISSING_NS', 'Zone file has no NS records.'));
  }

  const serialIsNumeric = hasSoa && Number.isFinite(raw.soa!.serial);
  if (hasSoa && !serialIsNumeric) {
    issues.push(issue('NON_NUMERIC_SERIAL', 'SOA serial is missing or not a valid number.'));
  }

  if (hasSoa) {
    const soa = raw.soa!;
    if (!soa.mname) {
      issues.push(issue('MISSING_MNAME', 'SOA record has no primary nameserver (mname).'));
    }
    if (!soa.rname) {
      issues.push(issue('MISSING_RNAME', 'SOA record has no admin mailbox (rname).'));
    }
  }

  result.setHasSoa(hasSoa);
  result.setHasNs(hasNs);
  result.setSerialIsNumeric(serialIsNumeric);
  result.setIssuesList(issues);
  result.setIsValid(issues.length === 0);
  return result;
}
