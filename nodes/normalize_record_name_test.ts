import { NormalizeRecordNameInput } from '../gen/messages_pb';
import { normalizeRecordName } from './normalize_record_name';
import { testContext } from './testctx';

function makeInput(name: string, origin: string): NormalizeRecordNameInput {
  const input = new NormalizeRecordNameInput();
  input.setName(name);
  input.setOrigin(origin);
  return input;
}

describe('NormalizeRecordName', () => {
  it('resolves a relative label against origin to its FQDN', () => {
    const result = normalizeRecordName(testContext, makeInput('www', 'example.com.'));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('www.example.com.');
    expect(result.getRelative()).toBe('www');
    expect(result.getWasFqdn()).toBe(false);
  });

  it('resolves "@" to the origin itself', () => {
    const result = normalizeRecordName(testContext, makeInput('@', 'example.com.'));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('example.com.');
    expect(result.getRelative()).toBe('@');
  });

  it('passes through an already-FQDN name unchanged, and computes its relative form', () => {
    const result = normalizeRecordName(testContext, makeInput('www.example.com.', 'example.com.'));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('www.example.com.');
    expect(result.getRelative()).toBe('www');
    expect(result.getWasFqdn()).toBe(true);
  });

  it('accepts an origin without a trailing dot, normalizing it', () => {
    const result = normalizeRecordName(testContext, makeInput('www', 'example.com'));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('www.example.com.');
  });

  it('returns the FQDN as its own relative form (minus trailing dot) when it falls outside origin', () => {
    const result = normalizeRecordName(testContext, makeInput('www.other.org.', 'example.com.'));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('www.other.org.');
    expect(result.getRelative()).toBe('www.other.org');
  });

  it('returns a structured error for an empty name', () => {
    const result = normalizeRecordName(testContext, makeInput('', 'example.com.'));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('EMPTY_NAME');
  });

  it('returns a structured error when a relative name has no origin to resolve against', () => {
    const result = normalizeRecordName(testContext, makeInput('www', ''));
    expect(result.hasError()).toBe(true);
    expect(result.getError()!.getCode()).toBe('MISSING_ORIGIN');
  });

  it('does not require origin for an already-FQDN name', () => {
    const result = normalizeRecordName(testContext, makeInput('www.example.com.', ''));
    expect(result.hasError()).toBe(false);
    expect(result.getFqdn()).toBe('www.example.com.');
  });
});
