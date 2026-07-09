# Firebase Data Model

## Firestore Collection: `directors`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Director name |
| `slug` | string | URL slug |
| `profileImage` | string \| null | Director profile image |
| `description` | string | Bio text |
| `descriptionLinks` | array | `[{ label, url }]` |
| `displayOrder` | number | Sort order |
| `createdAt` | timestamp | Creation timestamp |

## Firestore Collection: `works`

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project title |
| `slug` | string | URL slug (unique) |
| `thumbnail` | string \| null | Thumbnail URL (Firebase Storage) |
| `vimeoUrl` | string | Vimeo video URL or ID |
| `description` | string | Project description |
| `credits` | array | `[{ role: string, name: string }]` |
| `displayOrder` | number | Sort order |
| `directorIds` | array | Connected director document IDs |
| `createdAt` | timestamp | Creation timestamp |

## Firestore Collection: `settings`

권장 문서 ID: `site`

| Field | Type | Description |
|-------|------|-------------|
| `homepageShowreel` | string | Main/background Vimeo link |
| `contactEmail` | string | Contact email |
| `phone` | string | Contact phone |
| `instagram` | string | Contact Instagram URL |
| `logo` | string \| null | Production logo image |

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

- `thumbnails/{filename}` — work thumbnail images
- `directors/{filename}` — director profile images
- `logos/{filename}` — production logo images

## Security Rules

- `directors` — public read, **admin-only** write
- `works` — public read, **admin-only** write
- `settings/site` — public read, **admin-only** write
- `admins` — user can read own document only, no client writes
- `thumbnails`, `directors`, `logos` — public read, **admin-only** upload

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
6. Create `settings/site` document with homepage showreel and contact values

## Recommended Index

Recommended indexes:

- `works`: `displayOrder Asc`, `createdAt Asc`
- `directors`: `displayOrder Asc`, `createdAt Asc`
- `works`: `directorIds Array`, `displayOrder Asc`
