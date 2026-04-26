import { NextResponse } from "next/server";
import { buildRealPortfolio } from "@/lib/portfolio/buildPortfolio";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("address")?.trim() ?? "";
  const address = normalizeSuiAddress(raw);
  if (!isValidSuiAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }
  try {
    const data = await buildRealPortfolio(address);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
