import { NextResponse } from "next/server";
import { resolveSuiNs } from "@/lib/sui/rpc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/resolve?name=alice.sui
 * Returns { address } or { address: null } when SuiNS has no record.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name")?.trim().toLowerCase();
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const address = await resolveSuiNs(name);
  return NextResponse.json({ address });
}
