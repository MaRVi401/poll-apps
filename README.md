
# 🗳️ CodesMile Poll App

Aplikasi polling real-time berbasis web menggunakan **React + Vite + Tailwind CSS v4 + Supabase**.

Pengguna dapat melakukan voting secara langsung dan melihat hasil persentase secara **real-time**, serta tersedia fitur **reset polling** untuk mengatur ulang jumlah suara.

---

## 🚀 Tech Stack

- ⚛️ React (Frontend)
- ⚡ Vite (Build Tool)
- 🎨 Tailwind CSS v4 (Styling)
- 🟢 Supabase (Backend & Real-time Database)
- 🎬 Framer Motion (Animasi)
- 🎯 Lucide React (Icons)

---

## ✨ Fitur Utama

- ✅ Voting polling secara real-time
- ✅ Persentase hasil otomatis
- ✅ Animasi progress bar
- ✅ Reset polling (kembali ke 0)
- ✅ Sinkronisasi data realtime (multi-user)
- ✅ UI modern dengan Tailwind v4

---

## 📦 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/MaRVi401/poll-apps.git
cd poll-apps
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Akses di browser:

```
http://localhost:5173
```

---

## 🗄️ Struktur Database (Supabase)

### 1. Tabel `polls`

| Field      | Type      |
| ---------- | --------- |
| id         | uuid (PK) |
| question   | text      |
| created_at | timestamp |

---

### 2. Tabel `options`

| Field       | Type            |
| ----------- | --------------- |
| id          | uuid (PK)       |
| poll_id     | uuid (FK)       |
| option_text | text            |
| votes_count | int (default 0) |

---

## 🔁 Fitur Reset Polling

Fitur reset akan:

* Mengubah semua `votes_count` menjadi **0**
* Berlaku untuk semua opsi dalam 1 polling
* Update secara **real-time ke semua user**

---

## 🎨 Konfigurasi Tailwind CSS v4

Project ini menggunakan **Tailwind v4 (CSS-first)**

### 📁 `src/index.css`

```css
@import "tailwindcss";

@theme {
  --color-accent: #aa3bff;
}
```

### ⚙️ `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## ⚠️ Catatan Penting

* Error `Unknown at rule @theme` di VS Code **bukan error fatal**
* Itu hanya warning dari linter CSS
* Bisa dihilangkan dengan:

`.vscode/settings.json`

```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

---

## 📁 Struktur Project

```
poll-apps/
├── src/
│   ├── components/
│   │   └── PollCard.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## 👨‍💻 Author

Dibuat oleh ❤️
**Ahmad Yassin Hasan Al-bana**

---

## 📜 License

Free to use untuk pembelajaran & pengembangan kolaboratif 🚀

