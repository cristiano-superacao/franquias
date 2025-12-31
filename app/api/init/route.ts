import { NextResponse } from "next/server";
import { bootstrapDb } from "../../../lib/bootstrap";
import { getEnvReport } from "../../../lib/env";

export async function POST() {
  try {
    const env = getEnvReport();
    if (!env.allowDbSync) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 403 });
    }
    await bootstrapDb();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'erro' }, { status: 500 });
  }
}
