#!/usr/bin/env node
/**
 * Fetches recent mainnet transaction senders (excluding 0x0) and writes
 * `src/data/top-sui-wallets.generated.json` for the "Random wallet" home action.
 *
 * Usage: node scripts/fetch-top-wallets.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/top-sui-wallets.generated.json");

const RPC = "https://fullnode.mainnet.sui.io";
const ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
const TARGET = 500;
const MAX_CHECKPOINTS = 600;

async function rpc(method, params) {
  const r = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

function chunk(a, n) {
  const out = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

async function main() {
  const latest = BigInt(await rpc("sui_getLatestCheckpointSequenceNumber", []));
  const senders = new Set();
  let seq = latest;
  let cps = 0;

  while (senders.size < TARGET + 20 && cps < MAX_CHECKPOINTS) {
    const digests = [];
    for (let k = 0; k < 10 && digests.length < 100; k++) {
      const cp = await rpc("sui_getCheckpoint", [String(seq)]);
      seq -= 1n;
      cps++;
      for (const d of cp.transactions ?? []) digests.push(d);
    }
    for (const part of chunk(digests, 25)) {
      const blocks = await rpc("sui_multiGetTransactionBlocks", [
        part,
        { showInput: true },
      ]);
      for (const tx of blocks) {
        const s = tx?.transaction?.data?.sender;
        if (s && s !== ZERO && /^0x[a-fA-F0-9]{64}$/.test(s)) senders.add(s);
      }
    }
  }

  const addresses = [...senders].slice(0, TARGET);
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "sui_mainnet_checkpoint_senders",
    checkpointsScanned: cps,
    addresses,
  };
  writeFileSync(OUT, JSON.stringify(payload));
  console.log(`Wrote ${addresses.length} addresses to ${OUT} (${cps} checkpoints)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
