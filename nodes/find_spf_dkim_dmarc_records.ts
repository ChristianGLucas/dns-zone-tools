import { ZoneFileInput, SpfDkimDmarcRecords, TxtRecord } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, mapTxt } from './helpers';

function startsWithCI(text: string, prefix: string): boolean {
  return text.toLowerCase().startsWith(prefix.toLowerCase());
}

function nameContainsCI(name: string, needle: string): boolean {
  return name.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Parse a zone file and classify its TXT (and SPF-typed) records into SPF
 * (text starts with "v=spf1"), DKIM (owner name contains "_domainkey" and
 * text starts with "v=DKIM1"), and DMARC (owner name is/starts with
 * "_dmarc" and text starts with "v=DMARC1") buckets, by pure case-
 * insensitive marker-prefix string matching. This identifies which records
 * are SPF/DKIM/DMARC records — it does not validate the SPF/DKIM/DMARC
 * policy syntax itself. A malformed zone file returns a structured error.
 */
export function findSpfDkimDmarcRecords(ax: AxiomContext, input: ZoneFileInput): SpfDkimDmarcRecords {
  const result = new SpfDkimDmarcRecords();
  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;

  const allTxt: TxtRecord[] = [...(raw.txt ?? []).map(mapTxt), ...(raw.spf ?? []).map(mapTxt)];

  const spf: TxtRecord[] = [];
  const dkim: TxtRecord[] = [];
  const dmarc: TxtRecord[] = [];

  for (const rec of allTxt) {
    const text = rec.getText();
    const name = rec.getName();
    if (startsWithCI(text, 'v=spf1')) {
      spf.push(rec);
    }
    if (nameContainsCI(name, '_domainkey') && startsWithCI(text, 'v=DKIM1')) {
      dkim.push(rec);
    }
    if ((name === '_dmarc' || nameContainsCI(name, '_dmarc.') || startsWithCI(name, '_dmarc')) && startsWithCI(text, 'v=DMARC1')) {
      dmarc.push(rec);
    }
  }

  result.setSpfList(spf);
  result.setDkimList(dkim);
  result.setDmarcList(dmarc);
  return result;
}
