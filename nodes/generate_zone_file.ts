import { GenerateZoneFileInput, GenerateZoneFileOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { zoneFileToRaw, makeError } from './helpers';
import * as vendor from './vendor/dnsZonefile';

/**
 * Generate BIND/RFC1035 zone file text from a structured record set — the
 * inverse of ParseZoneFile. Parsing the generated text with ParseZoneFile
 * reproduces the same structured records (round-trip safe). A structurally
 * invalid input (e.g. no SOA record) returns a structured error instead of
 * malformed output.
 */
export function generateZoneFile(ax: AxiomContext, input: GenerateZoneFileInput): GenerateZoneFileOutput {
  const result = new GenerateZoneFileOutput();
  const zone = input.getZone();
  if (!zone) {
    result.setError(makeError('MISSING_ZONE', 'zone is required.'));
    return result;
  }

  const converted = zoneFileToRaw(zone);
  if (converted.ok === false) {
    result.setError(converted.error);
    return result;
  }

  try {
    result.setZoneText(vendor.generate(converted.raw));
  } catch (e) {
    const msg = e instanceof globalThis.Error ? e.message : String(e);
    result.setError(makeError('GENERATE_FAILED', `Could not generate zone file text: ${msg}`));
  }
  return result;
}
