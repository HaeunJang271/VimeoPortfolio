# Vimeo Portfolio

A production-ready portfolio website for a video production studio. Built with Next.js 15, Firebase, and Vimeo embeds.

## Features

- Full-screen homepage showreel with persistent background showreel on marketing pages
- Directors list and director detail pages
- Work grid and work detail pages with embedded videos
- Contact page backed by Firebase settings
- Admin dashboard with Firebase Authentication
- CRUD for directors and works
- Site settings management for showreel, contact, and logo
- Firebase Storage upload for logos, director images, and thumbnails
- Framer Motion animations
- Fully responsive design

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Firestore, Auth, Storage)
- **Vimeo Embed**
- **Framer Motion**
- **Lucide Icons**

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password sign-in
3. Create a **Firestore Database**
4. Enable **Storage**
5. Deploy security rules from `firebase/firestore.rules` and `firebase/storage.rules`
6. Create an admin user in **Authentication → Users**
7. Generate a **Service Account** key (Project Settings → Service Accounts)

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

**Client config** — from Firebase Project Settings → General → Your apps

**Admin config** — from the service account JSON (server-only, never expose publicly)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main showreel landing page |
| `/directors` | Directors index |
| `/directors/[slug]` | Director detail with related works |
| `/work` | Work grid |
| `/work/[slug]` | Work detail with credits and related projects |
| `/contact` | Contact information |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Admin overview |
| `/admin/directors` | Directors management |
| `/admin/works` | Works management |
| `/admin/settings` | Showreel/contact/logo settings |

## Firestore Schema

Collections:

- `directors`
- `works`
- `settings`
- `admins`

See `firebase/schema.md` for full details.

## Project Structure

```
src/
├── app/              # Next.js App Router pages, route groups, and API routes
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/firebase/     # Firebase client & admin SDK
├── services/         # Firestore data access layer
├── types/            # TypeScript types
└── utils/            # Helper functions
firebase/
├── firestore.rules   # Firestore security rules
├── storage.rules     # Storage security rules
└── schema.md         # Data model documentation
```

## Admin Usage

### Register an admin

Firebase Authentication 계정만으로는 관리자 접근이 **불가**합니다. 아래 중 하나를 설정하세요.

**방법 1 — Firestore (권장)**

1. Authentication → Users에서 사용자 생성 후 **UID** 복사
2. Firestore → `admins` 컬렉션 → 문서 추가
   - Document ID: `{UID}`
   - `email`: `admin@studio.com`
   - `role`: `admin`

**방법 2 — 환경변수 (초기 설정용)**

```env
ADMIN_EMAILS=admin@studio.com
```

### Sign in

1. Go to `/admin/login`
2. Sign in with your registered admin account
3. Navigate to **Directors**, **Works**, and **Settings**
4. Manage showreel, contact details, logo, directors, and projects

## Build

```bash
npm run build
npm start
```

## Design

- Black background with white typography
- Large whitespace and minimal UI
- Subtle Framer Motion animations
- Premium, studio-inspired aesthetic
