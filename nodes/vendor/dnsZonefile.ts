// Vendored, verbatim port of the parse/generate algorithm from
// `dns-zonefile` (https://github.com/elgs/dns-zonefile), version 0.3.2.
//
// Ported in-tree (rather than depended on as an npm package) because the
// upstream package is published as ESM-only ("type": "module") while this
// Axiom TypeScript package compiles to CommonJS — requiring it would rely
// on Node's experimental synchronous require-of-ESM interop, which is not
// something to bet a deployed runtime's Node version on. The parsing and
// generation logic below is unchanged from upstream aside from adding
// TypeScript types; no algorithmic behavior was altered.
//
// Upstream license (ISC License):
//
//   Copyright (c) 2014, Elgs Qian Chen
//
//   Permission to use, copy, modify, and/or distribute this software for any
//   purpose with or without fee is hereby granted, provided that the above
//   copyright notice and this permission notice appear in all copies.
//
//   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
//   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
//   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
//   ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
//   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
//   ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
//   OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//
// The full notice is also reproduced at the repo root in
// DNS_ZONEFILE_LICENSE.txt.

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RawSoa {
  name: string;
  ttl?: number;
  mname: string;
  rname: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minimum: number;
}

export interface RawNameHostRecord {
  name: string;
  host: string;
  ttl?: number;
}

export interface RawAddressRecord {
  name: string;
  ip: string;
  ttl?: number;
}

export interface RawCnameRecord {
  name: string;
  alias: string;
  ttl?: number;
}

export interface RawMxRecord {
  name: string;
  preference: number;
  host: string;
  ttl?: number;
}

export interface RawTxtRecord {
  name: string;
  txt: string;
  ttl?: number;
}

export interface RawPtrRecord {
  name: string;
  fullname: string;
  host: string;
  ttl?: number;
}

export interface RawSrvRecord {
  name: string;
  target: string;
  priority: number;
  weight: number;
  port: number;
  ttl?: number;
}

export interface RawSpfRecord {
  name: string;
  data: string;
  ttl?: number;
}

export interface RawCaaRecord {
  name: string;
  flags: number;
  tag: string;
  value: string;
  ttl?: number;
}

export interface RawDsRecord {
  name: string;
  key_tag: string;
  algorithm: string;
  digest_type: string;
  digest: string;
  ttl?: number;
}

export interface RawZone {
  $origin?: string;
  $ttl?: string;
  soa?: RawSoa;
  ns?: RawNameHostRecord[];
  a?: RawAddressRecord[];
  aaaa?: RawAddressRecord[];
  cname?: RawCnameRecord[];
  mx?: RawMxRecord[];
  txt?: RawTxtRecord[];
  ptr?: RawPtrRecord[];
  srv?: RawSrvRecord[];
  spf?: RawSpfRecord[];
  caa?: RawCaaRecord[];
  ds?: RawDsRecord[];
}

// ---------------------------------------------------------------------------
// parse()
// ---------------------------------------------------------------------------

export function parse(text: string): RawZone {
  text = removeComments(text);
  text = flatten(text);
  return parseRRs(text);
}

function removeComments(text: string): string {
  const lines = text.split('\n');
  let ret = '';
  for (const line of lines) {
    if (line.trim().startsWith(';')) {
      continue;
    }
    const tokens = splitArgs(line, ';', true);
    for (const token of tokens) {
      ret += token;
      if (token.endsWith('\\')) {
        ret += ';';
      } else {
        ret += '\n';
        break;
      }
    }
  }
  return ret;
}

function flatten(text: string): string {
  const re = /SOA[\s\S]*?\([\s\S]*?\)/gim;
  const match = re.exec(text);
  if (match !== null) {
    let soa = match[0].replace(/\s+/gm, ' ');
    soa = soa.replace(/\(|\)/gim, ' ');
    return text.substring(0, match.index) + soa + text.substring(match.index + match[0].length);
  } else {
    return text;
  }
}

interface NormalizedRR {
  rrType: string;
  tokens: string[];
  hasName: boolean;
  hasTtl: boolean;
  typeIndex: number;
}

function normalizeRR(rr: string): NormalizedRR {
  const rrArray = splitArgs(rr, null, true);
  let hasName: boolean;
  let hasTtl = false;
  if (rr.match(/^\s+/)) {
    hasName = false;
  } else {
    hasName = true;
  }

  // According to RFC 1035:
  // <rr> contents take one of the following forms:
  // [<TTL>] [<class>] <type> <RDATA> -- We assume this one
  // [<class>] [<TTL>] <type> <RDATA>
  if (hasName) {
    if (!isNaN(Number(rrArray[1]))) {
      hasTtl = true;
    }
  } else {
    if (!isNaN(Number(rrArray[0]))) {
      hasTtl = true;
    }
  }

  let rrTypeIndex = 0;
  if (hasName) {
    ++rrTypeIndex;
  }
  if (hasTtl) {
    ++rrTypeIndex;
  }
  let rrType = rrArray[rrTypeIndex];
  if (rrType === 'IN') {
    rrType = rrArray[rrTypeIndex + 1];
  }

  let typeIndex = rrArray.indexOf(rrType, hasName ? 1 : 0);
  if (typeIndex === 0 || rrArray[typeIndex - 1] !== 'IN') {
    rrArray.splice(typeIndex, 0, 'IN');
    ++typeIndex;
  }

  return {
    rrType,
    tokens: rrArray,
    hasName,
    hasTtl,
    typeIndex,
  };
}

function parseRRs(text: string): RawZone {
  const ret: RawZone = {};
  const rrs = text.split('\n');
  for (const rr of rrs) {
    if (!rr.trim()) {
      continue;
    }
    const rrArray = splitArgs(rr, null, true);
    if (rr.startsWith('$ORIGIN')) {
      ret.$origin = rrArray[1];
    } else if (rr.startsWith('$TTL')) {
      ret.$ttl = rrArray[1];
    } else {
      const nrr = normalizeRR(rr);
      switch (nrr.rrType) {
        case 'SOA':
          ret.soa = parseSOA(rrArray);
          break;
        case 'TXT':
          ret.txt = ret.txt || [];
          ret.txt.push(parseTXT(nrr, ret.txt));
          break;
        case 'NS':
          ret.ns = ret.ns || [];
          ret.ns.push(parseNS(nrr, ret.ns));
          break;
        case 'A':
          ret.a = ret.a || [];
          ret.a.push(parseA(nrr, ret.a));
          break;
        case 'AAAA':
          ret.aaaa = ret.aaaa || [];
          ret.aaaa.push(parseAAAA(nrr, ret.aaaa));
          break;
        case 'CNAME':
          ret.cname = ret.cname || [];
          ret.cname.push(parseCNAME(nrr, ret.cname));
          break;
        case 'MX':
          ret.mx = ret.mx || [];
          ret.mx.push(parseMX(nrr, ret.mx));
          break;
        case 'PTR':
          ret.ptr = ret.ptr || [];
          ret.ptr.push(parsePTR(nrr, ret.ptr, ret.$origin));
          break;
        case 'SRV':
          ret.srv = ret.srv || [];
          ret.srv.push(parseSRV(nrr, ret.srv));
          break;
        case 'SPF':
          ret.spf = ret.spf || [];
          ret.spf.push(parseSPF(nrr, ret.spf));
          break;
        case 'CAA':
          ret.caa = ret.caa || [];
          ret.caa.push(parseCAA(nrr, ret.caa));
          break;
        case 'DS':
          ret.ds = ret.ds || [];
          ret.ds.push(parseDS(nrr, ret.ds));
          break;
      }
    }
  }
  return ret;
}

function parseSOA(rrTokens: string[]): RawSoa {
  const soa: any = {};
  const l = rrTokens.length;
  soa.name = rrTokens[0];
  soa.minimum = parseInt(rrTokens[l - 1], 10);
  soa.expire = parseInt(rrTokens[l - 2], 10);
  soa.retry = parseInt(rrTokens[l - 3], 10);
  soa.refresh = parseInt(rrTokens[l - 4], 10);
  soa.serial = parseInt(rrTokens[l - 5], 10);
  soa.rname = rrTokens[l - 6];
  soa.mname = rrTokens[l - 7];
  if (!isNaN(Number(rrTokens[1]))) soa.ttl = parseInt(rrTokens[1], 10);
  return soa as RawSoa;
}

function inheritName(rrData: NormalizedRR, recordsSoFar: Array<{ name: string }>): void {
  if (!rrData.hasName) {
    if (recordsSoFar.length) {
      rrData.tokens.unshift(recordsSoFar[recordsSoFar.length - 1].name);
    } else {
      rrData.tokens.unshift('@');
    }
  }
}

function parseNS(rrData: NormalizedRR, recordsSoFar: RawNameHostRecord[]): RawNameHostRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawNameHostRecord = { name: rrTokens[0], host: rrTokens[l - 1] };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseA(rrData: NormalizedRR, recordsSoFar: RawAddressRecord[]): RawAddressRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawAddressRecord = { name: rrTokens[0], ip: rrTokens[l - 1] };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseAAAA(rrData: NormalizedRR, recordsSoFar: RawAddressRecord[]): RawAddressRecord {
  return parseA(rrData, recordsSoFar);
}

function parseCNAME(rrData: NormalizedRR, recordsSoFar: RawCnameRecord[]): RawCnameRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawCnameRecord = { name: rrTokens[0], alias: rrTokens[l - 1] };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseMX(rrData: NormalizedRR, recordsSoFar: RawMxRecord[]): RawMxRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawMxRecord = {
    name: rrTokens[0],
    preference: parseInt(rrTokens[l - 2], 10),
    host: rrTokens[l - 1],
  };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseTXT(rrData: NormalizedRR, recordsSoFar: RawTxtRecord[]): RawTxtRecord {
  const rrTokens = rrData.tokens;
  const txtArray = rrTokens.slice(rrData.typeIndex + 1);
  inheritName(rrData, recordsSoFar);
  const result: RawTxtRecord = { name: rrTokens[0], txt: txtArray.join(' ') };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parsePTR(
  rrData: NormalizedRR,
  recordsSoFar: RawPtrRecord[],
  currentOrigin: string | undefined
): RawPtrRecord {
  const rrTokens = rrData.tokens;
  if (!rrData.hasName && recordsSoFar[recordsSoFar.length - 1]) {
    rrTokens.unshift(recordsSoFar[recordsSoFar.length - 1].name);
  }
  const l = rrTokens.length;
  const result: RawPtrRecord = {
    name: rrTokens[0],
    fullname: rrTokens[0] + '.' + currentOrigin,
    host: rrTokens[l - 1],
  };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseSRV(rrData: NormalizedRR, recordsSoFar: RawSrvRecord[]): RawSrvRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawSrvRecord = {
    name: rrTokens[0],
    target: rrTokens[l - 1],
    priority: parseInt(rrTokens[l - 4], 10),
    weight: parseInt(rrTokens[l - 3], 10),
    port: parseInt(rrTokens[l - 2], 10),
  };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseSPF(rrData: NormalizedRR, recordsSoFar: RawSpfRecord[]): RawSpfRecord {
  const rrTokens = rrData.tokens;
  const txtArray = rrTokens.slice(rrData.typeIndex + 1);
  inheritName(rrData, recordsSoFar);
  const result: RawSpfRecord = { name: rrTokens[0], data: txtArray.join(' ') };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseCAA(rrData: NormalizedRR, recordsSoFar: RawCaaRecord[]): RawCaaRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawCaaRecord = {
    name: rrTokens[0],
    flags: parseInt(rrTokens[l - 3], 10),
    tag: rrTokens[l - 2],
    value: rrTokens[l - 1],
  };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseDS(rrData: NormalizedRR, recordsSoFar: RawDsRecord[]): RawDsRecord {
  inheritName(rrData, recordsSoFar);
  const rrTokens = rrData.tokens;
  const l = rrTokens.length;
  const result: RawDsRecord = {
    name: rrTokens[0],
    key_tag: rrTokens[l - 4],
    algorithm: rrTokens[l - 3],
    digest_type: rrTokens[l - 2],
    digest: rrTokens[l - 1],
  };
  if (rrData.hasTtl) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function splitArgs(input: string, sep: string | null, keepQuotes?: boolean): string[] {
  const separator: string | RegExp = sep || /\s/g;
  let singleQuoteOpen = false;
  let doubleQuoteOpen = false;
  let tokenBuffer: string[] = [];
  const ret: string[] = [];

  const arr = input.split('');
  for (let i = 0; i < arr.length; ++i) {
    const element = arr[i];
    const matches = element.match(separator as any);
    if (element === "'" && !doubleQuoteOpen) {
      if (keepQuotes === true) {
        tokenBuffer.push(element);
      }
      singleQuoteOpen = !singleQuoteOpen;
      continue;
    } else if (element === '"' && !singleQuoteOpen) {
      if (keepQuotes === true) {
        tokenBuffer.push(element);
      }
      doubleQuoteOpen = !doubleQuoteOpen;
      continue;
    }

    if (!singleQuoteOpen && !doubleQuoteOpen && matches) {
      if (tokenBuffer.length > 0) {
        ret.push(tokenBuffer.join(''));
        tokenBuffer = [];
      }
    } else {
      tokenBuffer.push(element);
    }
  }
  if (tokenBuffer.length > 0) {
    ret.push(tokenBuffer.join(''));
  } else if (!!sep) {
    ret.push('');
  }
  return ret;
}

// ---------------------------------------------------------------------------
// generate()
// ---------------------------------------------------------------------------

const defaultTemplate = `; Zone: {zone}
; Exported  (yyyy-mm-ddThh:mm:ss.sssZ): {datetime}

{$origin}
{$ttl}

; SOA Record
{name} {ttl}\tIN\tSOA\t{mname}{rname}(
{serial} ;serial
{refresh} ;refresh
{retry} ;retry
{expire} ;expire
{minimum} ;minimum ttl
)

; NS Records
{ns}

; MX Records
{mx}

; A Records
{a}

; AAAA Records
{aaaa}

; CNAME Records
{cname}

; PTR Records
{ptr}

; TXT Records
{txt}

; SRV Records
{srv}

; SPF Records
{spf}

; CAA Records
{caa}

; DS Records
{ds}

`;

export function generate(options: RawZone, template?: string): string {
  const json: any = JSON.parse(JSON.stringify(options));
  let tpl = template || defaultTemplate;
  tpl = process$ORIGIN(json['$origin'], tpl);
  tpl = process$TTL(json['$ttl'], tpl);
  tpl = processSOA(json['soa'] || {}, tpl);
  tpl = processNS(json['ns'] || [], tpl);
  tpl = processA(json['a'] || [], tpl);
  tpl = processAAAA(json['aaaa'] || [], tpl);
  tpl = processCNAME(json['cname'] || [], tpl);
  tpl = processMX(json['mx'] || [], tpl);
  tpl = processPTR(json['ptr'] || [], tpl);
  tpl = processTXT(json['txt'] || [], tpl);
  tpl = processSRV(json['srv'] || [], tpl);
  tpl = processSPF(json['spf'] || [], tpl);
  tpl = processCAA(json['caa'] || [], tpl);
  tpl = processDS(json['ds'] || [], tpl);
  tpl = processValues(json, tpl);
  return tpl.replace(/\n{2,}/gim, '\n\n');
}

function process$ORIGIN(data: string | undefined, template: string): string {
  let ret = '';
  if (typeof data !== 'undefined') {
    ret += '$ORIGIN ' + data;
  }
  return template.replace('{$origin}', ret);
}

function process$TTL(data: string | undefined, template: string): string {
  let ret = '';
  if (typeof data !== 'undefined') {
    ret += '$TTL ' + data;
  }
  return template.replace('{$ttl}', ret);
}

function processSOA(data: any, template: string): string {
  let ret = template;
  data.name = data.name || '@';
  data.ttl = data.ttl || '';
  Object.keys(data).map((key) => {
    ret = ret.replace('{' + key + '}', data[key] + '\t');
  });
  return ret;
}

function processNS(data: RawNameHostRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tNS\t' + value.host + '\n';
  }
  return template.replace('{ns}', ret);
}

function processA(data: RawAddressRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tA\t' + value.ip + '\n';
  }
  return template.replace('{a}', ret);
}

function processAAAA(data: RawAddressRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tAAAA\t' + value.ip + '\n';
  }
  return template.replace('{aaaa}', ret);
}

function processCNAME(data: RawCnameRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tCNAME\t' + value.alias + '\n';
  }
  return template.replace('{cname}', ret);
}

function processMX(data: RawMxRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tMX\t' + value.preference + '\t' + value.host + '\n';
  }
  return template.replace('{mx}', ret);
}

function processPTR(data: RawPtrRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tPTR\t' + value.host + '\n';
  }
  return template.replace('{ptr}', ret);
}

function processTXT(data: RawTxtRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tTXT\t' + value.txt + '\n';
  }
  return template.replace('{txt}', ret);
}

function processSRV(data: RawSrvRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tSRV\t' + value.priority + '\t';
    ret += value.weight + '\t';
    ret += value.port + '\t';
    ret += value.target + '\n';
  }
  return template.replace('{srv}', ret);
}

function processSPF(data: RawSpfRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += 'IN\tSPF\t' + value.data + '\n';
  }
  return template.replace('{spf}', ret);
}

function processCAA(data: RawCaaRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += `IN\tCAA\t${value.flags}\t${value.tag}\t${value.value}\n`;
  }
  return template.replace('{caa}', ret);
}

function processDS(data: RawDsRecord[], template: string): string {
  let ret = '';
  for (const value of data) {
    ret += (value.name || '@') + '\t';
    if (value.ttl) ret += value.ttl + '\t';
    ret += `IN\tDS\t${value.key_tag}\t${value.algorithm}\t${value.digest_type}\t${value.digest}\n`;
  }
  return template.replace('{ds}', ret);
}

function processValues(options: any, template: string): string {
  template = template.replace('{zone}', options['$origin'] || (options['soa'] && options['soa']['name']) || '');
  template = template.replace('{datetime}', new Date().toISOString());
  return template.replace('{time}', String(Math.round(Date.now() / 1000)));
}
