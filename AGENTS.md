# Rules for this repo (cexagon/forkids)

- **Repo first.** GitHub `cexagon/forkids`, branch `main`, is the single source of truth. Pull `main` (or read the repo on GitHub) before any task; never work from a loose copy on the Mac.
- What this is: Kebun Hitung, a math learning game for grade 1 (PWA).
- Hosting: GitHub Pages via `.github/workflows/pages.yml` (push to `main`). Not on Cloudflare.
- Work on a branch and open a PR; cex merges.
- If this ever needs a Cloudflare site: add `.github/workflows/deploy.yml` like the other cexagon repos (push to `main` → `npx -y wrangler@4.86.0`, secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`, `workers_dev`/`preview_urls` false) and a DEPLOY.md. Never deploy by hand.
- Cloudflare account 894dad2a4e4a1b9d82ab4d2f4f209b41 only (never "Incandescent Saltasaurus").
- Never print or commit secrets (tokens, API keys, .env / .dev.vars / .secrets files).
