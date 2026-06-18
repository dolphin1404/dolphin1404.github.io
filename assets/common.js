/* =============================================================================
 * common.js — 모든 페이지(메인·블로그·관리자 미리보기)가 공유하는 유틸
 * window.PF 네임스페이스로 노출됩니다. 다른 스크립트보다 먼저 로드하세요.
 * ========================================================================== */
(function () {
  "use strict";

  var LANG = window.SITE_LANG === "en" ? "en" : "ko";
  var OTHER = LANG === "ko" ? "en" : "ko";

  function t(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    var val = v[LANG];
    if (val == null || val === "" || (Array.isArray(val) && !val.length)) val = v[OTHER];
    return val == null ? "" : val;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function qsHas(k) { return location.search.indexOf(k) > -1; }

  // ?preview=1 이면 localStorage 의 관리자 드래프트를 대신 사용 (미저장 미리보기)
  function getContent() {
    if (qsHas("preview=1")) {
      try { var d = localStorage.getItem("pf_draft_content"); if (d) return JSON.parse(d); } catch (e) {}
    }
    return window.CONTENT;
  }
  function getPosts() {
    if (qsHas("preview=1")) {
      try { var d = localStorage.getItem("pf_draft_posts"); if (d) return JSON.parse(d); } catch (e) {}
    }
    return window.POSTS || [];
  }

  var STR = {
    ko: { email: "이메일", github: "GitHub", resume: "이력서 PDF", live: "바로가기",
          backTop: "맨 위로", builtWith: "Kyumin Lee",
          blogList: "글 목록", readMore: "읽기", backToList: "← 목록으로", noPosts: "아직 글이 없습니다.",
          minRead: "분", draft: "초안", previewing: "미리보기 모드 (저장 전 임시 데이터)" },
    en: { email: "Email", github: "GitHub", resume: "Resume PDF", live: "Live",
          backTop: "Back to top", builtWith: "Kyumin Lee",
          blogList: "Posts", readMore: "Read", backToList: "← Back to list", noPosts: "No posts yet.",
          minRead: "min", draft: "Draft", previewing: "Preview mode (unsaved draft data)" }
  }[LANG];

  /* ---- 공통 네비게이션 -------------------------------------------------
   * opts.page : "home" | "blog"
   *  - home: 섹션 링크는 같은 페이지(#about), 블로그 링크는 blog.html
   *  - blog: 섹션 링크는 메인 페이지(index.html#about), 블로그가 활성
   * 언어 토글은 형제 언어 폴더의 같은 종류 페이지로 이동합니다. */
  function buildNav(navEl, content, opts) {
    opts = opts || {};
    var page = opts.page || "home";
    var nav = content.nav || {};
    var sectionKeys = ["about", "education", "experience", "projects", "skills", "awards"];
    var pre = page === "home" ? "#" : "index.html#";

    var links = sectionKeys.map(function (k) {
      return '<a href="' + pre + k + '">' + esc(t(nav[k])) + "</a>";
    });
    if (nav.blog) {
      links.push('<a href="blog.html"' + (page === "blog" ? ' class="active"' : "") + ">" + esc(t(nav.blog)) + "</a>");
    }

    var koHref = page === "blog" ? "../ko/blog.html" : "../ko/";
    var enHref = page === "blog" ? "../en/blog.html" : "../en/";
    if (page === "home" && location.hash) { koHref += location.hash; enHref += location.hash; }

    navEl.innerHTML =
      '<div class="nav-inner">' +
        '<a class="nav-brand" href="' + (page === "home" ? "#" : "index.html") + '"><span class="prompt">~/</span>' +
          esc(content.meta.handle || "me") + "</a>" +
        '<button class="nav-toggle" aria-label="menu">▤</button>' +
        '<nav class="nav-links" id="navLinks">' + links.join("") + "</nav>" +
        '<span class="lang-toggle">' +
          '<a href="' + koHref + '" class="' + (LANG === "ko" ? "active" : "") + '">KO</a>' +
          '<a href="' + enHref + '" class="' + (LANG === "en" ? "active" : "") + '">EN</a>' +
        "</span>" +
      "</div>";

    var toggle = navEl.querySelector(".nav-toggle");
    var menu = navEl.querySelector("#navLinks");
    toggle.addEventListener("click", function () { menu.classList.toggle("open"); });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") menu.classList.remove("open"); });
  }

  /* ---- 안전한 마크다운 렌더러 (의존성 없음) ----------------------------
   * 지원: # 제목  **굵게** *기울임* `코드` [링크](url)  - / 1. 목록
   *      > 인용  ``` 코드블록 ```  --- 구분선
   * 모든 텍스트를 먼저 이스케이프하므로 XSS에 안전합니다. */
  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^(https?:|mailto:|#|\.\/|\.\.\/|\/)/i.test(u)) return u;
    return "";
  }
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, function (_, c) { return "<code>" + c + "</code>"; });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, txt, url) {
      var u = safeUrl(url.replace(/&amp;/g, "&"));
      if (!u) return txt;
      var ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + esc(u) + '"' + ext + ">" + txt + "</a>";
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s;
  }
  function markdown(src) {
    var lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
    var out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];

      if (/^```/.test(line)) {                       // 코드블록
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(esc(lines[i])); i++; }
        i++; out.push("<pre><code>" + buf.join("\n") + "</code></pre>"); continue;
      }
      if (/^\s*---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }   // 구분선
      var h = line.match(/^(#{1,4})\s+(.*)$/);                              // 제목
      if (h) { var n = h[1].length; out.push("<h" + n + ">" + inline(h[2]) + "</h" + n + ">"); i++; continue; }
      if (/^\s*>\s?/.test(line)) {                                         // 인용
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) { q.push(inline(lines[i].replace(/^\s*>\s?/, ""))); i++; }
        out.push("<blockquote>" + q.join("<br>") + "</blockquote>"); continue;
      }
      if (/^\s*-\s+/.test(line)) {                                         // 글머리 목록
        var ul = [];
        while (i < lines.length && /^\s*-\s+/.test(lines[i])) { ul.push("<li>" + inline(lines[i].replace(/^\s*-\s+/, "")) + "</li>"); i++; }
        out.push("<ul>" + ul.join("") + "</ul>"); continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {                                     // 번호 목록
        var ol = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { ol.push("<li>" + inline(lines[i].replace(/^\s*\d+\.\s+/, "")) + "</li>"); i++; }
        out.push("<ol>" + ol.join("") + "</ol>"); continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }                          // 빈 줄
      var para = [inline(line)]; i++;                                      // 문단
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|```|\s*>|\s*-\s|\s*\d+\.\s|\s*---+\s*$)/.test(lines[i])) {
        para.push(inline(lines[i])); i++;
      }
      out.push("<p>" + para.join("<br>") + "</p>");
    }
    return out.join("\n");
  }

  /* ---- Google AdSense (설정으로 on/off) -------------------------------- */
  function initAdsense(content) {
    var a = (content.meta && content.meta.adsense) || {};
    if (!a.enabled || !a.client) return;
    if (document.querySelector("script[data-adsense]")) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(a.client);
    s.crossOrigin = "anonymous";
    s.setAttribute("data-adsense", "1");
    document.head.appendChild(s);
  }
  function adUnit(content) {                  // 광고 한 칸의 HTML (꺼져 있으면 "")
    var a = (content.meta && content.meta.adsense) || {};
    if (!a.enabled || !a.client) return "";
    return '<ins class="adsbygoogle" style="display:block" data-ad-client="' + esc(a.client) +
      '" data-ad-slot="' + esc(a.slot || "") + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  }
  function pushAds() {
    try { var ads = document.querySelectorAll(".adsbygoogle"); for (var k = 0; k < ads.length; k++) (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  function reveal() {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.08 });
      document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
    }
  }

  window.PF = {
    LANG: LANG, OTHER: OTHER, STR: STR,
    t: t, esc: esc, qsHas: qsHas,
    getContent: getContent, getPosts: getPosts,
    buildNav: buildNav, markdown: markdown,
    initAdsense: initAdsense, adUnit: adUnit, pushAds: pushAds,
    reveal: reveal
  };
})();
