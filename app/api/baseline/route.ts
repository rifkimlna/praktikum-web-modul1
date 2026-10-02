import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateBaseline } from "@/lib/validation";

export async function GET() {
  try {
    const data = await db.baselineResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("GET /api/baseline error:", e);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil data. Cek DATABASE_URL." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = validateBaseline(body);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    const saved = await db.baselineResult.create({ data: parsed.data });
    return NextResponse.json({ ok: true, data: saved }, { status: 201 });
  } catch (e) {
    console.error("POST /api/baseline error:", e);
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan. Pastikan database sudah di-migrate (prisma db push)." },
      { status: 500 }
    );
  }
}
