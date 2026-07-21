import * as vendor from './vendor/dnsZonefile';
import {
  Error as ErrorMsg,
  SoaRecord,
  NsRecord,
  AddressRecord,
  CnameRecord,
  MxRecord,
  TxtRecord,
  PtrRecord,
  SrvRecord,
  CaaRecord,
  GenericRecord,
  ZoneFile,
} from '../gen/messages_pb';

// ---------------------------------------------------------------------------
// Shared bounds. Checked on the raw input before any parsing work.
// ---------------------------------------------------------------------------
export const MAX_ZONE_TEXT_BYTES = 2 * 1024 * 1024; // 2 MiB
export const MAX_RECORDS = 20_000;

export function makeError(code: string, message: string): ErrorMsg {
  const err = new ErrorMsg();
  err.setCode(code);
  err.setMessage(message);
  return err;
}

export type ParseOutcome = { ok: true; raw: vendor.RawZone } | { ok: false; error: ErrorMsg };

// Parse zone_text with bounds and error handling shared by every node.
export function checkedParse(zoneText: string): ParseOutcome {
  if (typeof zoneText !== 'string' || zoneText.trim().length === 0) {
    return { ok: false, error: makeError('EMPTY_INPUT', 'zone_text is empty.') };
  }
  if (Buffer.byteLength(zoneText, 'utf8') > MAX_ZONE_TEXT_BYTES) {
    return {
      ok: false,
      error: makeError('TOO_LARGE', `zone_text exceeds the ${MAX_ZONE_TEXT_BYTES}-byte limit.`),
    };
  }

  let raw: vendor.RawZone;
  try {
    raw = vendor.parse(zoneText);
  } catch (e) {
    const msg = e instanceof globalThis.Error ? e.message : String(e);
    return { ok: false, error: makeError('MALFORMED_ZONE', `Zone file could not be parsed: ${msg}`) };
  }

  const total =
    (raw.soa ? 1 : 0) +
    (raw.ns?.length ?? 0) +
    (raw.a?.length ?? 0) +
    (raw.aaaa?.length ?? 0) +
    (raw.cname?.length ?? 0) +
    (raw.mx?.length ?? 0) +
    (raw.txt?.length ?? 0) +
    (raw.spf?.length ?? 0) +
    (raw.ptr?.length ?? 0) +
    (raw.srv?.length ?? 0) +
    (raw.caa?.length ?? 0) +
    (raw.ds?.length ?? 0);
  if (total > MAX_RECORDS) {
    return {
      ok: false,
      error: makeError('TOO_MANY_RECORDS', `Zone file has ${total} records; the limit is ${MAX_RECORDS}.`),
    };
  }

  return { ok: true, raw };
}

// A raw SOA is "well-formed" (safe to surface) only when every field the
// library was supposed to fill in is actually present and, for the numeric
// fields, a finite number — the vendored parser silently leaves fields
// `undefined`/NaN on a truncated or malformed SOA record rather than
// throwing, so this is the point that turns that into a structured error.
export function isWellFormedSoa(soa: vendor.RawSoa | undefined): soa is vendor.RawSoa {
  if (!soa) return false;
  return (
    typeof soa.mname === 'string' &&
    soa.mname.length > 0 &&
    typeof soa.rname === 'string' &&
    soa.rname.length > 0 &&
    Number.isFinite(soa.serial) &&
    Number.isFinite(soa.refresh) &&
    Number.isFinite(soa.retry) &&
    Number.isFinite(soa.expire) &&
    Number.isFinite(soa.minimum)
  );
}

export function mapSoa(soa: vendor.RawSoa): SoaRecord {
  const msg = new SoaRecord();
  msg.setName(soa.name || '@');
  if (typeof soa.ttl === 'number' && Number.isFinite(soa.ttl)) {
    msg.setTtl(soa.ttl);
    msg.setHasTtl(true);
  }
  msg.setMname(soa.mname);
  msg.setRname(soa.rname);
  msg.setSerial(soa.serial);
  msg.setRefresh(soa.refresh);
  msg.setRetry(soa.retry);
  msg.setExpire(soa.expire);
  msg.setMinimum(soa.minimum);
  return msg;
}

function setTtl<T extends { setTtl(v: number): void; setHasTtl(v: boolean): void }>(
  msg: T,
  ttl: number | undefined
): void {
  if (typeof ttl === 'number' && Number.isFinite(ttl)) {
    msg.setTtl(ttl);
    msg.setHasTtl(true);
  }
}

export function mapNs(r: vendor.RawNameHostRecord): NsRecord {
  const msg = new NsRecord();
  msg.setName(r.name || '@');
  msg.setHost(r.host ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

export function mapAddress(r: vendor.RawAddressRecord, version: 4 | 6): AddressRecord {
  const msg = new AddressRecord();
  msg.setName(r.name || '@');
  msg.setAddress(r.ip ?? '');
  msg.setVersion(version);
  setTtl(msg, r.ttl);
  return msg;
}

export function mapCname(r: vendor.RawCnameRecord): CnameRecord {
  const msg = new CnameRecord();
  msg.setName(r.name || '@');
  msg.setTarget(r.alias ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

export function mapMx(r: vendor.RawMxRecord): MxRecord {
  const msg = new MxRecord();
  msg.setName(r.name || '@');
  msg.setPreference(Number.isFinite(r.preference) ? r.preference : 0);
  msg.setHost(r.host ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

// Strips one layer of matching double-quote characters from a zone-file TXT
// literal (the vendored parser preserves them literally, e.g. `"hello"`).
export function stripQuotes(text: string): string {
  if (text.length >= 2 && text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  return text;
}

export function mapTxt(r: vendor.RawTxtRecord | vendor.RawSpfRecord): TxtRecord {
  const msg = new TxtRecord();
  msg.setName(r.name || '@');
  const raw = 'txt' in r ? r.txt : r.data;
  msg.setText(stripQuotes(raw ?? ''));
  setTtl(msg, r.ttl);
  return msg;
}

export function mapPtr(r: vendor.RawPtrRecord): PtrRecord {
  const msg = new PtrRecord();
  msg.setName(r.name || '@');
  msg.setFullname(r.fullname ?? '');
  msg.setHost(r.host ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

export function mapSrv(r: vendor.RawSrvRecord): SrvRecord {
  const msg = new SrvRecord();
  msg.setName(r.name || '@');
  msg.setPriority(Number.isFinite(r.priority) ? r.priority : 0);
  msg.setWeight(Number.isFinite(r.weight) ? r.weight : 0);
  msg.setPort(Number.isFinite(r.port) ? r.port : 0);
  msg.setTarget(r.target ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

export function mapCaa(r: vendor.RawCaaRecord): CaaRecord {
  const msg = new CaaRecord();
  msg.setName(r.name || '@');
  msg.setFlags(Number.isFinite(r.flags) ? r.flags : 0);
  msg.setTag(r.tag ?? '');
  msg.setValue(r.value ?? '');
  setTtl(msg, r.ttl);
  return msg;
}

export function mapDs(r: vendor.RawDsRecord): GenericRecord {
  const msg = new GenericRecord();
  msg.setName(r.name || '@');
  msg.setType('DS');
  setTtl(msg, r.ttl);
  const fields = msg.getFieldsMap();
  fields.set('key_tag', r.key_tag ?? '');
  fields.set('algorithm', r.algorithm ?? '');
  fields.set('digest_type', r.digest_type ?? '');
  fields.set('digest', r.digest ?? '');
  return msg;
}

// Build the full ZoneFile envelope from a raw parsed zone. Assumes
// checkedParse already validated bounds; does not itself return an error
// (a malformed SOA is simply omitted with has_soa=false, since ParseZoneFile
// is documented to return everything it could parse).
export function buildZoneFile(raw: vendor.RawZone): ZoneFile {
  const zf = new ZoneFile();
  if (typeof raw.$origin === 'string') {
    zf.setOrigin(raw.$origin);
    zf.setHasOrigin(true);
  }
  if (typeof raw.$ttl === 'string' && raw.$ttl.trim() !== '') {
    const ttlNum = Number(raw.$ttl);
    if (Number.isFinite(ttlNum)) {
      zf.setTtl(ttlNum);
      zf.setHasTtl(true);
    }
  }
  if (isWellFormedSoa(raw.soa)) {
    zf.setSoa(mapSoa(raw.soa));
    zf.setHasSoa(true);
  }
  zf.setNsList((raw.ns ?? []).map(mapNs));
  zf.setAList((raw.a ?? []).map((r) => mapAddress(r, 4)));
  zf.setAaaaList((raw.aaaa ?? []).map((r) => mapAddress(r, 6)));
  zf.setCnameList((raw.cname ?? []).map(mapCname));
  zf.setMxList((raw.mx ?? []).map(mapMx));
  zf.setTxtList((raw.txt ?? []).map(mapTxt));
  zf.setSpfList((raw.spf ?? []).map(mapTxt));
  zf.setPtrList((raw.ptr ?? []).map(mapPtr));
  zf.setSrvList((raw.srv ?? []).map(mapSrv));
  zf.setCaaList((raw.caa ?? []).map(mapCaa));
  zf.setDsList((raw.ds ?? []).map(mapDs));
  return zf;
}

// Convert a structured ZoneFile proto message back into the vendored
// parser's raw shape, for GenerateZoneFile (the inverse of ParseZoneFile /
// buildZoneFile above). Returns an error if the zone has no SOA record —
// the generator template always emits an SOA block, and an entirely absent
// `soa` object leaves its `{mname}{rname}{serial}...` placeholders
// unreplaced in the output text (verified during authoring against the
// vendored generate() template), which would silently produce a corrupt
// zone file rather than a clean error.
export type ToRawOutcome = { ok: true; raw: vendor.RawZone } | { ok: false; error: ErrorMsg };

export function zoneFileToRaw(zone: ZoneFile): ToRawOutcome {
  if (!zone.hasSoa() || !zone.getSoa()) {
    return { ok: false, error: makeError('MISSING_SOA', 'zone.soa is required to generate zone file text.') };
  }
  const soaMsg = zone.getSoa()!;
  const raw: vendor.RawZone = {
    soa: {
      name: soaMsg.getName() || '@',
      mname: soaMsg.getMname(),
      rname: soaMsg.getRname(),
      serial: soaMsg.getSerial(),
      refresh: soaMsg.getRefresh(),
      retry: soaMsg.getRetry(),
      expire: soaMsg.getExpire(),
      minimum: soaMsg.getMinimum(),
      ...(soaMsg.getHasTtl() ? { ttl: soaMsg.getTtl() } : {}),
    },
  };
  if (zone.getHasOrigin()) raw.$origin = zone.getOrigin();
  if (zone.getHasTtl()) raw.$ttl = String(zone.getTtl());

  raw.ns = zone.getNsList().map((r) => ({
    name: r.getName() || '@',
    host: r.getHost(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.a = zone.getAList().map((r) => ({
    name: r.getName() || '@',
    ip: r.getAddress(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.aaaa = zone.getAaaaList().map((r) => ({
    name: r.getName() || '@',
    ip: r.getAddress(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.cname = zone.getCnameList().map((r) => ({
    name: r.getName() || '@',
    alias: r.getTarget(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.mx = zone.getMxList().map((r) => ({
    name: r.getName() || '@',
    preference: r.getPreference(),
    host: r.getHost(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.txt = zone.getTxtList().map((r) => ({
    name: r.getName() || '@',
    txt: `"${r.getText().replace(/"/g, '')}"`,
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.spf = zone.getSpfList().map((r) => ({
    name: r.getName() || '@',
    data: `"${r.getText().replace(/"/g, '')}"`,
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.ptr = zone.getPtrList().map((r) => ({
    name: r.getName() || '@',
    fullname: r.getFullname(),
    host: r.getHost(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.srv = zone.getSrvList().map((r) => ({
    name: r.getName() || '@',
    target: r.getTarget(),
    priority: r.getPriority(),
    weight: r.getWeight(),
    port: r.getPort(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.caa = zone.getCaaList().map((r) => ({
    name: r.getName() || '@',
    flags: r.getFlags(),
    tag: r.getTag(),
    value: r.getValue(),
    ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
  }));
  raw.ds = zone.getDsList().map((r) => {
    const fields = r.getFieldsMap();
    return {
      name: r.getName() || '@',
      key_tag: fields.get('key_tag') ?? '',
      algorithm: fields.get('algorithm') ?? '',
      digest_type: fields.get('digest_type') ?? '',
      digest: fields.get('digest') ?? '',
      ...(r.getHasTtl() ? { ttl: r.getTtl() } : {}),
    };
  });

  return { ok: true, raw };
}

// Resolve a single zone-file record name against $ORIGIN. Pure string/label
// logic — mirrors the relative-vs-FQDN convention RFC 1035 zone files use
// ("@" = origin itself, a bare label is relative to origin, a trailing "."
// makes a name absolute).
export type NormalizeOutcome =
  | { ok: true; fqdn: string; relative: string; wasFqdn: boolean }
  | { ok: false; code: string; message: string };

export function normalizeName(name: string, origin: string): NormalizeOutcome {
  if (!name) {
    return { ok: false, code: 'EMPTY_NAME', message: 'name is empty.' };
  }
  const wasFqdn = name.endsWith('.');
  const originTrimmed = origin.trim();
  const origin2 = originTrimmed.length > 0 ? (originTrimmed.endsWith('.') ? originTrimmed : originTrimmed + '.') : '';

  let fqdn: string;
  if (wasFqdn) {
    fqdn = name;
  } else if (name === '@') {
    if (!origin2) {
      return { ok: false, code: 'MISSING_ORIGIN', message: 'origin is required to resolve "@".' };
    }
    fqdn = origin2;
  } else {
    if (!origin2) {
      return { ok: false, code: 'MISSING_ORIGIN', message: 'origin is required to resolve a relative name.' };
    }
    fqdn = name + '.' + origin2;
  }

  let relative: string;
  if (origin2 && fqdn === origin2) {
    relative = '@';
  } else if (origin2 && fqdn.endsWith('.' + origin2)) {
    relative = fqdn.slice(0, fqdn.length - ('.' + origin2).length);
  } else {
    relative = fqdn.endsWith('.') ? fqdn.slice(0, -1) : fqdn;
  }

  return { ok: true, fqdn, relative, wasFqdn };
}

