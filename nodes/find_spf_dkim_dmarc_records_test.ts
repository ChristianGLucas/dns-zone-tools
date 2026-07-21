import { ZoneFileInput } from '../gen/messages_pb';
import { findSpfDkimDmarcRecords } from './find_spf_dkim_dmarc_records';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('FindSpfDkimDmarcRecords', () => {
  it('classifies SPF, DKIM, and DMARC TXT records by marker prefix, excluding a plain TXT record', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = findSpfDkimDmarcRecords(testContext, input);

    expect(result.hasError()).toBe(false);

    expect(result.getSpfList()).toHaveLength(1);
    expect(result.getSpfList()[0].getName()).toBe('@');
    expect(result.getSpfList()[0].getText()).toContain('v=spf1');

    expect(result.getDkimList()).toHaveLength(1);
    expect(result.getDkimList()[0].getName()).toBe('selector1._domainkey');
    expect(result.getDkimList()[0].getText()).toContain('v=DKIM1');

    expect(result.getDmarcList()).toHaveLength(1);
    expect(result.getDmarcList()[0].getName()).toBe('_dmarc');
    expect(result.getDmarcList()[0].getText()).toContain('v=DMARC1');

    // The plain "just some plain text" TXT record must not appear in any bucket.
    const allClassified = [...result.getSpfList(), ...result.getDkimList(), ...result.getDmarcList()];
    expect(allClassified.some((r) => r.getName() === 'other')).toBe(false);
  });

  it('does not misclassify a TXT record with the right owner name but no version marker', () => {
    const input = new ZoneFileInput();
    input.setZoneText('@ IN SOA ns1.example.com. admin.example.com. (1 2 3 4 5)\n@ IN NS ns1.example.com.\n_dmarc IN TXT "not a real dmarc record"\n');
    const result = findSpfDkimDmarcRecords(testContext, input);
    expect(result.getDmarcList()).toHaveLength(0);
  });

  it('returns a structured error for empty zone_text', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = findSpfDkimDmarcRecords(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });
});
