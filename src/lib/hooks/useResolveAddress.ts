"use client";

import { useState } from "react";
import {
  isPlausibleSuiAddress,
  normalizeSuiAddress,
} from "@/lib/sui/address";

export type ResolveResult =
  | { kind: "address"; address: string }
  | { kind: "suins"; address: string; name: string }
  | { kind: "invalid" };

const SUINS_RE = /^[a-z0-9-]+\.sui$/i;

export function useResolveAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolve(rawInput: string): Promise<ResolveResult> {
    const raw = rawInput.trim();
    setError(null);
    if (!raw) return { kind: "invalid" };

    if (isPlausibleSuiAddress(raw)) {
      return { kind: "address", address: normalizeSuiAddress(raw) };
    }

    if (SUINS_RE.test(raw)) {
      setLoading(true);
      try {
        const res = await fetch(`/api/resolve?name=${encodeURIComponent(raw.toLowerCase())}`);
        const json = (await res.json()) as { address: string | null };
        if (json.address) {
          return { kind: "suins", address: json.address, name: raw.toLowerCase() };
        }
        setError(`SuiNS name "${raw}" doesn't resolve.`);
        return { kind: "invalid" };
      } catch {
        setError("SuiNS lookup failed.");
        return { kind: "invalid" };
      } finally {
        setLoading(false);
      }
    }

    setError("Enter a Sui address (0x…) or a SuiNS name (alice.sui).");
    return { kind: "invalid" };
  }

  return { resolve, loading, error };
}
