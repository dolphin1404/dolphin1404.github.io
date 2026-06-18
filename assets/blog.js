/* =============================================================================
 * blog.js — 블로그 목록 / 글 상세 렌더. common.js(window.PF) 사용.
 *   목록:  blog.html
 *   상세:  blog.html?slug=글주소
 * ========================================================================== */
(function () {
  "use strict";
  var PF = window.PF;
  if (!PF) { console.error("common.js (window.PF) 가 먼저 로드되어야 합니다."); return; }
  var C = PF.getContent();
  var t = PF.t, esc = PF.esc, STR = PF.STR, LANG = PF.LANG;
  function el(id) { return document.getElementById(id); }

  document.documentElement.lang = LANG;

  var isPreview = PF.qsHas("preview=1");
  var posts = PF.getPosts().slice().filter(function (p) { return isPreview || !p.draft; });
  posts.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

  function getSlug() {
    var m = location.search.match(/[?&]slug=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }
  function fmtDate(s) {
    if (!s) return "";
    var p = s.split("-");
    if (p.length === 3) {
      if (LANG === "ko") return p[0] + "." + p[1] + "." + p[2];
      var mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(p[1], 10) - 1] || p[1];
      return mo + " " + parseInt(p[2], 10) + ", " + p[0];
    }
    return s;
  }
  function readTime(body) {
    var txt = String(t(body) || "");
    var min = Math.max(1, Math.round(txt.length / (LANG === "en" ? 1000 : 350)));
    return min + " " + STR.minRead;
  }
  function tagsHtml(p) {
    return (t(p.tags) || []).map(function (tg) { return '<span class="tag">#' + esc(tg) + "</span>"; }).join("");
  }
  function previewBanner() {
    return isPreview ? '<div class="preview-banner">⚠ ' + esc(STR.previewing) + "</div>" : "";
  }

  function renderList() {
    document.title = t(C.nav.blog) + " — " + t(C.meta.name);
    var mdsc = document.querySelector('meta[name="description"]');
    if (mdsc) mdsc.setAttribute("content", t(C.meta.name) + " — " + t(C.nav.blog));

    var cards = posts.length ? posts.map(function (p) {
      return '<a class="post-card reveal" href="blog.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<div class="post-meta"><span class="post-date">' + esc(fmtDate(p.date)) + "</span>" +
          (p.draft ? '<span class="post-draft">' + esc(STR.draft) + "</span>" : "") +
          '<span class="post-read">' + esc(readTime(p.body)) + "</span></div>" +
        '<h2 class="post-title">' + esc(t(p.title)) + "</h2>" +
        '<p class="post-summary">' + esc(t(p.summary)) + "</p>" +
        '<div class="post-tags">' + tagsHtml(p) + "</div></a>";
    }).join("") : '<p class="tl-detail">' + esc(STR.noPosts) + "</p>";

    el("blogmain").innerHTML =
      '<div class="wrap">' + previewBanner() +
        '<div class="hero-term" style="margin-top:2.5rem"><span class="accent">$</span> ls ./blog</div>' +
        '<h1 class="blog-h1">' + esc(t(C.nav.blog)) + "</h1>" +
        '<div class="post-list">' + cards + "</div>" +
      "</div>";
  }

  function renderPost(p) {
    document.title = t(p.title) + " — " + t(C.meta.name);
    var mdsc = document.querySelector('meta[name="description"]');
    if (mdsc) mdsc.setAttribute("content", t(p.summary).slice(0, 155));

    var ad = PF.adUnit(C);
    el("blogmain").innerHTML =
      '<div class="wrap wrap-article">' + previewBanner() +
        '<a class="back-link" href="blog.html">' + esc(STR.backToList) + "</a>" +
        '<article class="article">' +
          '<div class="post-meta"><span class="post-date">' + esc(fmtDate(p.date)) + "</span>" +
            '<span class="post-read">' + esc(readTime(p.body)) + "</span></div>" +
          '<h1 class="article-title">' + esc(t(p.title)) + "</h1>" +
          '<div class="post-tags">' + tagsHtml(p) + "</div>" +
          '<div class="article-body">' + PF.markdown(t(p.body)) + "</div>" +
          (ad ? '<div class="ad-slot">' + ad + "</div>" : "") +
        "</article>" +
        '<a class="back-link" href="blog.html">' + esc(STR.backToList) + "</a>" +
      "</div>";
    PF.pushAds();
  }

  function buildFooter() {
    el("footer").innerHTML =
      '<div class="wrap"><div class="term"><span class="accent">$</span> echo "' +
        esc(t(C.meta.name)) + " © " + new Date().getFullYear() + '"</div>' +
        '<div class="links"><a href="index.html">' + esc(t(C.nav.about)) + "</a>" +
          '<a href="blog.html">' + esc(t(C.nav.blog)) + "</a>" +
          '<a href="#">' + STR.backTop + "</a></div></div>";
  }

  function build() {
    PF.buildNav(el("nav"), C, { page: "blog" });
    var slug = getSlug();
    var post = slug ? posts.filter(function (p) { return p.slug === slug; })[0] : null;
    if (post) renderPost(post); else renderList();
    buildFooter();
    PF.initAdsense(C);
    PF.reveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
