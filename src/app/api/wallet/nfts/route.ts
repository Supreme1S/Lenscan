import { NextResponse } from "next/server";
import { fetchRealNfts } from "@/lib/nfts/buildNfts";
import { groupNftItems } from "@/lib/nfts/groupNftCollections";
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
    const result = await fetchRealNfts(address);
    return NextResponse.json({
      collections: groupNftItems(result.items),
      scanned: result.scanned,
      truncated: result.truncated,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
