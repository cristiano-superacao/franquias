import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  try {
    const ping = await (prisma as any).$queryRaw`SELECT 1 as ok`;
    const lojasCount = await (prisma as any).loja.count();
    return NextResponse.json({ ok: true, ping, lojasCount }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "DB indisponível" }, { status: 500 });
  }
}
