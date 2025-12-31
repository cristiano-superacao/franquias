import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body?.username || "").trim().toLowerCase();
    const password = String(body?.password || "").trim();

    if (!username) return NextResponse.json({ error: "Informe seu usuário ou email." }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Informe sua senha." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });

    let dbUser = null as null | { email: string; name: string | null; password: string; role: string };
    const email = username;
    if (isEmail(email)) {
      const found = await prisma.user.findUnique({ where: { email } });
      if (found) dbUser = { email: found.email, name: found.name, password: found.password, role: found.role };
    } else {
      // Tenta como email mesmo sem @ (para compatibilidade do input)
      const found = await prisma.user.findUnique({ where: { email } });
      if (found) dbUser = { email: found.email, name: found.name, password: found.password, role: found.role };
    }

    if (dbUser) {
      const ok = await bcrypt.compare(password, dbUser.password);
      if (!ok) return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
      return NextResponse.json({ ok: true, user: { username: dbUser.email, role: dbUser.role, name: dbUser.name } });
    }

    // Fallback estático para usuários legacy
    const FALLBACKS: Array<{ username: string; password: string; role: string }> = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "admin@vendacerta.com", password: "admin123", role: "admin" },
      { username: "gerente", password: "gerente123", role: "manager" },
    ];
    const legacy = FALLBACKS.find(u => u.username.toLowerCase() === username && u.password === password);
    if (legacy) {
      return NextResponse.json({ ok: true, user: { username: legacy.username, role: legacy.role } });
    }

    return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao autenticar" }, { status: 500 });
  }
}
