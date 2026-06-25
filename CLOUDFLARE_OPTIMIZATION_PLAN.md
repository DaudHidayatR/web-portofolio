# Cloudflare Optimization Subgoals

## Deployment Target

Use Cloudflare Pages as a static Astro deployment.

- Root directory: `frontend`
- Build command: `npm run build` or `bun run build`
- Build output directory: `dist`
- Required environment variable: `NODE_VERSION=22.12.0`

Do not add `@astrojs/cloudflare` unless the site needs SSR, Workers runtime features, bindings, sessions, KV, D1, R2, or server-side APIs.

## Subgoals

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
   - Keep existing project image alt text and JSON-LD image metadata.
   - Verify `og:image` and `twitter:image` use the project image on project detail pages.

4. Build and verify locally
   - Run `bun --bun run build`.
   - Confirm no Astro image or content collection errors.
   - Confirm generated pages include `sitemap-index.xml`, `robots.txt`, and project pages.

5. Cloudflare deployment verification
   - Deploy to Cloudflare Pages.
   - Verify production domain uses canonical URLs for `https://daudhr.com`.
   - Verify `/blog` and `/blog/*` redirect to `/`.
   - Verify project card images load correctly.
   - Verify project detail image zoom works.
   - Verify `/_astro/*` assets have long cache headers.
   - Verify `*.pages.dev` preview URLs return `X-Robots-Tag: noindex`.

## Optional Dashboard Settings

Enable in Cloudflare:

- Brotli
- HTTP/3
- Early Hints
- Always Use HTTPS
- Automatic HTTPS Rewrites
- Cloudflare Web Analytics, if desired

Avoid adding Workers/SSR-specific configuration until the portfolio needs dynamic server features.
