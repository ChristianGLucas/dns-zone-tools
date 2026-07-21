import { NormalizeRecordNameInput, NormalizedRecordName } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeName, makeError } from './helpers';

/**
 * Resolve a single zone-file record name ("@", a relative label like "www",
 * or an already-FQDN name ending in ".") against a given $ORIGIN, returning
 * both its fully-qualified absolute form (fqdn, always trailing-dot-
 * terminated) and its form relative to origin. Pure string/label logic —
 * does not parse a zone file or perform any DNS lookup.
 */
export function normalizeRecordName(ax: AxiomContext, input: NormalizeRecordNameInput): NormalizedRecordName {
  const result = new NormalizedRecordName();
  const name = input.getName();
  if (name.length > 255 || input.getOrigin().length > 255) {
    result.setError(makeError('NAME_TOO_LARGE', 'name/origin must each be at most 255 characters.'));
    return result;
  }

  const outcome = normalizeName(name, input.getOrigin());
  if (outcome.ok === false) {
    result.setError(makeError(outcome.code, outcome.message));
    return result;
  }

  result.setFqdn(outcome.fqdn);
  result.setRelative(outcome.relative);
  result.setWasFqdn(outcome.wasFqdn);
  return result;
}
