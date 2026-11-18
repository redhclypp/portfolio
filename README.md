# Meysya Indah Calista Putri — Portfolio

Portfolio pribadi Meysya Indah Calista Putri, mahasiswa Teknologi Informasi Universitas Brawijaya.

Website ini dibuat untuk menampilkan profil, pengalaman, sertifikasi, serta berbagai project yang telah dikerjakan selama perjalanan akademik dan pengembangan skill di bidang teknologi informasi.

## ✨ Fitur

- Single Page Portfolio: Hero, About, Experience, Projects, Certificates, dan Contact
- Project showcase untuk menampilkan berbagai project yang telah dikerjakan
- Dynamic project detail page untuk menampilkan informasi project secara lebih lengkap
- Interactive 3D element menggunakan Lanyard Scene
- Custom cursor
- Loading screen
- Responsive design untuk berbagai ukuran perangkat
- Login page untuk akses halaman admin
- Admin page untuk pengelolaan konten portfolio
- Integrasi Supabase untuk kebutuhan data portfolio
- Certificate showcase
- Contact section

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- CSS
- Tailwind CSS

### Development Tools

- Vite
- Git
- GitHub
- Supabase

### Interactive & 3D

- Three.js
- React Three Fiber

## 🚀 Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah terinstall:

- Node.js
- npm

### Installation

Clone repository:

```bash
git clone https://github.com/redhclypp/portfolio.git
```

Masuk ke folder project:

```bash
cd portfolio
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Kemudian buka URL yang diberikan oleh Vite pada browser.

## 🔐 Environment Variables

Project ini menggunakan environment variables untuk konfigurasi Supabase.

Buat file `.env` pada root directory project:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Jangan commit file `.env` ke repository. File tersebut digunakan untuk menyimpan konfigurasi environment secara lokal.

## 📦 Build untuk Production

Untuk membuat production build:

```bash
npm run build
```

Untuk melakukan preview terhadap hasil build:

```bash
npm run preview
```

## 📁 Struktur Folder

```text
src/
├── assets/
│
├── components/
│   ├── About.tsx
│   ├── Certificates.tsx
│   ├── Contact.tsx
│   ├── Cursor.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LanyardScene.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx
│   └── Strip.tsx
│
├── hooks/
│   └── useSiteContent.ts
│
├── lib/
│   └── supabase.ts
│
├── pages/
│   ├── Admin.tsx
│   ├── Login.tsx
│   └── ProjectDetail.tsx
│
├── styles/
│   └── ui/
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 📂 Featured Projects

Beberapa project yang ditampilkan dalam portfolio ini:

### AI Contract Risk Analyzer

AI-based project yang dikembangkan untuk membantu menganalisis kontrak dan mengidentifikasi potensi risiko dalam dokumen legal.

### Fire Detection System

Project berbasis IoT yang berfokus pada deteksi potensi kebakaran dan mendukung pemberian peringatan secara lebih dini.

### PlanCraft

Project yang dikembangkan untuk mendukung proses perencanaan dan pengelolaan aktivitas secara lebih terstruktur.

### Grocery

Project aplikasi yang dikembangkan untuk mendukung kebutuhan pengelolaan grocery.

### Sedentary

Project yang berfokus pada awareness terhadap sedentary behavior dan aktivitas pengguna.

## 🎓 Certifications

Beberapa sertifikasi yang ditampilkan pada portfolio:

- AI in Legal: From Research to Results
- AI Literacy
- Unleashing the Power of AI Agents

## 🌐 Live Portfolio

[Visit My Portfolio](https://myscalista.netlify.app)

## 📫 Contact

**Meysya Indah Calista Putri**

- Email: myscallista@gmail.com
- LinkedIn: https://www.linkedin.com/in/meysyaindahcalistap
- Portfolio: https://myscalista.netlify.app

---

Thank you for visiting my portfolio! 🚀
