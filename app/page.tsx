"use client";

import { useCallback, useEffect, useState } from "react";

const C_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    long n = 100000000; // 100 juta elemen
    double *a = (double*)malloc(n * sizeof(double));
    if (a == NULL) {
        printf("Gagal mengalokasikan memori!\\n");
        return 1;
    }

    for (long i = 0; i < n; i++) a[i] = 1.0;

    clock_t start = clock();
    double sum = 0.0;
    for (long i = 0; i < n; i++) sum += a[i];
    clock_t end = clock();

    printf("Hasil penjumlahan: %.2f\\n", sum);
    printf("Waktu eksekusi sekuensial: %.4f detik\\n", (double)(end - start) / CLOCKS_PER_SEC);

    free(a);
    return 0;
}`;

type BaselineRow = {
  id: string;
  nama: string;
  nim: string;
  time10: number;
  time50: number;
  time100: number;
  createdAt: string;
};

export default function Home() {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [time10, setTime10] = useState("");
  const [time50, setTime50] = useState("");
  const [time100, setTime100] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [history, setHistory] = useState<BaselineRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/baseline", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setHistory(json.data);
    } catch {
      // abaikan — DB mungkin belum dikonfigurasi
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(C_CODE);
      alert("Kode C berhasil disalin ke clipboard!");
    } catch {
      alert("Gagal menyalin. Blok manual kode di bawah.");
    }
  }

  async function simpanBaseline() {
    setMessage(null);
    if (!nama.trim() || !nim.trim() || !time10 || !time50 || !time100) {
      setMessage({ type: "error", text: "Harap isi Nama, NIM, dan ketiga variasi waktu eksekusi!" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama.trim(),
          nim: nim.trim(),
          time10: Number(time10),
          time50: Number(time50),
          time100: Number(time100),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setMessage({ type: "error", text: json.error ?? "Gagal menyimpan ke database." });
      } else {
        setMessage({
          type: "success",
          text: `Baseline ${nama} (${nim}) tersimpan! Siap jadi pembanding modul berikutnya.`,
        });
        setTime10("");
        setTime50("");
        setTime100("");
        await loadHistory();
      }
    } catch {
      setMessage({ type: "error", text: "Gagal terhubung ke server. Coba lagi." });
    } finally {
      setSaving(false);
    }
  }

  const statusBadge = (v: string) =>
    v ? <span className="badge-valid">✓ Valid ({v}s)</span> : <span className="badge-pending">Belum diisi</span>;

  return (
    <>
      <header className="site-header">
        <p>Universitas Muhammadiyah Sukabumi - Teknik Informatika</p>
        <h1>BUKU PETUNJUK PRAKTIKUM WEB</h1>
        <p>Sistem Paralel dan Database Terdistribusi | Modul 1: Konsep Dasar Sistem Paralel &amp; Terdistribusi</p>
      </header>

      <div className="container">
        <nav className="sidebar">
          <h3>Daftar Isi Modul</h3>
          <a href="#tujuan" className="nav-link">A. Tujuan &amp; Alat</a>
          <a href="#teori" className="nav-link">B. Dasar Teori</a>
          <a href="#langkah" className="nav-link">C. Langkah Praktikum</a>
          <a href="#simulasi" className="nav-link">D. Form Baseline</a>
          <a href="#tugas" className="nav-link">E. Tugas Mandiri</a>
          <a href="#rubrik" className="nav-link">F. Kriteria Penilaian</a>
        </nav>

        <main className="content">
          <section id="tujuan" className="card-section">
            <h2 className="section-title">A. Tujuan Praktikum &amp; Alat/Bahan</h2>
            <h3 className="sub-title">Tujuan Praktikum</h3>
            <ul className="list">
              <li>Mahasiswa mampu menjelaskan perbedaan komputasi paralel, komputasi terdistribusi, komputasi grid, dan komputasi cloud.</li>
              <li>Mahasiswa mampu mengidentifikasi arsitektur sistem <i>centralized</i>, <i>decentralized</i>, dan <i>hybrid</i>.</li>
              <li>Mahasiswa mampu melakukan pengukuran waktu eksekusi program sekuensial sebagai <i>baseline</i> pembanding.</li>
            </ul>
            <h3 className="sub-title">Alat dan Bahan</h3>
            <ul className="list">
              <li>Terminal Ubuntu pada WSL2 (Windows Subsystem for Linux 2).</li>
              <li>Compiler C/C++ (<code>GCC/G++</code>).</li>
              <li>Text Editor (VS Code dengan ekstensi WSL atau Nano/Vim).</li>
            </ul>
          </section>

          <section id="teori" className="card-section">
            <h2 className="section-title">B. Dasar Teori Singkat</h2>
            <p><b>Sistem Paralel</b> adalah sistem komputasi yang menjalankan banyak operasi secara bersamaan pada satu mesin dengan banyak core CPU/GPU. <b>Sistem Terdistribusi</b> adalah kumpulan komputer otonom yang terhubung jaringan dan tampak sebagai satu sistem tunggal.</p>
            <div className="card-grid">
              <div className="card"><h4>Sistem Paralel</h4><p>Berbagi memori (shared memory), komunikasi antarcore sangat cepat.</p></div>
              <div className="card"><h4>Sistem Terdistribusi</h4><p>Memori terdistribusi, komunikasi antar-node melalui jaringan.</p></div>
              <div className="card"><h4>Komputasi Grid</h4><p>Sumber daya tersebar geografis, dikelola organisasi berbeda (HPC).</p></div>
              <div className="card"><h4>Komputasi Cloud</h4><p>Layanan sumber daya komputasi &amp; penyimpanan <i>on-demand</i> terkelola.</p></div>
            </div>
            <h3 className="sub-title">Taksonomi Flynn</h3>
            <ul className="list">
              <li><b>SISD:</b> Komputer sekuensial tradisional (Single Instruction, Single Data).</li>
              <li><b>SIMD:</b> Instruksi sama dieksekusi pada banyak data secara bersamaan (misal GPU).</li>
              <li><b>MISD:</b> Banyak instruksi pada satu data (jarang digunakan).</li>
              <li><b>MIMD:</b> Banyak prosesor independen mengeksekusi instruksi &amp; data berbeda.</li>
            </ul>
            <h3 className="sub-title">Arsitektur Sistem Terdistribusi</h3>
            <p>Terdiri dari <b>Centralized</b> (satu titik kendali/server pusat), <b>Decentralized</b> (P2P, setiap node setara), dan <b>Hybrid</b> (kombinasi Master-Worker).</p>
          </section>

          <section id="langkah" className="card-section">
            <h2 className="section-title">C. Langkah-Langkah Praktikum</h2>
            <h3 className="sub-title">Langkah 1: Membuat Program Sekuensial Baseline</h3>
            <p>Buat berkas <code>sequential_sum.c</code> untuk menjumlahkan elemen array besar secara sekuensial dan mengukur waktu eksekusinya:</p>
            <div className="code-container">
              <button className="copy-btn" onClick={copyCode}>Copy Kode</button>
              <pre className="code-block"><code>{C_CODE}</code></pre>
            </div>
            <h3 className="sub-title">Langkah 2: Kompilasi dan Eksekusi</h3>
            <p>Jalankan perintah berikut pada terminal WSL2 Ubuntu:</p>
            <div className="code-container">
              <pre className="code-block"><code>{`cd ~/praktikum-paralel\ngcc -O2 sequential_sum.c -o sequential_sum\n./sequential_sum`}</code></pre>
            </div>
            <h3 className="sub-title">Langkah 3: Diskusi Studi Kasus Arsitektur</h3>
            <ul className="list">
              <li><b>Centralized:</b> Sistem Perbankan Utama (Core Banking).</li>
              <li><b>Decentralized:</b> Jaringan Blockchain dan BitTorrent.</li>
              <li><b>Hybrid:</b> Framework MapReduce/Hadoop dengan Master-Worker node.</li>
            </ul>
          </section>

          <section id="simulasi" className="card-section">
            <h2 className="section-title">D. Simulator &amp; Form Pengujian Baseline</h2>
            <p>Gunakan form ini untuk mencatat waktu eksekusi sekuensial hasil uji di WSL2. Data tersimpan ke <b>Postgres</b> sebagai acuan baseline:</p>
            <div className="form-grid">
              <div>
                <label>Nama Mahasiswa</label>
                <input className="input" type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label>NIM</label>
                <input className="input" type="text" value={nim} onChange={(e) => setNim(e.target.value)} placeholder="Contoh: 232101001" />
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Ukuran Data (<i>n</i>)</th><th>Waktu Eksekusi (detik)</th><th>Status Baseline</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>10 Juta (10.000.000)</td>
                  <td><input className="input" type="number" step="0.0001" min="0" value={time10} onChange={(e) => setTime10(e.target.value)} placeholder="Contoh: 0.025" /></td>
                  <td>{statusBadge(time10)}</td>
                </tr>
                <tr>
                  <td>50 Juta (50.000.000)</td>
                  <td><input className="input" type="number" step="0.0001" min="0" value={time50} onChange={(e) => setTime50(e.target.value)} placeholder="Contoh: 0.120" /></td>
                  <td>{statusBadge(time50)}</td>
                </tr>
                <tr>
                  <td>100 Juta (100.000.000)</td>
                  <td><input className="input" type="number" step="0.0001" min="0" value={time100} onChange={(e) => setTime100(e.target.value)} placeholder="Contoh: 0.245" /></td>
                  <td>{statusBadge(time100)}</td>
                </tr>
              </tbody>
            </table>
            <button className="action-btn" onClick={simpanBaseline} disabled={saving}>
              {saving ? "Menyimpan..." : "Validasi & Simpan Hasil Baseline"}
            </button>
            {message && <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>{message.text}</div>}

            <h3 className="sub-title">Riwayat Baseline (dari Database)</h3>
            {loadingHistory ? (
              <p>Memuat riwayat...</p>
            ) : history.length === 0 ? (
              <p className="badge-pending">Belum ada data tersimpan (atau database belum dikonfigurasi).</p>
            ) : (
              <div className="history-list">
                {history.map((h) => (
                  <div key={h.id} className="history-item">
                    <span><b>{h.nama}</b> ({h.nim})</span>
                    <span>10jt: {h.time10}s • 50jt: {h.time50}s • 100jt: {h.time100}s</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="tugas" className="card-section">
            <h2 className="section-title">E. Tugas dan Latihan Mandiri</h2>
            <ol className="list">
              <li>Jalankan program <code>sequential_sum.c</code> dengan tiga ukuran data berbeda (<i>n</i> = 10 juta, 50 juta, 100 juta) dan buat tabel perbandingan waktu eksekusinya.</li>
              <li>Buatlah diagram sederhana yang menggambarkan arsitektur <i>centralized</i>, <i>decentralized</i>, dan <i>hybrid</i> beserta contoh penerapan nyata dari masing-masing arsitektur tersebut.</li>
            </ol>
          </section>

          <section id="rubrik" className="card-section">
            <h2 className="section-title">F. Kriteria Penilaian</h2>
            <table className="data-table">
              <thead><tr><th>Aspek Penilaian</th><th>Bobot</th><th>Deskripsi</th></tr></thead>
              <tbody>
                <tr><td><b>Ketepatan Konsep</b></td><td>40%</td><td>Mahasiswa mampu membedakan komputasi paralel, terdistribusi, grid, dan cloud secara tepat.</td></tr>
                <tr><td><b>Hasil Pengujian Baseline</b></td><td>40%</td><td>Program sekuensial berhasil dikompilasi, dijalankan, dan waktu eksekusi dicatat secara valid.</td></tr>
                <tr><td><b>Kualitas Laporan</b></td><td>20%</td><td>Diagram arsitektur dan tabel hasil disajikan secara rapi, sistematis, dan sesuai instruksi.</td></tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>

      <footer className="site-footer">
        <p>&copy; 2026 - Modul Praktikum Web Sistem Paralel &amp; Terdistribusi | Universitas Muhammadiyah Sukabumi</p>
      </footer>
    </>
  );
}
