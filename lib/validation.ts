export type BaselineInput = {
  nama: string;
  nim: string;
  time10: number;
  time50: number;
  time100: number;
};

export function validateBaseline(body: unknown): { ok: true; data: BaselineInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Body harus berupa JSON object." };
  }
  const b = body as Record<string, unknown>;
  const nama = String(b.nama ?? "").trim();
  const nim = String(b.nim ?? "").trim();
  const time10 = Number(b.time10);
  const time50 = Number(b.time50);
  const time100 = Number(b.time100);

  if (nama.length < 2 || nama.length > 100) return { ok: false, error: "Nama minimal 2 karakter." };
  if (nim.length < 3 || nim.length > 30) return { ok: false, error: "NIM minimal 3 karakter." };
  for (const [label, v] of [["time10", time10], ["time50", time50], ["time100", time100]] as const) {
    if (!Number.isFinite(v) || v <= 0 || v > 3600) {
      return { ok: false, error: `Waktu ${label} harus angka 0–3600 detik.` };
    }
  }
  return { ok: true, data: { nama, nim, time10, time50, time100 } };
}
