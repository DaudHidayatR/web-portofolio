# Cloudflare Optimization And Deployment Plan

## Deployment Target

Use Cloudflare Pages as a static Astro deployment.

- Production domain: `https://daudhr.com`
- Root directory: `frontend`
- Build command: `npm run build` or `bun run build`
- Build output directory: `dist`
- Required Node version: `22.12.0` or newer

Do not add `@astrojs/cloudflare` unless the site needs SSR, Workers runtime features, bindings, sessions, KV, D1, R2, or server-side APIs.

## Completed Local Optimization Goals

1. Add Cloudflare Pages headers
   - Create `public/_headers`.
   - Add long cache headers for hashed Astro assets in `/_astro/*`.
   - Add security headers like `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options`.
   - Add `X-Robots-Tag: noindex` for `*.pages.dev` preview URLs.

2. Add Cloudflare redirects
   - Create `public/_redirects`.
   - Redirect disabled blog routes:
     - `/blog / 302`
     - `/blog/* / 302`
   - Keep 302 while the blog is temporarily disabled. Use 301 only if blog removal becomes permanent.

3. Improve project social previews
   - Pass each project's optimized image URL to `Layout.astro` as `ogImage`.
   - Add `og:image:alt`, `twitter:image:alt`, `og:image:width`, and `og:image:height`.
   - Keep project image alt text and JSON-LD image metadata.
   - Verify `og:image` and `twitter:image` use project images on project detail pages.

4. Improve image SEO
   - Use descriptive lowercase image filenames.
   - Add `imageWidth` and `imageHeight` to project content.
   - Add `ImageObject` metadata with `url`, `contentUrl`, `caption`, `width`, `height`, and `representativeOfPage`.
   - Use lazy loading for project card images and eager loading for project detail hero images.

5. Build and verify locally
   - Run `bun --bun run build`.
   - Confirm no Astro image or content collection errors.
   - Confirm generated pages include `sitemap-index.xml`, `robots.txt`, `_headers`, `_redirects`, and project pages.

## GitHub Actions Deployment Research

Use Cloudflare Pages Direct Upload with GitHub Actions and Wrangler.

Why:

- The site is static Astro with `output: "static"`.
- Cloudflare Pages supports uploading prebuilt assets with Wrangler.
- GitHub Actions gives control over Node version, dependency install, build, validation, and later DevSecOps/security scan steps.
- This avoids coupling deployment to Cloudflare's automatic Git integration and makes the pipeline easier to extend.

Official deployment command pattern:

```bash
wrangler pages deploy <DIRECTORY> --project-name=<PROJECT_NAME>
```

For this repository:

```bash
wrangler pages deploy frontend/dist --project-name=<PROJECT_NAME>
```

## Required GitHub Secrets

Add these in GitHub:

`Settings -> Secrets and variables -> Actions -> New repository secret`

Required secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Cloudflare API token permission:

```text
Account -> Cloudflare Pages -> Edit
```

Recommended token approach:

1. Open Cloudflare dashboard.
2. Go to API Tokens.
3. Create a custom token.
4. Add `Account / Cloudflare Pages / Edit` permission.
5. Scope it to the account that owns the Pages project.
6. Save it as `CLOUDFLARE_API_TOKEN` in GitHub Actions secrets.
7. Save the Cloudflare account ID as `CLOUDFLARE_ACCOUNT_ID`.

## Recommended GitHub Actions Workflow

Create:

```text
.github/workflows/deploy-cloudflare-pages.yml
```

Recommended npm-based workflow:

```yaml
name: Deploy Portfolio To Cloudflare Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

concurrency:
  group: cloudflare-pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    name: Build And Deploy
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: "22.12.0"
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install Dependencies
        run: npm ci

      - name: Build Astro Site
        run: npm run build

      - name: Deploy To Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy frontend/dist --project-name=<PROJECT_NAME>
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

Replace `<PROJECT_NAME>` with the exact Cloudflare Pages project name.

Possible project names to confirm:

```text
web-portofolio
daudhr
daudhr-com
portfolio
```

## Bun Option

Use Bun only if a `bun.lock` is committed and the project intentionally standardizes on Bun in CI.

```yaml
      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install Dependencies
        run: bun install --frozen-lockfile

      - name: Build Astro Site
        run: bun run build
```

For now, npm is the safer CI default because `package-lock.json` is present and Cloudflare examples commonly use npm.

## Preview Deployments

For preview deployments from branches or pull requests, extend triggers:

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
  workflow_dispatch:
```

Wrangler Pages deploy can create preview deployments from non-production branches. The existing `_headers` file should noindex `*.pages.dev` URLs.

## Cloudflare Deployment Verification

After deployment, verify:

```bash
curl -I https://daudhr.com
curl -I https://daudhr.com/blog
curl https://daudhr.com/robots.txt
curl https://daudhr.com/sitemap-index.xml
```

Also verify:

- Production canonical URLs use `https://daudhr.com`.
- `/blog` and `/blog/*` redirect to `/`.
- Project card images load correctly.
- Project detail image zoom works.
- `/_astro/*` assets have long cache headers.
- `*.pages.dev` preview URLs return `X-Robots-Tag: noindex`.
- Project detail pages expose project-specific `og:image` and `twitter:image`.

## Optional Cloudflare Dashboard Settings

Enable:

- Brotli
- HTTP/3
- Early Hints
- Always Use HTTPS
- Automatic HTTPS Rewrites
- Cloudflare Web Analytics, if desired

Avoid adding Workers/SSR-specific configuration until the portfolio needs dynamic server features.

## Future DevSecOps Pipeline Ideas

Later, before the deploy step, add:

- secret scanning
- dependency audit
- SAST
- link checking
- Lighthouse/PageSpeed check
- generated artifact upload for build reports
