/* =============================================================================
 * common.js — 공개 페이지가 공유하는 번역, 상태, 네비게이션, 마크다운 유틸
 * 사용자 이벤트 → STATE 변경 → render 함수 호출 흐름을 한 곳에서 관리합니다.
 * ========================================================================== */
(() => {
  "use strict";

  const LANG = window.SITE_LANG === "en" || document.documentElement.lang === "en" ? "en" : "ko";
  const OTHER = LANG === "ko" ? "en" : "ko";

  const storageGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  };

  const systemTheme = () => {
    try {
      return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (_error) {
      return "dark";
    }
  };

  const STATE = {
    theme: storageGet("pf_theme") || systemTheme(),
    menuOpen: false,
    projects: {
      status: "idle",
      items: [],
      filter: "all",
      error: null
    },
    form: {
      values: { name: "", email: "", message: "" },
      errors: {},
      submitted: false
    },
    scroll: {
      navActive: false,
      showTopButton: false
    }
  };

  const t = (value) => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    const selected = value[LANG];
    if (selected == null || selected === "" || (Array.isArray(selected) && !selected.length)) {
      return value[OTHER] == null ? "" : value[OTHER];
    }
    return selected;
  };

  const esc = (value) => String(value == null ? "" : value).replace(
    /[&<>"']/g,
    (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );

  const qsHas = (key) => location.search.includes(key);

  const getContent = () => {
    if (qsHas("preview=1")) {
      try {
        const draft = storageGet("pf_draft_content");
        if (draft) return JSON.parse(draft);
      } catch (_error) {
        // 잘못된 임시 데이터는 배포된 원본 데이터로 대체합니다.
      }
    }
    return window.CONTENT;
  };

  const getPosts = () => {
    if (qsHas("preview=1")) {
      try {
        const draft = storageGet("pf_draft_posts");
        if (draft) return JSON.parse(draft);
      } catch (_error) {
        // 잘못된 임시 데이터는 배포된 원본 데이터로 대체합니다.
      }
    }
    return window.POSTS || [];
  };

  const STR = {
    ko: {
      email: "이메일",
      github: "GitHub",
      resume: "이력서 PDF",
      live: "바로가기",
      backTop: "맨 위로",
      builtWith: "Vanilla JavaScript · GitHub Pages",
      blogList: "글 목록",
      readMore: "읽기",
      backToList: "← 목록으로",
      noPosts: "아직 글이 없습니다.",
      minRead: "분",
      draft: "초안",
      previewing: "미리보기 모드 (저장 전 임시 데이터)",
      menu: "메뉴",
      navigation: "주요 메뉴",
      contact: "연락"
    },
    en: {
      email: "Email",
      github: "GitHub",
      resume: "Resume PDF",
      live: "Live",
      backTop: "Back to top",
      builtWith: "Vanilla JavaScript · GitHub Pages",
      blogList: "Posts",
      readMore: "Read",
      backToList: "← Back to list",
      noPosts: "No posts yet.",
      minRead: "min",
      draft: "Draft",
      previewing: "Preview mode (unsaved draft data)",
      menu: "Menu",
      navigation: "Primary navigation",
      contact: "Contact"
    }
  }[LANG];

  const focusableMenuItems = (menu) => Array.from(menu.querySelectorAll("a[href]"));

  const renderMenu = (navElement) => {
    if (!navElement) return;
    const toggle = navElement.querySelector(".nav-toggle");
    const menu = navElement.querySelector(".nav-links");
    if (!toggle || !menu) return;

    menu.classList.toggle("open", STATE.menuOpen);
    toggle.setAttribute("aria-expanded", String(STATE.menuOpen));
    toggle.setAttribute(
      "aria-label",
      STATE.menuOpen
        ? (LANG === "ko" ? "메뉴 닫기" : "Close menu")
        : (LANG === "ko" ? "메뉴 열기" : "Open menu")
    );
  };

  const setMenuOpen = (navElement, open, { focusFirst = false, returnFocus = false } = {}) => {
    STATE.menuOpen = open;
    renderMenu(navElement);

    const toggle = navElement.querySelector(".nav-toggle");
    const menu = navElement.querySelector(".nav-links");
    if (open && focusFirst) {
      requestAnimationFrame(() => focusableMenuItems(menu)[0]?.focus());
    }
    if (!open && returnFocus) toggle?.focus();
  };

  const focusSection = (target) => {
    if (!target) return;
    const hadTabIndex = target.hasAttribute("tabindex");
    if (!hadTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabIndex) {
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
  };

  const bindNavigation = (navElement) => {
    const toggle = navElement.querySelector(".nav-toggle");
    const menu = navElement.querySelector(".nav-links");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      setMenuOpen(navElement, !STATE.menuOpen, { focusFirst: !STATE.menuOpen });
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          setMenuOpen(navElement, false);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", href);
          window.setTimeout(() => focusSection(target), 450);
        }
      } else {
        setMenuOpen(navElement, false);
      }
    });

    navElement.addEventListener("keydown", (event) => {
      if (!STATE.menuOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(navElement, false, { returnFocus: true });
        return;
      }
      if (event.key !== "Tab" || !matchMedia("(max-width: 767px)").matches) return;

      const items = focusableMenuItems(menu);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (innerWidth >= 768 && STATE.menuOpen) setMenuOpen(navElement, false);
    });
  };

  const buildNav = (navElement, content, options = {}) => {
    const page = options.page || "home";
    const nav = content.nav || {};
    const sectionKeys = ["about", "education", "experience", "projects", "skills", "awards", "contact"];
    const prefix = page === "home" ? "#" : "index.html#";

    const links = sectionKeys.map((key) => {
      const label = key === "contact" ? (t(nav[key]) || STR.contact) : t(nav[key]);
      return `<a href="${prefix}${key}">${esc(label)}</a>`;
    });
    if (nav.blog) {
      links.push(
        `<a href="blog.html"${page === "blog" ? ' class="active" aria-current="page"' : ""}>${esc(t(nav.blog))}</a>`
      );
    }

    let koHref = page === "blog" ? "../ko/blog.html" : "../ko/";
    let enHref = page === "blog" ? "../en/blog.html" : "../en/";
    if (page === "home" && location.hash) {
      koHref += location.hash;
      enHref += location.hash;
    }

    navElement.innerHTML = `
      <div class="nav-inner">
        <a class="nav-brand" href="${page === "home" ? "#" : "index.html"}">
          <span class="prompt">~/</span>${esc(content.meta.handle || "me")}
        </a>
        <button
          class="nav-toggle"
          type="button"
          aria-controls="navLinks"
          aria-expanded="false"
          aria-label="${esc(STR.menu)}"
        >☰</button>
        <nav class="nav-links" id="navLinks" aria-label="${esc(STR.navigation)}">
          ${links.join("")}
        </nav>
        <button class="theme-toggle" type="button" aria-pressed="false"></button>
        <span class="lang-toggle" aria-label="Language">
          <a href="${koHref}" class="${LANG === "ko" ? "active" : ""}" lang="ko">KO</a>
          <a href="${enHref}" class="${LANG === "en" ? "active" : ""}" lang="en">EN</a>
        </span>
      </div>
    `;

    renderMenu(navElement);
    bindNavigation(navElement);
  };

  const safeUrl = (url) => {
    const clean = String(url || "").trim();
    return /^(https?:|mailto:|#|\.\/|\.\.\/|\/)/i.test(clean) ? clean : "";
  };

  const inline = (source) => {
    let result = esc(source);
    result = result.replace(/`([^`]+)`/g, (_match, code) => `<code>${code}</code>`);
    result = result.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, text, url) => {
      const cleanUrl = safeUrl(url.replace(/&amp;/g, "&"));
      if (!cleanUrl) return text;
      const external = /^https?:/i.test(cleanUrl) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${esc(cleanUrl)}"${external}>${text}</a>`;
    });
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return result;
  };

  const markdown = (source) => {
    const lines = String(source || "").replace(/\r\n/g, "\n").split("\n");
    const output = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      if (/^```/.test(line)) {
        const buffer = [];
        index += 1;
        while (index < lines.length && !/^```/.test(lines[index])) {
          buffer.push(esc(lines[index]));
          index += 1;
        }
        index += 1;
        output.push(`<pre><code>${buffer.join("\n")}</code></pre>`);
        continue;
      }
      if (/^\s*---+\s*$/.test(line)) {
        output.push("<hr>");
        index += 1;
        continue;
      }
      const heading = line.match(/^(#{1,4})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }
      if (/^\s*>\s?/.test(line)) {
        const quotes = [];
        while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
          quotes.push(inline(lines[index].replace(/^\s*>\s?/, "")));
          index += 1;
        }
        output.push(`<blockquote>${quotes.join("<br>")}</blockquote>`);
        continue;
      }
      if (/^\s*-\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
          items.push(`<li>${inline(lines[index].replace(/^\s*-\s+/, ""))}</li>`);
          index += 1;
        }
        output.push(`<ul>${items.join("")}</ul>`);
        continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
          items.push(`<li>${inline(lines[index].replace(/^\s*\d+\.\s+/, ""))}</li>`);
          index += 1;
        }
        output.push(`<ol>${items.join("")}</ol>`);
        continue;
      }
      if (/^\s*$/.test(line)) {
        index += 1;
        continue;
      }

      const paragraph = [inline(line)];
      index += 1;
      while (
        index < lines.length
        && !/^\s*$/.test(lines[index])
        && !/^(#{1,4}\s|```|\s*>|\s*-\s|\s*\d+\.\s|\s*---+\s*$)/.test(lines[index])
      ) {
        paragraph.push(inline(lines[index]));
        index += 1;
      }
      output.push(`<p>${paragraph.join("<br>")}</p>`);
    }
    return output.join("\n");
  };

  const initAdsense = (content) => {
    const adsense = content.meta?.adsense || {};
    if (!adsense.enabled || !adsense.client || document.querySelector("script[data-adsense]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsense.client)}`;
    script.crossOrigin = "anonymous";
    script.dataset.adsense = "1";
    document.head.appendChild(script);
  };

  const adUnit = (content) => {
    const adsense = content.meta?.adsense || {};
    if (!adsense.enabled || !adsense.client) return "";
    return `<ins class="adsbygoogle" data-ad-client="${esc(adsense.client)}" data-ad-slot="${esc(adsense.slot || "")}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
  };

  const pushAds = () => {
    try {
      document.querySelectorAll(".adsbygoogle").forEach(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    } catch (_error) {
      // 광고 차단기나 외부 서비스 오류가 사이트 렌더링을 막지 않게 합니다.
    }
  };

  const reveal = () => {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    elements.forEach((element) => observer.observe(element));
  };

  window.PF = {
    LANG,
    OTHER,
    STR,
    STATE,
    t,
    esc,
    qsHas,
    getContent,
    getPosts,
    buildNav,
    renderMenu,
    markdown,
    initAdsense,
    adUnit,
    pushAds,
    reveal
  };
})();
