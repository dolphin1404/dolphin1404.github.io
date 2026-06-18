/* =============================================================================
 * app.js — 메인(이력서) 페이지 렌더. common.js(window.PF) 를 사용합니다.
 * ========================================================================== */
(function () {
  "use strict";
  var PF = window.PF;
  if (!PF) { console.error("common.js (window.PF) 가 먼저 로드되어야 합니다."); return; }
  var C = PF.getContent();
  if (!C) { console.error("content.js (window.CONTENT) 를 찾을 수 없습니다."); return; }

  var t = PF.t, esc = PF.esc, STR = PF.STR;
  function el(id) { return document.getElementById(id); }

  document.documentElement.lang = PF.LANG;
  document.title = t(C.meta.name) + " — " + t(C.meta.role);
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", t(C.meta.summary).slice(0, 155));

  function section(id, idx, innerHTML) {
    return (
      '<section id="' + id + '" class="reveal"><div class="wrap">' +
        '<h2 class="section-head"><span class="hash">#</span>' + esc(t(C.nav[id])) +
          '<span class="idx">' + idx + "</span></h2>" + innerHTML +
      "</div></section>"
    );
  }

  function buildHero() {
    var m = C.meta, meta = [], btns = [];
    meta.push('<span><span class="ic">◉</span>' + esc(t(m.location)) + "</span>");
    if (m.email) meta.push('<span><span class="ic">✉</span>' + esc(m.email) + "</span>");
    if (m.email) btns.push('<a class="btn btn-primary" href="mailto:' + esc(m.email) + '">✉ ' + STR.email + "</a>");
    if (m.resumeFile) btns.push('<a class="btn" href="' + esc(m.resumeFile) + '" target="_blank" rel="noopener">⤓ ' + STR.resume + "</a>");
    if (m.github) btns.push('<a class="btn" href="' + esc(m.github) + '" target="_blank" rel="noopener">⌘ ' + STR.github + "</a>");
    el("hero").innerHTML =
      '<div class="wrap">' +
        '<div class="hero-term"><span class="accent">$</span> whoami</div>' +
        "<h1>" + esc(t(m.name)) + "</h1>" +
        '<div class="role">' + esc(t(m.role)) + '<span class="cursor"></span></div>' +
        '<p class="tagline">' + esc(t(m.tagline)) + "</p>" +
        '<p class="summary">' + esc(t(m.summary)) + "</p>" +
        '<div class="hero-meta">' + meta.join("") + "</div>" +
        '<div class="btn-row">' + btns.join("") + "</div>" +
      "</div>";
  }

  function buildAbout() {
    return (
      '<section id="about" class="reveal"><div class="wrap">' +
        '<h2 class="section-head"><span class="hash">#</span>' + esc(t(C.nav.about)) + '<span class="idx">00</span></h2>' +
        '<p class="tl-detail" style="font-size:1.02rem;color:var(--text)">' + esc(t(C.meta.summary)) + "</p>" +
      "</div></section>"
    );
  }

  function buildEducation() {
    var html = '<div class="timeline">' + C.education.map(function (e) {
      return '<div class="tl-item"><div class="tl-top"><span class="tl-org">' + esc(t(e.school)) + "</span>" +
        '<span class="tl-period">' + esc(t(e.period)) + "</span></div>" +
        '<div class="tl-title">' + esc(t(e.degree)) + "</div>" +
        '<div class="tl-detail">' + esc(t(e.detail)) + "</div></div>";
    }).join("") + "</div>";
    return section("education", "01", html);
  }

  function buildExperience() {
    var html = '<div class="timeline">' + C.experience.map(function (x) {
      var b = (t(x.bullets) || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      return '<div class="tl-item"><div class="tl-top"><span class="tl-org">' + esc(t(x.org)) + "</span>" +
        '<span class="tl-period">' + esc(t(x.period)) + "</span></div>" +
        '<div class="tl-title">' + esc(t(x.title)) + "</div>" +
        (b ? '<ul class="tl-bullets">' + b + "</ul>" : "") + "</div>";
    }).join("") + "</div>";
    return section("experience", "02", html);
  }

  function buildProjects() {
    var html = '<div class="proj-grid">' + C.projects.map(function (p) {
      var b = (t(p.bullets) || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      var tags = (p.tags || []).map(function (tag) { return '<span class="tag">' + esc(tag) + "</span>"; }).join("");
      var badge = t(p.badge) ? '<span class="proj-badge">' + esc(t(p.badge)) + "</span>" : "";
      var link = p.link ? '<a class="proj-link" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + STR.live + "</a>" : "";
      return '<div class="proj' + (p.featured ? " featured" : "") + '">' +
        '<div class="proj-top"><span class="proj-name">' + esc(t(p.name)) + "</span>" +
          '<span class="proj-year">' + esc(p.year || "") + "</span></div>" +
        '<div class="proj-role">' + esc(t(p.role)) + "</div>" + badge +
        '<p class="proj-summary">' + esc(t(p.summary)) + "</p>" +
        (b ? '<ul class="proj-bullets">' + b + "</ul>" : "") +
        '<div class="proj-foot">' + tags + link + "</div></div>";
    }).join("") + "</div>";
    return section("projects", "03", html);
  }

  function buildSkills() {
    var html = '<div class="skills-grid">' + C.skills.map(function (s) {
      var tags = (s.items || []).map(function (i) { return '<span class="tag">' + esc(i) + "</span>"; }).join("");
      return '<div class="skill-card"><h3>' + esc(t(s.group)) + '</h3><div class="skill-tags">' + tags + "</div></div>";
    }).join("") + "</div>";
    return section("skills", "04", html);
  }

  function buildAwards() {
    var html = '<div class="awards-list">' + C.awards.map(function (a) {
      var note = t(a.note) ? '<div class="award-note">' + esc(t(a.note)) + "</div>" : "";
      return '<div class="award"><span class="award-title">' + esc(t(a.title)) + "</span>" +
        '<span class="award-org">' + esc(t(a.org)) + "</span>" +
        '<span class="award-date">' + esc(t(a.date)) + "</span>" + note + "</div>";
    }).join("") + "</div>";
    return section("awards", "05", html);
  }

  function buildFooter() {
    var m = C.meta, links = [];
    if (m.email) links.push('<a href="mailto:' + esc(m.email) + '">' + STR.email + "</a>");
    if (m.github) links.push('<a href="' + esc(m.github) + '" target="_blank" rel="noopener">' + STR.github + "</a>");
    links.push('<a href="blog.html">' + esc(t(C.nav.blog)) + "</a>");
    links.push('<a href="#">' + STR.backTop + "</a>");
    el("footer").innerHTML =
      '<div class="wrap">' +
        '<div class="term"><span class="accent">$</span> echo "' + esc(t(m.name)) + " © " + new Date().getFullYear() + '"</div>' +
        '<div class="links">' + links.join("") + "</div>" +
        '<div class="term" style="margin-top:0.6rem;color:var(--faint)">' + STR.builtWith + "</div>" +
      "</div>";
  }

  function build() {
    PF.buildNav(el("nav"), C, { page: "home" });
    buildHero();
    el("main").innerHTML = buildAbout() + buildEducation() + buildExperience() + buildProjects() + buildSkills() + buildAwards();
    buildFooter();
    PF.initAdsense(C);
    PF.reveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
