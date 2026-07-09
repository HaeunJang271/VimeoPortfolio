# Firebase Data Model

## Firestore Collection: `works`

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project title |
| `slug` | string | URL slug (unique) |
| `thumbnail` | string \| null | Thumbnail URL (Firebase Storage) |
| `vimeo_url` | string | Vimeo video URL or ID |
| `description` | string | Project description |
| `credits` | array | `[{ role: string, name: string }]` |
| `created_at` | timestamp | Creation timestamp |

## Firestore Collection: `admins`

관리자 역할을 가진 사용자만 `/admin` 접근 및 CRUD 가능.

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Admin email |
| `role` | string | `"admin"` |
| `created_at` | timestamp | (optional) |

**Document ID = Firebase Auth UID**

Example:
```
admins/abc123uid
  email: "admin@studio.com"
  role: "admin"
```

## Storage Path

- `thumbnails/{filename}` — project thumbnail images (public read)

## Security Rules

- `works` — public read, **admin-only** write
- `admins` — user can read own document only, no client writes
- `thumbnails` — public read, **admin-only** upload

## Admin Setup

1. Create user in **Authentication → Users**
2. Copy the user's **UID**
3. In **Firestore**, create document:
   - Collection: `admins`
   - Document ID: `{UID}`
   - Fields: `email` (string), `role` (string = `admin`)

**Alternative (bootstrap):** set `ADMIN_EMAILS` in `.env.local`:
```env
ADMIN_EMAILS=admin@studio.com,other@studio.com
```

## Setup

1. Enable **Authentication** (Email/Password) in Firebase Console
2. Create **Firestore Database**
3. Enable **Storage**
4. Deploy rules: `firebase deploy --only firestore:rules,storage`
5. Register admin in `admins` collection (see above)

## Recommended Index

Firestore may prompt you to create a composite index for:

- Collection: `works`
- Fields: `slug` (Ascending)

Single-field equality queries usually work without a composite index.
