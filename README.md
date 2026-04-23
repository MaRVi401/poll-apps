# 🗳️ CodesMile Poll App (SaaS Edition)

Aplikasi polling real-time berbasis web yang dibangun dengan arsitektur **SaaS**. Pengguna tidak hanya bisa melakukan voting, tetapi juga dapat membuat polling mereka sendiri, mendapatkan kredensial admin, dan memantau pemilih secara transparan.

> **Status Proyek:** Development (Semester 6 - PBL Polindra)

---

## ✨ Fitur Utama

- 🏗️ **SaaS Architecture:** Siapapun bisa membuat polling mandiri dengan `admin_credential` unik.
- ✅ **Transparent Voting:** Pemilih wajib memasukkan nama sebelum voting untuk menghindari kecurangan.
- 🛠️ **Admin Dashboard:** Fitur moderasi untuk menghapus suara atau mereset polling berdasarkan token admin.
- 🔄 **Real-time Sync:** Sinkronisasi data instan menggunakan Supabase Realtime (Broadcasting & Presence).
- 📊 **Auto-Calculation:** Persentase suara dihitung secara otomatis via **PostgreSQL Triggers**.
- 🐳 **Dockerized Backend:** Lingkungan pengembangan lokal yang konsisten menggunakan Supabase CLI & Docker.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS v4 (Next Generation CSS Engine)
- **Backend/Database:** Supabase (PostgreSQL)
- **DevOps:** Docker, Supabase CLI
- **Animation:** Framer Motion
- **Icons:** Lucide React

---

## 📦 Instalasi & Setup (Tim Developer)

### 1. Clone & Install
```bash
git clone https://github.com/MaRVi401/poll-apps.git
cd poll-apps
npm install
```

### 2. Jalankan Backend Lokal (Docker)
Pastikan Docker Desktop sudah aktif, lalu jalankan:
```bash
npx supabase start
```
Perintah ini akan otomatis menjalankan migrasi dan membentuk tabel di database lokal Anda.

### 3. Setup Environment Variables
Buat file `.env` dan masukkan kredensial yang muncul di terminal setelah perintah `start`:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

### 4. Jalankan Frontend
```bash
npm run dev
```

---

## 🗄️ Skema Database



### 1. Tabel `polls` (Owners)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | ID unik polling |
| `question` | text | Pertanyaan polling |
| `admin_credential` | text | Token rahasia untuk akses fitur admin |
| `created_by` | text | Nama pembuat polling |

### 2. Tabel `options` (Choices)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | ID unik opsi |
| `poll_id` | uuid (FK) | Relasi ke tabel polls |
| `option_text` | text | Teks pilihan |
| `votes_count` | int | Total suara (Auto-update via Trigger) |

### 3. Tabel `votes` (Transaction/Logs)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | ID transaksi |
| `option_id` | uuid (FK) | Opsi yang dipilih |
| `voter_name` | text | Nama lengkap pemilih (R2) |

---

## 🛠️ Alur Kerja Migrasi (Database Versioning)

Project ini menggunakan **Supabase Migrations**. Jika Anda melakukan perubahan struktur tabel:
1. Lakukan perubahan di Dashboard Lokal (`localhost:54323`).
2. Jalankan `npx supabase db diff --local -f initial_schema` untuk membuat file migrasi.
3. Push file di folder `supabase/migrations/` ke GitHub agar tim lain bisa sinkronisasi.
4. Tim lain cukup melakukan `git pull` dan `npx supabase db reset`.

---

## 👨‍💻 Developer & Tim

- CodesMile



---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
