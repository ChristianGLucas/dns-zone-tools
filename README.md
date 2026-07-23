# dns-zone-tools

Deterministic parsing, inspection, and generation of DNS zone files (BIND /
RFC 1035 master-file format), for the Axiom marketplace.

Every node is a pure text transform: the zone file is always supplied as a
string by the caller. There is no DNS resolution, no network queries, no
wall-clock, and no randomness — these nodes parse and generate zone-file
*text*, they never resolve a name.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/dns-zone-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/dns-zone-tools/ParseZoneFile --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/dns-zone-tools/0.1.0/ParseZoneFile \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/dns-zone-tools/ParseZoneFile`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## What it wraps

The parsing/generation algorithm is a vendored, in-tree TypeScript port of
[`dns-zonefile`](https://github.com/elgs/dns-zonefile) (ISC license, zero
runtime dependencies). It is ported in-tree rather than depended on as an
npm package because the upstream package is ESM-only (`"type": "module"`)
while this Axiom TypeScript package compiles to CommonJS — depending on it
directly would rely on Node's experimental synchronous require-of-ESM
interop, which is not something to bet a deployed runtime on. The parsing
and generation logic is unchanged from upstream aside from adding
TypeScript types. The upstream ISC license notice is preserved in
`nodes/vendor/dnsZonefile.ts` and reproduced in full in
`DNS_ZONEFILE_LICENSE.txt`.

## Nodes

- **ParseZoneFile** — parse a full zone file into a structured record set
  grouped by type (SOA, NS, A, AAAA, CNAME, MX, TXT, SPF, PTR, SRV, CAA,
  DS) plus the `$ORIGIN`/`$TTL` directives.
- **ExtractSoa** — just the SOA (Start of Authority) record.
- **ListRecordsByType** — every record of one caller-chosen type, including
  types without a dedicated node (SRV, PTR, CAA, SPF, DS).
- **ExtractAddressRecords** — every A and/or AAAA record, name -> address.
- **ExtractMxRecords** — every MX record, sorted ascending by preference.
- **ExtractNsRecords** — every NS record.
- **ExtractCnameRecords** — every CNAME record, alias -> target.
- **ExtractTxtRecords** — every TXT record, quotes stripped.
- **FindSpfDkimDmarcRecords** — TXT records classified as SPF/DKIM/DMARC by
  marker-prefix string match (not policy validation).
- **ExtractDirectives** — just the `$ORIGIN`/`$TTL` directive values.
- **CountRecordsByType** — a per-type + total record count summary.
- **GenerateZoneFile** — generate zone file text from a structured record
  set (the inverse of ParseZoneFile).
- **ValidateZoneStructure** — basic structural sanity checks (has SOA, has
  NS, numeric serial) with a list of specific issues found.
- **ExtractRecordNames** — every distinct declared name/host in the zone.
- **NormalizeRecordName** — resolve a record name to its FQDN and relative
  forms against a given `$ORIGIN`.

## Safety

Input is bounded (2 MiB of zone text, 20,000 records); a malformed zone
file returns a structured error rather than crashing.

## License

MIT — Copyright (c) 2026 Christian George Lucas. See `LICENSE`. The
vendored `dns-zonefile` parsing/generation algorithm carries its own ISC
license notice — see `DNS_ZONEFILE_LICENSE.txt`.

Built for the Axiom marketplace.
