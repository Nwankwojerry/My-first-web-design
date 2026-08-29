import type { Article, Category, Media, Tag } from "../app/generated/prisma/client";

type DbArticle = Article & { category: Category | null; media: Media[]; tags: Array<{ tag: Tag }> };

export function DbArticle({ article }: { article: DbArticle }) {
  const hero = article.media[0];
  return <>
    <section className="page-hero"><div className="container page-hero__inner"><p className="kicker">Featured · Technology</p><h1>The future of AI</h1><p>{article.excerpt}</p></div></section>
    <section className="section"><div className="container"><div className="article-layout"><article className="article-main">
      <header className="article-header"><div className="article-meta"><span>{article.category?.name ?? "Article"}</span>{article.publishedAt ? <time dateTime={article.publishedAt.toISOString().slice(0,10)}>{article.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time> : null}<span>5 min read</span></div><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p></header>
      {hero ? <figure className="article-figure"><img src={hero.url} alt={hero.altText ?? ""} fetchPriority="high" />{hero.caption ? <figcaption>{hero.caption}</figcaption> : null}</figure> : null}
      <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
      <div className="article-tags">{article.tags.map(({ tag }) => <span className="article-tag" key={tag.id}>{tag.name}</span>)}</div>
    </article><aside className="article-sidebar" aria-label="Trending stories"><h2 className="article-sidebar__title">Trending</h2><div className="trending-list"><article className="trending-card"><a className="story-link" href="/pages/a-quiet-place-part-iii-wrap.html"><img className="story-media" src="/images/categories/entertainment.svg" alt="Entertainment editorial illustration" loading="lazy" /><div className="story-body"><div className="story-meta"><span>Movie News</span></div><h3>A Quiet Place Part III wraps filming as John Krasinski and Noah Jupe look ahead.</h3></div></a></article><article className="trending-card"><a className="story-link" href="/pages/posts.html"><img className="story-media" src="/images/articles/digital-culture.svg" alt="Digital culture editorial illustration" loading="lazy" /><div className="story-body"><div className="story-meta"><span>Editorial</span></div><h3>The Vision Behind Homestreet</h3></div></a></article></div></aside></div></div></section>
  </>;
}
