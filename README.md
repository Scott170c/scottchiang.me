# scottchiang.me
## scottchiang.me

A tiny Next.js page for confirming that the repo builds and deploys on Vercel.

```bash
npm install
npm run dev
```

## Editing projects

Project cards on the homepage are read from [`data/projects.json`](data/projects.json).
You can edit that file directly, or use the password-protected dashboard at
`/admin`.

### Admin dashboard setup

1. Generate a password hash locally (never leaves your machine):
   ```bash
   node scripts/hash-password.mjs
   ```
2. Generate a random session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Create a [fine-grained GitHub personal access token](https://github.com/settings/personal-access-tokens/new)
   scoped to **only this repository**, with **Contents: Read and write** permission
   and nothing else.
4. In your Vercel project settings, add these environment variables (see
   [`.env.example`](.env.example)):
   - `ADMIN_PASSWORD_HASH` — from step 1
   - `SESSION_SECRET` — from step 2
   - `GITHUB_TOKEN` — from step 3
   - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`

Without `GITHUB_TOKEN` set (e.g. in local `npm run dev`), saving from the
dashboard writes directly to `data/projects.json` on disk instead of
committing to GitHub. In production, saving commits straight to the repo,
which triggers a normal Vercel redeploy — changes go live in about a minute.

**How it's secured:** the admin password is hashed with scrypt (never stored
in plaintext), sessions are HMAC-signed HttpOnly/Secure/SameSite=Strict
cookies, login attempts are rate-limited, write requests are origin-checked,
and `/admin` is excluded from search indexing. No third-party auth service or
database is involved — the only secrets are the three env vars above.
