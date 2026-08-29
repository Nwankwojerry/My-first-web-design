# Homestreet Phase 3 — PostgreSQL Content Foundation

Phase 3 introduces PostgreSQL and Prisma without replacing the existing public content system wholesale.

## Local setup

1. Create `.env` from `.env.example`.
2. Set `DATABASE_URL` to a PostgreSQL database you control.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate -- --name init` for a new local database, or `npm run db:deploy` for an existing migration history.
6. Run `npm run db:seed`.
7. Run `npm run db:test`.
8. Run `npm run dev`.

Never commit `.env` or real database credentials.

## Data model

`Article` stores title, stable slug, excerpt, HTML body, status, publication date and featured state. `Category`, `Author`, `Tag`, `ArticleTag`, and `Media` provide relational metadata. Author is nullable because the current static articles do not contain reliable author metadata.

Images remain files in the repository. `Media.url` stores their existing public path plus alt/caption metadata; no binary image migration occurs in this phase.

## Seed/import

The seed script reads only existing `pages/*.html` files that contain `.article-body`. It imports the existing article title, excerpt, category, publication date, body HTML, tags and figure metadata. It does not invent authors or rewrite article copy.

## First database-backed route

Only `/pages/feature-ai.html` is switched to a PostgreSQL read when `DATABASE_URL` is configured and the seeded article exists. Without a configured database, or if the read fails, the route falls back to the existing static article source. Other public pages remain on the legacy content path.

This gives us one controlled proof path while preserving the current site.

## Deferred

No public API, authentication, admin dashboard, CMS, reader accounts, comments, or database-backed search are introduced in Phase 3. Those belong to later stages.
