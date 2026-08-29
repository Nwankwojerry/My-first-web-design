# Homestreet Phase 2 — Next.js + TypeScript Migration

Phase 2 introduces the Next.js App Router and TypeScript without PostgreSQL, an ORM, API endpoints, authentication, CMS/admin, or database-backed content.

The existing static HTML files remain in place as compatibility/source-of-truth content. Next.js provides `/` and `/pages/[slug]`, with rewrites preserving `/index.html` and `/pages/<slug>.html`. Shared header/navigation/mobile drawer/search and footer are React components. Existing HTML `<main>` content is rendered server-side without rewriting article copy.

The existing CSS remains the design source of truth and is imported by the new app. Per-page title and description metadata are read from the existing HTML documents. No new SEO system is invented in this phase.

Local npm/build/browser verification must be completed in the actual Codespace/CI environment because this execution environment cannot reach github.com or mount the Codespace filesystem.

Phase 3 remains responsible for PostgreSQL, data models, APIs, authentication, admin/CMS, and dynamic database-backed content.
