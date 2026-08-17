/* =============================================================================
 * blog.js — 블로그 목록 / 글 상세 렌더. common.js(window.PF) 사용.
 * ========================================================================== */
(() => {
  "use strict";

  const PF = window.PF;
  if (!PF) {
    console.error("common.js (window.PF)가 먼저 로드되어야 합니다.");
    return;
  }
  const CONTENT = PF.getContent();
  const { LANG, STR, esc, t } = PF;
  const byId = (id) => document.getElementById(id);
  const isPreview = PF.qsHas("preview=1");
  const posts = PF.getPosts()
    .slice()
    .filter(({ draft }) => isPreview || !draft)
    .sort((left, right) => (right.date || "").localeCompare(left.date || ""));

  document.documentElement.lang = LANG;

  const getSlug = () => {
    const match = location.search.match(/[?&]slug=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const parts = date.split("-");
    if (parts.length !== 3) return date;
    if (LANG === "ko") return `${parts[0]}.${parts[1]}.${parts[2]}`;
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      Number.parseInt(parts[1], 10) - 1
    ] || parts[1];
    return `${month} ${Number.parseInt(parts[2], 10)}, ${parts[0]}`;
  };

  const readTime = (body) => {
    const text = String(t(body) || "");
    const minutes = Math.max(1, Math.round(text.length / (LANG === "en" ? 1000 : 350)));
    return `${minutes} ${STR.minRead}`;
  };

  const tagsHtml = (post) => (t(post.tags) || [])
    .map((tag) => `<span class="tag">#${esc(tag)}</span>`)
    .join("");

  const previewBanner = () => isPreview
    ? `<div class="preview-banner">⚠ ${esc(STR.previewing)}</div>`
    : "";

  const renderList = () => {
    document.title = `${t(CONTENT.nav.blog)} — ${t(CONTENT.meta.name)}`;
    document.querySelector('meta[name="description"]')
      ?.setAttribute("content", `${t(CONTENT.meta.name)} — ${t(CONTENT.nav.blog)}`);

    const cards = posts.length
      ? posts.map((post) => `
        <a class="post-card reveal" href="blog.html?slug=${encodeURIComponent(post.slug)}">
          <div class="post-meta">
            <span class="post-date">${esc(formatDate(post.date))}</span>
            ${post.draft ? `<span class="post-draft">${esc(STR.draft)}</span>` : ""}
            <span class="post-read">${esc(readTime(post.body))}</span>
          </div>
          <h2 class="post-title">${esc(t(post.title))}</h2>
          <p class="post-summary">${esc(t(post.summary))}</p>
          <div class="post-tags">${tagsHtml(post)}</div>
        </a>
      `).join("")
      : `<p class="tl-detail">${esc(STR.noPosts)}</p>`;

    byId("blogmain").innerHTML = `
      <div class="wrap">
        ${previewBanner()}
        <div class="hero-term blog-command"><span class="accent">$</span> ls ./blog</div>
        <h1 class="blog-h1">${esc(t(CONTENT.nav.blog))}</h1>
        <div class="post-list">${cards}</div>
      </div>
    `;
  };

  const renderPost = (post) => {
    document.title = `${t(post.title)} — ${t(CONTENT.meta.name)}`;
    document.querySelector('meta[name="description"]')
      ?.setAttribute("content", t(post.summary).slice(0, 155));

    const ad = PF.adUnit(CONTENT);
    byId("blogmain").innerHTML = `
      <div class="wrap wrap-article">
        ${previewBanner()}
        <a class="back-link" href="blog.html">${esc(STR.backToList)}</a>
        <article class="article">
          <div class="post-meta">
            <span class="post-date">${esc(formatDate(post.date))}</span>
            <span class="post-read">${esc(readTime(post.body))}</span>
          </div>
          <h1 class="article-title">${esc(t(post.title))}</h1>
          <div class="post-tags">${tagsHtml(post)}</div>
          <div class="article-body">${PF.markdown(t(post.body))}</div>
          ${ad ? `<div class="ad-slot">${ad}</div>` : ""}
        </article>
        <a class="back-link" href="blog.html">${esc(STR.backToList)}</a>
      </div>
    `;
    PF.pushAds();
  };

  const buildFooter = () => {
    byId("footer").innerHTML = `
      <div class="wrap">
        <div class="term"><span class="accent">$</span> echo "${esc(t(CONTENT.meta.name))} © ${new Date().getFullYear()}"</div>
        <div class="links">
          <a href="index.html">${esc(t(CONTENT.nav.about))}</a>
          <a href="blog.html">${esc(t(CONTENT.nav.blog))}</a>
          <a href="#">${esc(STR.backTop)}</a>
        </div>
      </div>
    `;
  };

  const build = () => {
    PF.buildNav(byId("nav"), CONTENT, { page: "blog" });
    const slug = getSlug();
    const post = slug ? posts.find(({ slug: postSlug }) => postSlug === slug) : null;
    if (post) renderPost(post);
    else renderList();
    buildFooter();
    PF.initAdsense(CONTENT);
    PF.reveal();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
