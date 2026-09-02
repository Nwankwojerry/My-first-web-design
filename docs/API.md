# Homestreet API — Phase 4

Phase 4 introduces a read-only HTTP API over the existing PostgreSQL/Prisma content foundation.

## Architecture

Browser or external client
→ Next.js route handler
→ input validation
→ shared server-side data-access/service layer
→ Prisma
→ PostgreSQL

The API never exposes database credentials, raw connection strings, internal database IDs, or unrestricted database access.

## Endpoints

### GET /api/articles

Returns published article summaries.

Query parameters:

- `category` — optional category slug
- `tag` — optional tag slug
- `author` — optional author slug
- `page` — optional positive integer, default `1`
- `limit` — optional positive integer, default `20`, maximum `50`

Example: `GET /api/articles?category=technology&page=1&limit=10`

The collection response returns article title and stable slug, excerpt, publication date, featured flag, public category, public author information when present, public tags, and media metadata needed by the existing site. The article body is not returned by the collection endpoint.

Response shape:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### GET /api/articles/[slug]

Returns one published article by its existing stable slug.

Example: `GET /api/articles/feature-ai`

The response includes the existing article body and public metadata. Draft and archived articles are not returned publicly. A missing article returns `404`.

### GET /api/categories/[slug]

Returns a category and its published article summaries.

Query parameters: `page` (default `1`) and `limit` (default `20`, maximum `50`). A missing category returns `404`.

### GET /api/search?q=

Searches published articles by title, excerpt, article body, category name, or tag name.

Query parameters:

- `q` — required, 2–100 characters
- `page` — optional positive integer, default `1`
- `limit` — optional positive integer, default `20`, maximum `50`

A successful response returns the query plus a paginated list of article summaries. This Phase 4 implementation uses straightforward PostgreSQL-backed search over the current schema; it is not described as full-text optimized.

## Validation

Public route inputs are validated before database access.

- Slugs accept lowercase letters, numbers, and hyphens and are bounded in length.
- Pagination values must be positive integers.
- Page size is capped at `50`.
- Search queries must be at least 2 characters and no more than 100 characters.
- Optional category, tag, and author filters must use valid slugs.

Invalid input returns `400` with a safe error body.

## Error responses

The API uses `200` for successful requests, `400` for invalid request parameters, `404` when the requested article or category does not exist, and `500` for unexpected server/database failures.

Error shape:

```json
{
  "error": "Safe message."
}
```

Internal stack traces, SQL errors, database connection strings, filesystem paths, and credentials are not returned to API consumers.

## Related content

The existing Article, Category, and Tag relationships are sufficient to support related-story queries by shared category or tags. Phase 4 will evaluate related content as a server-side query but will not add a separate public endpoint unless justified by the current frontend.

## Frontend integration

The API is first proven independently. Existing Homestreet server-rendered pages may continue to use direct server-side Prisma access where architecturally appropriate. The project will not add unnecessary HTTP calls from a server component to its own API.

Any frontend integration in Phase 4 must preserve the existing visual design, URLs, content, images, SEO intent, accessibility, and responsive behavior.

## Explicitly out of scope

Phase 4 does not introduce authentication, an admin dashboard, author login, article creation/editing/publishing UI, reader accounts, comments, payments/subscriptions, or a CMS.
