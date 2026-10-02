# Panduan Deploy ke Vercel + Push ke GitHub
# Repo target: praktikum-web-modul1

## 1. Install Git (wajib — saat ini belum ada di laptop ini)

Download: https://git-scm.com/download/win
Install default, lalu restart terminal dan cek:

```powershell
git --version
```

## 2. Buat database Vercel Postgres

Pilih salah satu (sama-sama Postgres):

**A. Vercel Postgres (disarankan, sesuai pilihan kamu)**
1. Buka https://vercel.com/dashboard → Storage → Create → Postgres
2. Setelah jadi, buka tab `.env.local` → copy `DATABASE_URL` + `DIRECT_URL`
3. Masukkan ke file `.env` lokal dan ke Vercel Project → Settings → Environment Variables

**B. Alternatif gratis: Neon**
1. https://neon.tech → Create project → copy connection string
2. Format: `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`
3. Isi ke `DATABASE_URL` dan `DIRECT_URL` (isi sama untuk awal)

## 3. Push schema ke database (sekali saja)

Dari folder `praktikum-web-modul1`:

```powershell
copy .env.example .env
# edit .env, isi DATABASE_URL + DIRECT_URL yang asli
npx prisma db push
```

Cek: `npx prisma studio` untuk lihat tabel `baseline_results`.

## 4. Push ke GitHub

```powershell
cd C:\Project\Sistem-Paralel\praktikum-web-modul1
git init
git add .
git commit -m "feat: migrasi modul1 ke Next.js + Postgres"
git branch -M main
git remote add origin https://github.com/USERNAME/praktikum-web-modul1.git
git push -u origin main
```

Ganti USERNAME dengan username GitHub. Buat repo kosong dulu di github.com/new dengan nama `praktikum-web-modul1` (tanpa README).

## 5. Deploy ke Vercel

1. Buka https://vercel.com/new → Import `praktikum-web-modul1` dari GitHub
2. Framework: Next.js (auto-detect)
3. Build command: `npm run build` (default, sudah termasuk `prisma generate`)
4. Environment Variables: tambah `DATABASE_URL` + `DIRECT_URL`
5. Deploy → selesai, dapat URL `https://praktikum-web-modul1.vercel.app`
6. Uji: isi form baseline (Nama+NIM+waktu) → cek tersimpan + muncul di Riwayat.

## Troubleshooting

- `P1001 Can't reach database`: DATABASE_URL salah / IP blocked / sslmode hilang (`?sslmode=require` untuk Neon).
- Build Vercel gagal `prisma`: pastikan `postinstall: prisma generate` ada (sudah ada di package.json).
- `DirectUrl` warning: isi DIRECT_URL sama dengan DATABASE_URL kalau pakai Neon tanpa pooling.
