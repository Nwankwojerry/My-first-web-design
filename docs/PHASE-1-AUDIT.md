# Homestreet Phase 1 — Migration Baseline & Audit

Baseline commit: `f6767dad6c0393528647f05c05ae78155ed8a2ee`
Baseline branch: `main`

## Scope

Preservation and migration-readiness audit only. No framework, TypeScript, database, API, authentication, or admin system is introduced in Phase 1.

## Current architecture

Homestreet is a static, file-based publication site:

- HTML pages in the repository root and `pages/`
- Shared CSS in `css/style.css` and `css/responsive.css`
- Shared client-side behavior in `js/main.js`
- Static assets under `images/`
- No `package.json`, Next.js/React/TypeScript application layer, PostgreSQL integration, or API/server layer was found in the inspected repository paths
- A human-readable `pages/sitemap.html` exists; `robots.txt` and an XML sitemap were not found in the inspected repository paths

## Page/routing baseline

The site uses `index.html` plus destination/article documents under `pages/`. The human-readable sitemap lists Home, News, Tech, Economy, Resources, Tutorials, Guides, Tips & Tricks, Stories, Articles, Posts, Entertainment, Movie News, Upcoming Movies, Celebrities, Comedy, About, Contact, Privacy Policy, Terms, and the featured AI story. Direct repository inspection also confirmed `pages/a-quiet-place-part-iii-wrap.html` and `pages/glory-to-hanuman-jabari.html`.

Existing relative paths are migration-sensitive and must be preserved or deliberately remapped later.

## Shared UI

Headers, navigation, dropdowns, mobile drawer, search panel, and footers are duplicated in the HTML documents. `js/main.js` also contains fallback logic for dynamically injecting shared UI. The project therefore currently mixes static shared markup with client-side shared-UI injection.

This is a future migration concern, but Phase 1 does not componentize or rewrite it.

## CSS

`css/style.css` contains shared variables, layout, navigation, cards, article styles, and general site styling. `css/responsive.css` contains breakpoint and reduced-motion rules. The current visual system is retained unchanged.

## JavaScript

`js/main.js` handles mobile drawer/menu state, mobile submenus, desktop dropdowns, search-panel state, query-string navigation to `news.html`, Escape-key handling, and fallback shared-UI injection. It is not a backend/data layer.

## Content

Article content and article/category cards are hard-coded into HTML documents. This is the principal scalability limitation for a future application architecture because publishing currently depends on maintaining multiple static documents and references.

## Images

Images are referenced through relative paths, principally under `images/logo/`, `images/articles/`, and `images/categories/`. The current folder-depth assumptions must be respected during migration.

## SEO

Inspected pages contain title tags and meta descriptions; article metadata uses semantic `time` elements and inspected images have alt text. The inspected article also contains keyword metadata.

Canonical link elements, Open Graph metadata, JSON-LD structured data, `robots.txt`, and an XML sitemap were not found in the inspected repository content. These are follow-up items, not Phase 1 redesign work.

## Migration risks

### Safe to fix now

- Clearly broken internal file paths whose intended destination is unambiguous.
- Migration documentation and other non-user-facing preparation.

### Better handled during the framework migration

- Componentizing shared header/footer/navigation.
- Converting article documents and cards into reusable data-driven structures.
- Dynamic routing and real search.
- API/server boundaries and database-backed content.

### Preserve for compatibility

- Existing page/article URLs and slugs.
- Existing image paths.
- Branding, visual styling, content, responsive behavior, and working JavaScript.
- Existing SEO metadata and internal-link structure unless a future phase deliberately changes them.

## Phase 1 rule

The static site remains the source of truth until a later phase deliberately reproduces it in the new application architecture.

## Verification limitation

The Codespace filesystem was not mounted in the current tool session, so local browser/build testing could not honestly be performed. The repository was inspected through the connected GitHub repository instead. No user-facing code was changed during this audit because the only candidate path correction could not be safely applied without a complete current-tree verification.
