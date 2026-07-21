// package: christiangeorgelucas.dns_zone_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Error extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    code: string,
    message: string,
  }
}

export class ZoneFileInput extends jspb.Message {
  getZoneText(): string;
  setZoneText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneFileInput.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneFileInput): ZoneFileInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneFileInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneFileInput;
  static deserializeBinaryFromReader(message: ZoneFileInput, reader: jspb.BinaryReader): ZoneFileInput;
}

export namespace ZoneFileInput {
  export type AsObject = {
    zoneText: string,
  }
}

export class SoaRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  getMname(): string;
  setMname(value: string): void;

  getRname(): string;
  setRname(value: string): void;

  getSerial(): number;
  setSerial(value: number): void;

  getRefresh(): number;
  setRefresh(value: number): void;

  getRetry(): number;
  setRetry(value: number): void;

  getExpire(): number;
  setExpire(value: number): void;

  getMinimum(): number;
  setMinimum(value: number): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SoaRecord.AsObject;
  static toObject(includeInstance: boolean, msg: SoaRecord): SoaRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SoaRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SoaRecord;
  static deserializeBinaryFromReader(message: SoaRecord, reader: jspb.BinaryReader): SoaRecord;
}

export namespace SoaRecord {
  export type AsObject = {
    name: string,
    ttl: number,
    hasTtl: boolean,
    mname: string,
    rname: string,
    serial: number,
    refresh: number,
    retry: number,
    expire: number,
    minimum: number,
    error?: Error.AsObject,
  }
}

export class NsRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getHost(): string;
  setHost(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NsRecord.AsObject;
  static toObject(includeInstance: boolean, msg: NsRecord): NsRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NsRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NsRecord;
  static deserializeBinaryFromReader(message: NsRecord, reader: jspb.BinaryReader): NsRecord;
}

export namespace NsRecord {
  export type AsObject = {
    name: string,
    host: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class AddressRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressRecord.AsObject;
  static toObject(includeInstance: boolean, msg: AddressRecord): AddressRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressRecord;
  static deserializeBinaryFromReader(message: AddressRecord, reader: jspb.BinaryReader): AddressRecord;
}

export namespace AddressRecord {
  export type AsObject = {
    name: string,
    address: string,
    version: number,
    ttl: number,
    hasTtl: boolean,
  }
}

export class CnameRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getTarget(): string;
  setTarget(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CnameRecord.AsObject;
  static toObject(includeInstance: boolean, msg: CnameRecord): CnameRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CnameRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CnameRecord;
  static deserializeBinaryFromReader(message: CnameRecord, reader: jspb.BinaryReader): CnameRecord;
}

export namespace CnameRecord {
  export type AsObject = {
    name: string,
    target: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class MxRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getPreference(): number;
  setPreference(value: number): void;

  getHost(): string;
  setHost(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MxRecord.AsObject;
  static toObject(includeInstance: boolean, msg: MxRecord): MxRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MxRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MxRecord;
  static deserializeBinaryFromReader(message: MxRecord, reader: jspb.BinaryReader): MxRecord;
}

export namespace MxRecord {
  export type AsObject = {
    name: string,
    preference: number,
    host: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class TxtRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getText(): string;
  setText(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxtRecord.AsObject;
  static toObject(includeInstance: boolean, msg: TxtRecord): TxtRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxtRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxtRecord;
  static deserializeBinaryFromReader(message: TxtRecord, reader: jspb.BinaryReader): TxtRecord;
}

export namespace TxtRecord {
  export type AsObject = {
    name: string,
    text: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class PtrRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFullname(): string;
  setFullname(value: string): void;

  getHost(): string;
  setHost(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PtrRecord.AsObject;
  static toObject(includeInstance: boolean, msg: PtrRecord): PtrRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PtrRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PtrRecord;
  static deserializeBinaryFromReader(message: PtrRecord, reader: jspb.BinaryReader): PtrRecord;
}

export namespace PtrRecord {
  export type AsObject = {
    name: string,
    fullname: string,
    host: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class SrvRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getPriority(): number;
  setPriority(value: number): void;

  getWeight(): number;
  setWeight(value: number): void;

  getPort(): number;
  setPort(value: number): void;

  getTarget(): string;
  setTarget(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SrvRecord.AsObject;
  static toObject(includeInstance: boolean, msg: SrvRecord): SrvRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SrvRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SrvRecord;
  static deserializeBinaryFromReader(message: SrvRecord, reader: jspb.BinaryReader): SrvRecord;
}

export namespace SrvRecord {
  export type AsObject = {
    name: string,
    priority: number,
    weight: number,
    port: number,
    target: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class CaaRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFlags(): number;
  setFlags(value: number): void;

  getTag(): string;
  setTag(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CaaRecord.AsObject;
  static toObject(includeInstance: boolean, msg: CaaRecord): CaaRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CaaRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CaaRecord;
  static deserializeBinaryFromReader(message: CaaRecord, reader: jspb.BinaryReader): CaaRecord;
}

export namespace CaaRecord {
  export type AsObject = {
    name: string,
    flags: number,
    tag: string,
    value: string,
    ttl: number,
    hasTtl: boolean,
  }
}

export class GenericRecord extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  getFieldsMap(): jspb.Map<string, string>;
  clearFieldsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenericRecord.AsObject;
  static toObject(includeInstance: boolean, msg: GenericRecord): GenericRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenericRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenericRecord;
  static deserializeBinaryFromReader(message: GenericRecord, reader: jspb.BinaryReader): GenericRecord;
}

export namespace GenericRecord {
  export type AsObject = {
    name: string,
    type: string,
    ttl: number,
    hasTtl: boolean,
    fieldsMap: Array<[string, string]>,
  }
}

export class ZoneFile extends jspb.Message {
  getOrigin(): string;
  setOrigin(value: string): void;

  getHasOrigin(): boolean;
  setHasOrigin(value: boolean): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  hasSoa(): boolean;
  clearSoa(): void;
  getSoa(): SoaRecord | undefined;
  setSoa(value?: SoaRecord): void;

  getHasSoa(): boolean;
  setHasSoa(value: boolean): void;

  clearNsList(): void;
  getNsList(): Array<NsRecord>;
  setNsList(value: Array<NsRecord>): void;
  addNs(value?: NsRecord, index?: number): NsRecord;

  clearAList(): void;
  getAList(): Array<AddressRecord>;
  setAList(value: Array<AddressRecord>): void;
  addA(value?: AddressRecord, index?: number): AddressRecord;

  clearAaaaList(): void;
  getAaaaList(): Array<AddressRecord>;
  setAaaaList(value: Array<AddressRecord>): void;
  addAaaa(value?: AddressRecord, index?: number): AddressRecord;

  clearCnameList(): void;
  getCnameList(): Array<CnameRecord>;
  setCnameList(value: Array<CnameRecord>): void;
  addCname(value?: CnameRecord, index?: number): CnameRecord;

  clearMxList(): void;
  getMxList(): Array<MxRecord>;
  setMxList(value: Array<MxRecord>): void;
  addMx(value?: MxRecord, index?: number): MxRecord;

  clearTxtList(): void;
  getTxtList(): Array<TxtRecord>;
  setTxtList(value: Array<TxtRecord>): void;
  addTxt(value?: TxtRecord, index?: number): TxtRecord;

  clearSpfList(): void;
  getSpfList(): Array<TxtRecord>;
  setSpfList(value: Array<TxtRecord>): void;
  addSpf(value?: TxtRecord, index?: number): TxtRecord;

  clearPtrList(): void;
  getPtrList(): Array<PtrRecord>;
  setPtrList(value: Array<PtrRecord>): void;
  addPtr(value?: PtrRecord, index?: number): PtrRecord;

  clearSrvList(): void;
  getSrvList(): Array<SrvRecord>;
  setSrvList(value: Array<SrvRecord>): void;
  addSrv(value?: SrvRecord, index?: number): SrvRecord;

  clearCaaList(): void;
  getCaaList(): Array<CaaRecord>;
  setCaaList(value: Array<CaaRecord>): void;
  addCaa(value?: CaaRecord, index?: number): CaaRecord;

  clearDsList(): void;
  getDsList(): Array<GenericRecord>;
  setDsList(value: Array<GenericRecord>): void;
  addDs(value?: GenericRecord, index?: number): GenericRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneFile.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneFile): ZoneFile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneFile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneFile;
  static deserializeBinaryFromReader(message: ZoneFile, reader: jspb.BinaryReader): ZoneFile;
}

export namespace ZoneFile {
  export type AsObject = {
    origin: string,
    hasOrigin: boolean,
    ttl: number,
    hasTtl: boolean,
    soa?: SoaRecord.AsObject,
    hasSoa: boolean,
    nsList: Array<NsRecord.AsObject>,
    aList: Array<AddressRecord.AsObject>,
    aaaaList: Array<AddressRecord.AsObject>,
    cnameList: Array<CnameRecord.AsObject>,
    mxList: Array<MxRecord.AsObject>,
    txtList: Array<TxtRecord.AsObject>,
    spfList: Array<TxtRecord.AsObject>,
    ptrList: Array<PtrRecord.AsObject>,
    srvList: Array<SrvRecord.AsObject>,
    caaList: Array<CaaRecord.AsObject>,
    dsList: Array<GenericRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class ListRecordsByTypeInput extends jspb.Message {
  getZoneText(): string;
  setZoneText(value: string): void;

  getRecordType(): string;
  setRecordType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListRecordsByTypeInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListRecordsByTypeInput): ListRecordsByTypeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListRecordsByTypeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListRecordsByTypeInput;
  static deserializeBinaryFromReader(message: ListRecordsByTypeInput, reader: jspb.BinaryReader): ListRecordsByTypeInput;
}

export namespace ListRecordsByTypeInput {
  export type AsObject = {
    zoneText: string,
    recordType: string,
  }
}

export class RecordList extends jspb.Message {
  getRecordType(): string;
  setRecordType(value: string): void;

  clearRecordsList(): void;
  getRecordsList(): Array<GenericRecord>;
  setRecordsList(value: Array<GenericRecord>): void;
  addRecords(value?: GenericRecord, index?: number): GenericRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordList.AsObject;
  static toObject(includeInstance: boolean, msg: RecordList): RecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordList;
  static deserializeBinaryFromReader(message: RecordList, reader: jspb.BinaryReader): RecordList;
}

export namespace RecordList {
  export type AsObject = {
    recordType: string,
    recordsList: Array<GenericRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class ExtractAddressRecordsInput extends jspb.Message {
  getZoneText(): string;
  setZoneText(value: string): void;

  getVersionFilter(): number;
  setVersionFilter(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractAddressRecordsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractAddressRecordsInput): ExtractAddressRecordsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractAddressRecordsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractAddressRecordsInput;
  static deserializeBinaryFromReader(message: ExtractAddressRecordsInput, reader: jspb.BinaryReader): ExtractAddressRecordsInput;
}

export namespace ExtractAddressRecordsInput {
  export type AsObject = {
    zoneText: string,
    versionFilter: number,
  }
}

export class AddressRecordList extends jspb.Message {
  clearRecordsList(): void;
  getRecordsList(): Array<AddressRecord>;
  setRecordsList(value: Array<AddressRecord>): void;
  addRecords(value?: AddressRecord, index?: number): AddressRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressRecordList.AsObject;
  static toObject(includeInstance: boolean, msg: AddressRecordList): AddressRecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressRecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressRecordList;
  static deserializeBinaryFromReader(message: AddressRecordList, reader: jspb.BinaryReader): AddressRecordList;
}

export namespace AddressRecordList {
  export type AsObject = {
    recordsList: Array<AddressRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class MxRecordList extends jspb.Message {
  clearRecordsList(): void;
  getRecordsList(): Array<MxRecord>;
  setRecordsList(value: Array<MxRecord>): void;
  addRecords(value?: MxRecord, index?: number): MxRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MxRecordList.AsObject;
  static toObject(includeInstance: boolean, msg: MxRecordList): MxRecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MxRecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MxRecordList;
  static deserializeBinaryFromReader(message: MxRecordList, reader: jspb.BinaryReader): MxRecordList;
}

export namespace MxRecordList {
  export type AsObject = {
    recordsList: Array<MxRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class NsRecordList extends jspb.Message {
  clearRecordsList(): void;
  getRecordsList(): Array<NsRecord>;
  setRecordsList(value: Array<NsRecord>): void;
  addRecords(value?: NsRecord, index?: number): NsRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NsRecordList.AsObject;
  static toObject(includeInstance: boolean, msg: NsRecordList): NsRecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NsRecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NsRecordList;
  static deserializeBinaryFromReader(message: NsRecordList, reader: jspb.BinaryReader): NsRecordList;
}

export namespace NsRecordList {
  export type AsObject = {
    recordsList: Array<NsRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class CnameRecordList extends jspb.Message {
  clearRecordsList(): void;
  getRecordsList(): Array<CnameRecord>;
  setRecordsList(value: Array<CnameRecord>): void;
  addRecords(value?: CnameRecord, index?: number): CnameRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CnameRecordList.AsObject;
  static toObject(includeInstance: boolean, msg: CnameRecordList): CnameRecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CnameRecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CnameRecordList;
  static deserializeBinaryFromReader(message: CnameRecordList, reader: jspb.BinaryReader): CnameRecordList;
}

export namespace CnameRecordList {
  export type AsObject = {
    recordsList: Array<CnameRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class TxtRecordList extends jspb.Message {
  clearRecordsList(): void;
  getRecordsList(): Array<TxtRecord>;
  setRecordsList(value: Array<TxtRecord>): void;
  addRecords(value?: TxtRecord, index?: number): TxtRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxtRecordList.AsObject;
  static toObject(includeInstance: boolean, msg: TxtRecordList): TxtRecordList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxtRecordList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxtRecordList;
  static deserializeBinaryFromReader(message: TxtRecordList, reader: jspb.BinaryReader): TxtRecordList;
}

export namespace TxtRecordList {
  export type AsObject = {
    recordsList: Array<TxtRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class SpfDkimDmarcRecords extends jspb.Message {
  clearSpfList(): void;
  getSpfList(): Array<TxtRecord>;
  setSpfList(value: Array<TxtRecord>): void;
  addSpf(value?: TxtRecord, index?: number): TxtRecord;

  clearDkimList(): void;
  getDkimList(): Array<TxtRecord>;
  setDkimList(value: Array<TxtRecord>): void;
  addDkim(value?: TxtRecord, index?: number): TxtRecord;

  clearDmarcList(): void;
  getDmarcList(): Array<TxtRecord>;
  setDmarcList(value: Array<TxtRecord>): void;
  addDmarc(value?: TxtRecord, index?: number): TxtRecord;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpfDkimDmarcRecords.AsObject;
  static toObject(includeInstance: boolean, msg: SpfDkimDmarcRecords): SpfDkimDmarcRecords.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SpfDkimDmarcRecords, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpfDkimDmarcRecords;
  static deserializeBinaryFromReader(message: SpfDkimDmarcRecords, reader: jspb.BinaryReader): SpfDkimDmarcRecords;
}

export namespace SpfDkimDmarcRecords {
  export type AsObject = {
    spfList: Array<TxtRecord.AsObject>,
    dkimList: Array<TxtRecord.AsObject>,
    dmarcList: Array<TxtRecord.AsObject>,
    error?: Error.AsObject,
  }
}

export class ZoneDirectives extends jspb.Message {
  getOrigin(): string;
  setOrigin(value: string): void;

  getHasOrigin(): boolean;
  setHasOrigin(value: boolean): void;

  getTtl(): number;
  setTtl(value: number): void;

  getHasTtl(): boolean;
  setHasTtl(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneDirectives.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneDirectives): ZoneDirectives.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneDirectives, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneDirectives;
  static deserializeBinaryFromReader(message: ZoneDirectives, reader: jspb.BinaryReader): ZoneDirectives;
}

export namespace ZoneDirectives {
  export type AsObject = {
    origin: string,
    hasOrigin: boolean,
    ttl: number,
    hasTtl: boolean,
    error?: Error.AsObject,
  }
}

export class RecordTypeCount extends jspb.Message {
  getRecordType(): string;
  setRecordType(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordTypeCount.AsObject;
  static toObject(includeInstance: boolean, msg: RecordTypeCount): RecordTypeCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RecordTypeCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordTypeCount;
  static deserializeBinaryFromReader(message: RecordTypeCount, reader: jspb.BinaryReader): RecordTypeCount;
}

export namespace RecordTypeCount {
  export type AsObject = {
    recordType: string,
    count: number,
  }
}

export class ZoneSummary extends jspb.Message {
  clearCountsByTypeList(): void;
  getCountsByTypeList(): Array<RecordTypeCount>;
  setCountsByTypeList(value: Array<RecordTypeCount>): void;
  addCountsByType(value?: RecordTypeCount, index?: number): RecordTypeCount;

  getTotalRecords(): number;
  setTotalRecords(value: number): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneSummary): ZoneSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneSummary;
  static deserializeBinaryFromReader(message: ZoneSummary, reader: jspb.BinaryReader): ZoneSummary;
}

export namespace ZoneSummary {
  export type AsObject = {
    countsByTypeList: Array<RecordTypeCount.AsObject>,
    totalRecords: number,
    error?: Error.AsObject,
  }
}

export class GenerateZoneFileInput extends jspb.Message {
  hasZone(): boolean;
  clearZone(): void;
  getZone(): ZoneFile | undefined;
  setZone(value?: ZoneFile): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateZoneFileInput.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateZoneFileInput): GenerateZoneFileInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenerateZoneFileInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateZoneFileInput;
  static deserializeBinaryFromReader(message: GenerateZoneFileInput, reader: jspb.BinaryReader): GenerateZoneFileInput;
}

export namespace GenerateZoneFileInput {
  export type AsObject = {
    zone?: ZoneFile.AsObject,
  }
}

export class GenerateZoneFileOutput extends jspb.Message {
  getZoneText(): string;
  setZoneText(value: string): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateZoneFileOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateZoneFileOutput): GenerateZoneFileOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenerateZoneFileOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateZoneFileOutput;
  static deserializeBinaryFromReader(message: GenerateZoneFileOutput, reader: jspb.BinaryReader): GenerateZoneFileOutput;
}

export namespace GenerateZoneFileOutput {
  export type AsObject = {
    zoneText: string,
    error?: Error.AsObject,
  }
}

export class ZoneIssue extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneIssue.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneIssue): ZoneIssue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneIssue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneIssue;
  static deserializeBinaryFromReader(message: ZoneIssue, reader: jspb.BinaryReader): ZoneIssue;
}

export namespace ZoneIssue {
  export type AsObject = {
    code: string,
    message: string,
  }
}

export class ZoneValidationResult extends jspb.Message {
  getIsValid(): boolean;
  setIsValid(value: boolean): void;

  getHasSoa(): boolean;
  setHasSoa(value: boolean): void;

  getHasNs(): boolean;
  setHasNs(value: boolean): void;

  getSerialIsNumeric(): boolean;
  setSerialIsNumeric(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<ZoneIssue>;
  setIssuesList(value: Array<ZoneIssue>): void;
  addIssues(value?: ZoneIssue, index?: number): ZoneIssue;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ZoneValidationResult.AsObject;
  static toObject(includeInstance: boolean, msg: ZoneValidationResult): ZoneValidationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ZoneValidationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ZoneValidationResult;
  static deserializeBinaryFromReader(message: ZoneValidationResult, reader: jspb.BinaryReader): ZoneValidationResult;
}

export namespace ZoneValidationResult {
  export type AsObject = {
    isValid: boolean,
    hasSoa: boolean,
    hasNs: boolean,
    serialIsNumeric: boolean,
    issuesList: Array<ZoneIssue.AsObject>,
    error?: Error.AsObject,
  }
}

export class RecordNames extends jspb.Message {
  clearNamesList(): void;
  getNamesList(): Array<string>;
  setNamesList(value: Array<string>): void;
  addNames(value: string, index?: number): string;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordNames.AsObject;
  static toObject(includeInstance: boolean, msg: RecordNames): RecordNames.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RecordNames, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordNames;
  static deserializeBinaryFromReader(message: RecordNames, reader: jspb.BinaryReader): RecordNames;
}

export namespace RecordNames {
  export type AsObject = {
    namesList: Array<string>,
    error?: Error.AsObject,
  }
}

export class NormalizeRecordNameInput extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getOrigin(): string;
  setOrigin(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NormalizeRecordNameInput.AsObject;
  static toObject(includeInstance: boolean, msg: NormalizeRecordNameInput): NormalizeRecordNameInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NormalizeRecordNameInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NormalizeRecordNameInput;
  static deserializeBinaryFromReader(message: NormalizeRecordNameInput, reader: jspb.BinaryReader): NormalizeRecordNameInput;
}

export namespace NormalizeRecordNameInput {
  export type AsObject = {
    name: string,
    origin: string,
  }
}

export class NormalizedRecordName extends jspb.Message {
  getFqdn(): string;
  setFqdn(value: string): void;

  getRelative(): string;
  setRelative(value: string): void;

  getWasFqdn(): boolean;
  setWasFqdn(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): Error | undefined;
  setError(value?: Error): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NormalizedRecordName.AsObject;
  static toObject(includeInstance: boolean, msg: NormalizedRecordName): NormalizedRecordName.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NormalizedRecordName, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NormalizedRecordName;
  static deserializeBinaryFromReader(message: NormalizedRecordName, reader: jspb.BinaryReader): NormalizedRecordName;
}

export namespace NormalizedRecordName {
  export type AsObject = {
    fqdn: string,
    relative: string,
    wasFqdn: boolean,
    error?: Error.AsObject,
  }
}

