import { GenerateZoneFileInput, ZoneFile, SoaRecord, NsRecord, AddressRecord, ZoneFileInput } from '../gen/messages_pb';
import { generateZoneFile } from './generate_zone_file';
import { parseZoneFile } from './parse_zone_file';
import { testContext } from './testctx';

function buildZone(): ZoneFile {
  const zone = new ZoneFile();
  zone.setOrigin('example.org.');
  zone.setHasOrigin(true);
  zone.setTtl(7200);
  zone.setHasTtl(true);

  const soa = new SoaRecord();
  soa.setName('@');
  soa.setMname('ns1.example.org.');
  soa.setRname('admin.example.org.');
  soa.setSerial(2024090101);
  soa.setRefresh(3600);
  soa.setRetry(900);
  soa.setExpire(604800);
  soa.setMinimum(300);
  zone.setSoa(soa);
  zone.setHasSoa(true);

  const ns = new NsRecord();
  ns.setName('@');
  ns.setHost('ns1.example.org.');
  zone.setNsList([ns]);

  const a = new AddressRecord();
  a.setName('www');
  a.setAddress('203.0.113.5');
  a.setVersion(4);
  zone.setAList([a]);

  return zone;
}

describe('GenerateZoneFile', () => {
  it('generates zone text that round-trips back through ParseZoneFile to the same records', () => {
    const input = new GenerateZoneFileInput();
    input.setZone(buildZone());
    const generated = generateZoneFile(testContext, input);

    expect(generated.hasError()).toBe(false);
    expect(generated.getZoneText().length).toBeGreaterThan(0);
    // No unreplaced template placeholders should ever leak into the output.
    expect(generated.getZoneText()).not.toMatch(/\{[a-z_]+\}/);

    const reparsed = parseZoneFile(testContext, (() => {
      const zfi = new ZoneFileInput();
      zfi.setZoneText(generated.getZoneText());
      return zfi;
    })());

    expect(reparsed.hasError()).toBe(false);
    expect(reparsed.getSoa()!.getMname()).toBe('ns1.example.org.');
    expect(reparsed.getSoa()!.getSerial()).toBe(2024090101);
    expect(reparsed.getNsList()).toHaveLength(1);
    expect(reparsed.getNsList()[0].getHost()).toBe('ns1.example.org.');
    expect(reparsed.getAList()).toHaveLength(1);
    expect(reparsed.getAList()[0].getAddress()).toBe('203.0.113.5');
  });

  it('returns a structured error when the zone has no SOA record, instead of leaking template placeholders', () => {
    const zone = new ZoneFile(); // hasSoa left false
    const input = new GenerateZoneFileInput();
    input.setZone(zone);
    const result = generateZoneFile(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('MISSING_SOA');
    expect(result.getZoneText()).toBe('');
  });

  it('returns a structured error when zone itself is unset', () => {
    const input = new GenerateZoneFileInput();
    const result = generateZoneFile(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('MISSING_ZONE');
  });
});
