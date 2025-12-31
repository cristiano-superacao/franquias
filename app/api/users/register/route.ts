import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "").trim();

    if (!name) return NextResponse.json({ error: "Informe seu nome completo." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Já existe uma conta com este email." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "user",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Falha ao criar conta." }, { status: 500 });
  }
}
