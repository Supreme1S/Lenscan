import { NextResponse } from "next/server";
import { fetchRealTransactions } from "@/lib/transactions/buildTransactions";
import { mapTransactionRowsToUi } from "@/lib/transactions/mapTxToUi";
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
  const rawLimit = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(rawLimit)
    ? Math.min(100, Math.max(1, Math.floor(rawLimit)))
    : 50;
  const rawCursor = url.searchParams.get("cursor");
  const cursor = rawCursor != null && rawCursor.trim() !== "" ? rawCursor.trim() : null;
  try {
    const result = await fetchRealTransactions(address, limit, undefined, cursor);
    return NextResponse.json({
      transactions: mapTransactionRowsToUi(result.rows),
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
