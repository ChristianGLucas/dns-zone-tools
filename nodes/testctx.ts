// Shared AxiomContext mock for node unit tests. Not a node itself and not a
// test file (jest's testMatch is nodes/**/*_test.ts), just shared fixture
// code the *_test.ts files import.

import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export const testContext: AxiomContext = {
  log: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  } satisfies AxiomLogger,
  secrets: {
    get: (_name: string): [string, boolean] => ['', false],
  } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

// A realistic, fully-populated BIND/RFC1035 zone file fixture reused across
// node tests, covering every record type this package handles.
export const SAMPLE_ZONE = `
$ORIGIN example.com.
$TTL 3600

@   IN  SOA   ns1.example.com. admin.example.com. (
        2024031501 ;serial
        7200       ;refresh
        3600       ;retry
        1209600    ;expire
        3600       ;minimum
)

@       IN  NS      ns1.example.com.
@       IN  NS      ns2.example.com.

@       IN  MX  20  mail2.example.com.
@       IN  MX  10  mail1.example.com.

www     IN  A       192.0.2.10
www     IN  AAAA    2001:db8::10
mail1   IN  A       192.0.2.20
mail2   IN  A       192.0.2.21

blog    IN  CNAME   www.example.com.

@       IN  TXT     "v=spf1 include:_spf.example.com ~all"
selector1._domainkey IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC"
_dmarc  IN  TXT     "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
other   IN  TXT     "just some plain text"

_sip._tcp IN SRV 10 60 5060 sipserver.example.com.

host1   IN  CAA     0 issue "letsencrypt.org"
`;

// A minimal zone file that has no SOA/NS records at all, for validation and
// error-path tests.
export const SOA_LESS_ZONE = `
$ORIGIN broken.example.
www IN A 192.0.2.1
`;
