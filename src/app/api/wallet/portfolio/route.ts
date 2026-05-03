import { NextResponse } from "next/server";
import {
  buildRealPortfolio,
  PortfolioBuildError,
} from "@/lib/portfolio/buildPortfolio";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mergeTimeoutSignal(req: Request): AbortSignal {
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([AbortSignal.timeout(25_000), req.signal]);
  }
  return AbortSignal.timeout(25_000);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("address")?.trim() ?? "";
  const address = normalizeSuiAddress(raw);
  if (!isValidSuiAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  console.log({ address, stage: "start" });

  const signal = mergeTimeoutSignal(req);

  try {
    const data = await buildRealPortfolio(address, signal);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const stage: string =
      e instanceof PortfolioBuildError ? e.stage : "unknown";
    console.error(JSON.stringify({ address, stage, error: msg }));
    return NextResponse.json({ error: msg, stage }, { status: 502 });
  }
}
