# Daud Hidayat Ramadhan Portfolio

Personal portfolio website for Daud Hidayat Ramadhan, focused on DevSecOps and Backend Engineering. The site presents professional profile information, selected projects, work experience, education, contact details, and social sharing metadata for search and social platforms.

## Live Website

The portfolio is available at:

```txt
https://daudhr.com
```

Canonical domain:

```txt
https://daudhr.com
```

The `www` version should redirect to the non-`www` domain:

```txt
https://www.daudhr.com -> https://daudhr.com
```

## Tech Stack

- Astro
- Svelte integration
- Tailwind CSS
- DaisyUI
- Astro content collections
- Astro sitemap

## Features

- SEO title and meta description
- Canonical URL configuration
- Open Graph and Twitter card metadata
- JSON-LD structured data for profile and website information
- Sitemap and robots support
- Responsive portfolio layout
- Project case studies
- Work and education timeline
- Contact section
- Social sharing links
- Google Analytics tag
- Google-search-friendly favicon assets

## Access And Usage

Visitors can access the website directly from the live domain:

```txt
https://daudhr.com
```

Main sections available on the homepage:

- About
- Featured projects
- Work experience
- Education
- Contact

Project case studies are available at:

```txt
https://daudhr.com/projects
```

RSS feed:

```txt
https://daudhr.com/rss.xml
```

Sitemap:

```txt
https://daudhr.com/sitemap-index.xml
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run code checks:

```bash
npm run check
```

## Node Requirement

This project requires Node.js `>=22.12.0`.

If your local Node version is older, the Astro build will fail. Use Node 22 or newer before running:

```bash
npm run build
```

## Deployment Notes

The project is configured as a static Astro site. After deployment, verify:

- `https://daudhr.com` loads correctly
- `https://www.daudhr.com` redirects to `https://daudhr.com`
- `/sitemap-index.xml` is accessible
- `/favicon.ico` and `/favicon-48x48.png` are accessible
- Google Search Console has the latest sitemap submitted
