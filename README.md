# 🛠️ shadcn-explore

Media eksplorasi interaktif untuk komponen antarmuka pengguna (**shadcn/ui**, **Tailwind CSS v4**, **Base UI**), editor grafis visual berbasis node (**React Flow** / `@xyflow/react`), pembuatan _private component registry_, dan orkestrasi alur kerja ETL terdistribusi berbasis **Trigger.dev v4**.

---

## 📑 Daftar Isi

- [Fitur dan Modul](#-fitur-dan-modul)
  - [1. Shadcn & Custom Registry Showcase](#1-shadcn--custom-registry-showcase)
  - [2. ReactFlow Showcases](#2-reactflow-showcases)
  - [3. Orkestrasi Latar Belakang Trigger.dev](#3-orkestrasi-latar-belakang-triggerdev)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Prasyarat](#-prasyarat)
- [Instalasi dan Konfigurasi](#-instalasi-dan-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Direktori](#-struktur-direktori)
- [Daftar Skrip](#-daftar-skrip)

---

## 🚀 Fitur dan Modul

Proyek ini terbagi menjadi beberapa modul utama:

### 1. Shadcn & Custom Registry Showcase (`/shadcn-showcase`)

- **Eksplorasi Komponen UI**: Pengujian komponen modern seperti Button, Badge, Calendar, Popover, Select, Compact Select, dan Compact Date Picker.
- **Private Component Registry**: Sistem registri komponen internal yang dibangun secara otomatis melalui skrip (`api/build-registry.ts`) ke direktori `dist-registry/` dan disajikan secara aman melalui Express API (`/api/registry/:component`) menggunakan autentikasi token.

### 2. ReactFlow Showcases (`/reactflow-showcase`)

- **Graph Traversal Showcase (`/reactflow-showcase/graph-traversal`)**:
  - Pendekatan _pull-based_ di mana komunikasi data antar node hanya terjadi ketika dibutuhkan (saat mengunduh di akhir), bukan setiap kali ada perubahan.
  - Alur Pipeline: **Input** (sumber data CSV/JSON), **Transform** (penyaringan, pengurutan, pembatasan jumlah baris, pembersihan spasi, penggabungan/pemisahan), dan **Output** (ekspor hasil akhir ke format JSON/CSV).
  - Logika utama: Ketika klik unduh di **Output**, sistem menelusuri (_traverse_) node secara rekursif mundur ke node sebelumnya hingga mencapai node ujung paling awal, yaitu **Input**, baru kemudian data diproses maju kembali untuk menghasilkan output akhir.

- **Push Dataflow Showcase (`/reactflow-showcase/push-dataflow`)**:
  - Pendekatan _best practice_ yang dicontohkan di dokumentasi resmi React Flow, di mana suatu node **selalu** mendapatkan informasi terbaru dari node satu level sebelumnya, kemudian mengorganisir data miliknya sendiri agar mudah dikonsumsi oleh node satu level setelahnya.
  - Alur Pipeline: **Input** (sumber data CSV/JSON), **Transform** (penyaringan, pengurutan, pembatasan jumlah baris, pembersihan spasi, penggabungan/pemisahan), dan **Output** (ekspor hasil akhir ke format JSON/CSV).
  - Logika utama: Setiap kali ada perubahan pada suatu node (misalnya konfigurasi diubah), perubahan tersebut langsung didorong (_push_) dan mengalir otomatis ke seluruh node turunannya secara reaktif, tanpa menunggu aksi eksplisit seperti klik unduh.

- **Visual ETL Workflow Runner (`/reactflow-showcase/workflow`)**:
  - Pendekatan _Flow-Based Programming_, di mana keseluruhan graph terlebih dahulu dianalisis untuk menentukan urutan eksekusi berdasarkan ketergantungan antar node, sebelum dijalankan secara terjadwal dari server (menggunakan Trigger.dev sebagai _task runner_).
  - Alur ETL: **Extract** (sumber data CSV/JSON), **Transform** (penyaringan, pengurutan, pembatasan jumlah baris, pembersihan spasi, penggabungan/pemisahan), dan **Load** (ekspor hasil akhir ke format JSON/CSV).
  - Logika utama: Ketika tombol jalankan di _header_ ditekan, seluruh graph dikirim ke server sebagai satu payload, kemudian dianalisis untuk menyusun urutan eksekusi (_topological sort_) berdasarkan ketergantungan antar node, dan dikelompokkan menjadi beberapa gelombang (_wave_) node yang independen agar dapat dieksekusi secara paralel dalam satu gelombang, sebelum lanjut ke gelombang berikutnya.

### 3. Orkestrasi Latar Belakang Trigger.dev (`src/triggers/`)

- **Subtugas Terdistribusi**:
  - `workflow-execution`: Koordinator utama yang menghitung dependensi graf serta mengeksekusi kumpulan tugas (_batch tasks_).
  - `extract-node-task`: Penguraian data mentah menjadi catatan terstruktur.
  - `transform-node-task`: Operasi penyaringan, pengurutan, pembatasan, dan penggabungan data.
  - `load-node-task`: Pemformatan data dan pembuatan berkas keluaran (CSV/JSON).
- **Fitur Tugas**:
  - Pembatalan kooperatif (_Cooperative Cancellation_) memanfaatkan `AbortSignal`.
  - Pembuatan token akses publik untuk memicu tugas langsung dari antarmuka web secara aman.
  - Sinkronisasi status dan metadata secara berkala.

---

## 🧰 Teknologi yang Digunakan

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite 8](https://vite.dev/) (Bundler & Server Pengembangan)
  - [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite`
  - [React Flow / @xyflow/react](https://reactflow.dev/) (Antarmuka Graf Visual)
  - [@base-ui/react](https://base-ui.com/) & [Lucide Icons](https://lucide.dev/)
  - [Zustand](https://zustand.docs.pmnd.rs/) (Manajemen Status)
  - [React Router v8](https://reactrouter.com/)
- **Backend & Orkestrasi Tugas**:
  - [Bun](https://bun.sh/) / Node.js
  - [Express 5](https://expressjs.com/) (API & Server Statis)
  - [Trigger.dev v4](https://trigger.dev/) (`@trigger.dev/sdk`, `@trigger.dev/react-hooks`)

---

## 📋 Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terpasang:

- [Bun](https://bun.sh/) (disarankan) atau [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- Akun [Trigger.dev](https://trigger.dev/) beserta proyek yang telah dikonfigurasi (untuk menjalankan alur kerja Trigger.dev).

---

## ⚙️ Instalasi dan Konfigurasi

### 1. Kloning Repositori

```bash
git clone https://gitops.tritronik.com/hilman.wasiandi/shadcn-explore.git
cd shadcn-explore
```

### 2. Memasang Dependensi

Gunakan Bun atau pengelola paket pilihan Anda:

```bash
bun install
# atau: npm install
```

### 3. Konfigurasi Variabel Lingkungan

Buat berkas `.env` pada direktori utama proyek (dapat menyalin dari `.env.example`):

```env
# Port server API Express (bawaan: 3000)
PORT=3000

# URL dasar peladen untuk injeksi skema registri komponen (misal: http://localhost:3000 atau domain produksi)
BASE_URL=http://localhost:3000

# Token rahasia untuk mengakses Private Registry API
TOKEN_REGISTRY=your_secret_registry_token

# Kunci rahasia dari dasbor Trigger.dev
TRIGGER_SECRET_KEY=tr_dev_xxxxxxxxx
```

#### 🔑 Panduan Mendapatkan `TRIGGER_SECRET_KEY`

1. **Masuk ke Dasbor Trigger.dev**:
   - Kunjungi [cloud.trigger.dev](https://cloud.trigger.dev) dan masuk menggunakan akun Anda.
2. **Pilih atau Buat Proyek**:
   - Pilih proyek yang sudah ada atau buat proyek baru (misal: `shadcn-explore`).
   - Salin **Project Ref/ID** (contoh: `proj_xxxxxxxxxxxx`) dan pastikan nilainya sama dengan baris `project: "..."` pada berkas [`trigger.config.ts`](trigger.config.ts).
3. **Buka Menu API Keys**:
   - Pada panel navigasi di sebelah kiri dasbor proyek, pilih menu **API Keys** (atau buka **Project Settings** > **API Keys**).
4. **Salin Secret Key**:
   - Di bagian environment **Dev / Development**, cari kolom **Server API Key / Secret Key** (kunci diawali dengan `tr_dev_...`).
   - Klik tombol **Copy** untuk menyalin kunci tersebut.
5. **Tempel ke Berkas `.env`**:
   - Masukkan kunci rahasia yang telah disalin ke variabel `TRIGGER_SECRET_KEY` di dalam berkas `.env`.

---

## 🏃 Menjalankan Aplikasi

Aplikasi membutuhkan antarmuka web Vite, server API Express, dan _worker_ Trigger.dev (untuk eksekusi alur kerja).

### 1. Menjalankan Frontend (Vite)

```bash
bun run dev
# atau: npm run dev
```

Buka peramban di `http://localhost:5173`. Frontend akan secara otomatis meneruskan (_proxy_) permintaan `/api/*` ke `http://localhost:3000`.

### 2. Menjalankan Backend API (Express)

Buka terminal baru:

```bash
bun run start
# atau: npm run start
```

Server API berjalan di `http://localhost:3000` dan menyediakan _endpoint_:

- `/api/registry/:component` (Registri komponen privat)
- `/api/trigger-token` (Pembuatan token pemicu publik)
- `/api/run-status` (Pemeriksaan status eksekusi Trigger.dev)
- `/api/cancel-run` (Pembatalan eksekusi tugas)

### 3. Menjalankan Worker Trigger.dev (Opsional untuk Alur Kerja)

Buka terminal baru untuk memproses tugas latar belakang secara lokal:

```bash
bunx trigger.dev@latest dev
# atau: npx trigger.dev@latest dev
```

---

## 📁 Struktur Direktori

```text
shadcn-explore/
├── api/                     # Server Express & pembuat registri komponen
│   ├── build-registry.ts    # Skrip pembangun skema registri komponen
│   └── index.ts             # Server API Express (proksi, autentikasi, token pemicu)
├── dist-registry/           # Berkas JSON registri privat untuk shadcn CLI
├── src/
│   ├── components/          # Komponen UI dan Shadcn
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilitas pembantu
│   ├── pages/               # Halaman modul
│   │   ├── reactflow-showcase/
│   │   │   ├── graph-traversal/  # Kanvas Graph Traversal
│   │   │   ├── push-dataflow/    # Kanvas Reactive Push Dataflow
│   │   │   └── workflow/         # Kanvas dan Pelaksana Alur Kerja ETL
│   │   └── shadcn-showcase/      # Modul Komponen Shadcn & Registri
│   ├── triggers/            # Definisi tugas Trigger.dev (Extract/Transform/Load)
│   ├── route.tsx            # Definisi rute React Router
│   ├── App.tsx              # Tata letak dan navigasi utama
│   └── main.tsx             # Titik masuk React
├── trigger.config.ts        # Konfigurasi Trigger.dev (runtime, proyek, retries)
├── components.json          # Konfigurasi shadcn CLI
├── registry.json            # Registri shadcn CLI
└── vite.config.ts           # Konfigurasi Vite + Tailwind v4 + Proksi API
```

---

## 📜 Daftar Skrip

| Skrip     | Perintah                                                | Deskripsi                                                                      |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `dev`     | `vite`                                                  | Menjalankan server pengembangan frontend Vite                                  |
| `build`   | `tsc -b && vite build && bun run api/build-registry.ts` | Memeriksa tipe data, membangun bundel produksi, dan menghasilkan JSON registri |
| `start`   | `bun api/index.ts`                                      | Menjalankan server backend Express                                             |
| `lint`    | `eslint .`                                              | Menjalankan pemeriksaan kode dengan ESLint                                     |
| `test`    | `vitest`                                                | Menjalankan pengujian unit otomatis menggunakan Vitest                         |
| `preview` | `vite preview`                                          | Menjalankan pratinjau hasil _build_ produksi secara lokal                      |

