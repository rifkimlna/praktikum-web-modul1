# Praktikum Web Modul 1 — Sistem Paralel & Terdistribusi
# Universitas Muhammadiyah Sukabumi — Teknik Informatika

Aplikasi Next.js (App Router) + Postgres (Prisma) untuk Buku Petunjuk Praktikum Web Modul 1.
Migrasi dari `praktikum1.html` statis menjadi aplikasi fullstack yang bisa menyimpan data baseline.

## Fitur
- Halaman modul 1: Tujuan, Teori, Langkah Praktikum, Form Baseline, Tugas, Rubrik
- Form Baseline dengan Nama + NIM + waktu eksekusi (10jt / 50jt / 100jt) → tersimpan ke Postgres
- API: `GET /api/baseline`, `POST /api/baseline`
- Riwayat hasil baseline dari database
- Copy kode C sekali klik
- Siap deploy ke Vercel + Vercel Postgres / Neon

## Jalankan lokal

1. Install:
```bash
npm install
```

2. Copy env:
```bash
copy .env.example .env
# isi DATABASE_URL dengan connection string Postgres kamu
```

3. Push schema ke DB (paling mudah, tanpa migrate):
```bash
npx prisma db push
```

4. Dev:
```bash
npm run dev
# buka http://localhost:3000
```

## Database (Vercel Postgres)

Opsi yang dipilih: **Vercel Postgres** (ditenagai Neon).

1. Buka dashboard Vercel → Storage → Create → Postgres
2. Copy `DATABASE_URL` dan `DIRECT_URL` (pooled + direct) ke:
   - `.env` lokal
   - Project Settings → Environment Variables di Vercel
3. Lihat `prisma/schema.prisma` untuk model `BaselineResult`.

Alternatif gratis: Neon (neon.tech) atau Supabase — sama-sama Postgres, tinggal ganti `DATABASE_URL`.

## Deploy ke Vercel

```bash
npm run build
# push ke GitHub, lalu Import di vercel.com
# set env: DATABASE_URL, DIRECT_URL
# setelah deploy, jalankan sekali via Vercel CLI atau dari lokal:
npx prisma db push --schema ./prisma/schema.prisma
```

## Push ke GitHub

Git belum terinstall di mesin ini. Install dulu dari https://git-scm.com/download/win,
lalu dari folder `praktikum-web-modul1`:

```bash
git init
git add .
git commit -m "feat: migrasi modul1 ke Next.js + Postgres"
git branch -M main
git remote add origin https://github.com/USERNAME/praktikum-web-modul1.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

## Struktur

```
app/
  layout.tsx        → layout global + metadata
  page.tsx          → halaman modul (client component + form baseline)
  globals.css       → style migrasi dari HTML asli
  api/baseline/route.ts → GET + POST baseline
lib/
  db.ts             → Prisma singleton
  validation.ts     → validasi sederhana
prisma/
  schema.prisma     → model BaselineResult
```

## Skema Data

```prisma
model BaselineResult {
  id        String   @id @default(cuid())
  nama      String
  nim       String
  time10    Float
  time50    Float
  time100   Float
  createdAt DateTime @default(now())
}
```
