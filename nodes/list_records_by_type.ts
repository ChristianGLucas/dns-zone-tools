import { ListRecordsByTypeInput, RecordList, GenericRecord } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkedParse, makeError, mapTxt, mapDs } from './helpers';

function toGeneric(name: string, type: string, ttl: number | undefined, fields: Record<string, string>): GenericRecord {
  const msg = new GenericRecord();
  msg.setName(name || '@');
  msg.setType(type);
  if (typeof ttl === 'number' && Number.isFinite(ttl)) {
    msg.setTtl(ttl);
    msg.setHasTtl(true);
  }
  const map = msg.getFieldsMap();
  for (const [k, v] of Object.entries(fields)) {
    map.set(k, v);
  }
  return msg;
}

const SUPPORTED_TYPES = ['SOA', 'NS', 'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'PTR', 'SRV', 'SPF', 'CAA', 'DS'];

/**
 * Parse a zone file and list every record of one caller-chosen type (SOA,
 * NS, A, AAAA, CNAME, MX, TXT, PTR, SRV, SPF, CAA, or DS — case-
 * insensitive), as generic name/type/ttl/fields records. Use this for any
 * type, including the ones (SRV, PTR, CAA, SPF, DS) that don't have a
 * dedicated extraction node. An unrecognized record_type or a malformed
 * zone file returns a structured error.
 */
export function listRecordsByType(ax: AxiomContext, input: ListRecordsByTypeInput): RecordList {
  const result = new RecordList();
  const rawType = (input.getRecordType() || '').trim().toUpperCase();
  result.setRecordType(rawType);

  if (!SUPPORTED_TYPES.includes(rawType)) {
    result.setError(makeError('UNKNOWN_RECORD_TYPE', `record_type must be one of: ${SUPPORTED_TYPES.join(', ')}.`));
    return result;
  }

  const outcome = checkedParse(input.getZoneText());
  if (outcome.ok === false) {
    result.setError(outcome.error);
    return result;
  }
  const raw = outcome.raw;

  let records: GenericRecord[];
  switch (rawType) {
    case 'SOA':
      records = raw.soa
        ? [
            toGeneric(raw.soa.name, 'SOA', raw.soa.ttl, {
              mname: raw.soa.mname ?? '',
              rname: raw.soa.rname ?? '',
              serial: String(raw.soa.serial ?? ''),
              refresh: String(raw.soa.refresh ?? ''),
              retry: String(raw.soa.retry ?? ''),
              expire: String(raw.soa.expire ?? ''),
              minimum: String(raw.soa.minimum ?? ''),
            }),
          ]
        : [];
      break;
    case 'NS':
      records = (raw.ns ?? []).map((r) => toGeneric(r.name, 'NS', r.ttl, { host: r.host ?? '' }));
      break;
    case 'A':
      records = (raw.a ?? []).map((r) => toGeneric(r.name, 'A', r.ttl, { address: r.ip ?? '' }));
      break;
    case 'AAAA':
      records = (raw.aaaa ?? []).map((r) => toGeneric(r.name, 'AAAA', r.ttl, { address: r.ip ?? '' }));
      break;
    case 'CNAME':
      records = (raw.cname ?? []).map((r) => toGeneric(r.name, 'CNAME', r.ttl, { target: r.alias ?? '' }));
      break;
    case 'MX':
      records = (raw.mx ?? []).map((r) =>
        toGeneric(r.name, 'MX', r.ttl, { preference: String(r.preference ?? ''), host: r.host ?? '' })
      );
      break;
    case 'TXT':
      records = (raw.txt ?? []).map((r) => toGeneric(r.name, 'TXT', r.ttl, { text: mapTxt(r).getText() }));
      break;
    case 'SPF':
      records = (raw.spf ?? []).map((r) => toGeneric(r.name, 'SPF', r.ttl, { text: mapTxt(r).getText() }));
      break;
    case 'PTR':
      records = (raw.ptr ?? []).map((r) =>
        toGeneric(r.name, 'PTR', r.ttl, { fullname: r.fullname ?? '', host: r.host ?? '' })
      );
      break;
    case 'SRV':
      records = (raw.srv ?? []).map((r) =>
        toGeneric(r.name, 'SRV', r.ttl, {
          priority: String(r.priority ?? ''),
          weight: String(r.weight ?? ''),
          port: String(r.port ?? ''),
          target: r.target ?? '',
        })
      );
      break;
    case 'CAA':
      records = (raw.caa ?? []).map((r) =>
        toGeneric(r.name, 'CAA', r.ttl, { flags: String(r.flags ?? ''), tag: r.tag ?? '', value: r.value ?? '' })
      );
      break;
    case 'DS':
      records = (raw.ds ?? []).map(mapDs);
      break;
    default:
      records = [];
  }

  result.setRecordsList(records);
  return result;
}
