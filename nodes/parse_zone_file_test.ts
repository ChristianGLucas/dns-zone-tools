import { ZoneFileInput } from '../gen/messages_pb';
import { parseZoneFile } from './parse_zone_file';
import { testContext, SAMPLE_ZONE } from './testctx';

describe('ParseZoneFile', () => {
  it('parses a realistic zone into the full record set, grouped by type', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const result = parseZoneFile(testContext, input);

    expect(result.hasError()).toBe(false);
    expect(result.getOrigin()).toBe('example.com.');
    expect(result.getHasOrigin()).toBe(true);
    expect(result.getTtl()).toBe(3600);
    expect(result.getHasTtl()).toBe(true);

    expect(result.getHasSoa()).toBe(true);
    expect(result.getSoa()!.getMname()).toBe('ns1.example.com.');
    expect(result.getSoa()!.getRname()).toBe('admin.example.com.');
    expect(result.getSoa()!.getSerial()).toBe(2024031501);

    expect(result.getNsList().map((r) => r.getHost())).toEqual(['ns1.example.com.', 'ns2.example.com.']);
    expect(result.getAList().map((r) => r.getAddress())).toEqual(['192.0.2.10', '192.0.2.20', '192.0.2.21']);
    expect(result.getAaaaList().map((r) => r.getAddress())).toEqual(['2001:db8::10']);
    expect(result.getCnameList()).toHaveLength(1);
    expect(result.getCnameList()[0].getTarget()).toBe('www.example.com.');
    expect(result.getMxList()).toHaveLength(2);
    expect(result.getTxtList()).toHaveLength(4);
    expect(result.getSrvList()).toHaveLength(1);
    expect(result.getCaaList()).toHaveLength(1);
  });

  it('is deterministic — invoking twice with the same input yields the same output', () => {
    const input = new ZoneFileInput();
    input.setZoneText(SAMPLE_ZONE);
    const first = parseZoneFile(testContext, input);
    const second = parseZoneFile(testContext, input);
    expect(first.toObject()).toEqual(second.toObject());
  });

  it('returns a structured error for empty input, not a crash', () => {
    const input = new ZoneFileInput();
    input.setZoneText('');
    const result = parseZoneFile(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_INPUT');
  });

  it('returns a structured error for oversized input instead of parsing it', () => {
    const input = new ZoneFileInput();
    input.setZoneText('www IN A 192.0.2.1\n'.repeat(200_000)); // well over 2 MiB
    const result = parseZoneFile(testContext, input);
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('TOO_LARGE');
  });

  it('does not crash on garbage input — returns an empty-ish structure, not an error, when the parser finds no recognizable records', () => {
    const input = new ZoneFileInput();
    input.setZoneText('this is not a zone file at all, just prose.\nneither is this line.');
    const result = parseZoneFile(testContext, input);
    expect(result.hasError()).toBe(false);
    expect(result.getHasSoa()).toBe(false);
    expect(result.getNsList()).toHaveLength(0);
  });
});
