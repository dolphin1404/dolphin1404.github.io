/* =============================================================================
 * features.js — 테마, 블로그 공유 메타데이터, 선택적 조회수
 * 테마 이벤트는 STATE를 변경한 뒤 renderTheme으로 화면을 갱신합니다.
 * ========================================================================== */
(() => {
  "use strict";

  const PF = window.PF || (window.PF = {});
  const LANG = PF.LANG || (document.documentElement.lang === "en" ? "en" : "ko");
  const STATE = PF.STATE || { theme: "dark" };
  const ABACUS = "https://abacus.jasoncameron.dev";
  const t = (value) => PF.t
    ? PF.t(value)
    : (value == null ? "" : (typeof value === "string" ? value : (value[LANG] || value.ko || value.en || "")));
  const getContent = () => PF.getContent ? PF.getContent() : (window.CONTENT || {});
  const getPosts = () => PF.getPosts ? PF.getPosts() : (window.POSTS || []);

  const storageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_error) {
      // 저장이 차단돼도 현재 페이지의 테마 전환은 유지합니다.
    }
  };

  const renderTheme = () => {
    document.documentElement.setAttribute("data-theme", STATE.theme);
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    const isDark = STATE.theme === "dark";
    button.textContent = isDark ? "☀" : "☾";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark
        ? (LANG === "ko" ? "라이트 모드로 전환" : "Switch to light mode")
        : (LANG === "ko" ? "다크 모드로 전환" : "Switch to dark mode")
    );
    button.title = button.getAttribute("aria-label");
  };

  const bindTheme = () => {
    const button = document.querySelector(".theme-toggle");
    if (!button || button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      STATE.theme = STATE.theme === "dark" ? "light" : "dark";
      storageSet("pf_theme", STATE.theme);
      renderTheme();
    });
  };

  const setMeta = (attribute, key, value) => {
    if (value == null || value === "") return;
    let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", value);
  };

  const slugFromHref = (href) => {
    const match = /[?&]slug=([^&]+)/.exec(href || "");
    return match ? decodeURIComponent(match[1]) : "";
  };

  const formatNumber = (number) => {
    try {
      return Number(number).toLocaleString();
    } catch (_error) {
      return String(number);
    }
  };

  const viewsConfig = () => getContent().meta?.views || {};
  const viewsLabel = (views) => {
    if (views == null) return "";
    return LANG === "en" ? `· ${formatNumber(views)} views` : `· 조회 ${formatNumber(views)}`;
  };

  const callCounter = async (kind, namespace, key) => {
    const url = `${ABACUS}/${kind}/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Counter request failed");
      const data = await response.json();
      return data?.value ?? null;
    } catch (_error) {
      return null;
    }
  };

  const addViewCount = async (meta, kind, namespace, slug) => {
    const span = document.createElement("span");
    span.className = "post-views";
    meta.appendChild(span);
    const value = await callCounter(kind, namespace, slug);
    span.textContent = viewsLabel(value);
  };

  const enhanceBlog = () => {
    const main = document.getElementById("blogmain");
    if (!main) return;
    const config = viewsConfig();
    const viewsEnabled = Boolean(config.enabled && config.namespace);
    const slug = slugFromHref(location.search);

    if (slug) {
      const post = getPosts().find(({ slug: postSlug }) => postSlug === slug);
      if (!post) return;
      const url = location.href.split("#")[0];
      setMeta("property", "og:type", "article");
      setMeta("property", "og:title", t(post.title));
      setMeta("property", "og:description", t(post.summary));
      setMeta("property", "og:url", url);
      setMeta("name", "twitter:card", post.cover ? "summary_large_image" : "summary");
      setMeta("name", "twitter:title", t(post.title));
      setMeta("name", "twitter:description", t(post.summary));

      if (post.cover) {
        setMeta("property", "og:image", post.cover);
        setMeta("name", "twitter:image", post.cover);
        const title = main.querySelector(".article-title");
        if (title && !main.querySelector(".article-cover")) {
          const image = document.createElement("img");
          image.className = "article-cover";
          image.src = post.cover;
          image.alt = t(post.title);
          image.loading = "lazy";
          title.parentNode.insertBefore(image, title);
        }
      }

      if (viewsEnabled) {
        const meta = main.querySelector(".post-meta");
        if (!meta) return;
        let seen = false;
        try {
          seen = sessionStorage.getItem(`pf_seen_${slug}`) === "1";
        } catch (_error) {
          // 세션 저장소가 차단되면 매 요청을 조회로 처리합니다.
        }
        const kind = seen ? "get" : "hit";
        if (!seen) {
          try {
            sessionStorage.setItem(`pf_seen_${slug}`, "1");
          } catch (_error) {
            // 조회수 기능은 선택 기능이므로 저장 실패를 무시합니다.
          }
        }
        addViewCount(meta, kind, config.namespace, slug);
      }
      return;
    }

    if (viewsEnabled) {
      main.querySelectorAll(".post-card").forEach((card) => {
        const cardSlug = slugFromHref(card.getAttribute("href"));
        const meta = card.querySelector(".post-meta");
        if (cardSlug && meta) addViewCount(meta, "get", config.namespace, cardSlug);
      });
    }
  };

  const run = () => {
    renderTheme();
    bindTheme();
    enhanceBlog();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  PF.applyTheme = (theme) => {
    STATE.theme = theme;
    renderTheme();
  };
  PF.currentTheme = () => STATE.theme;
  PF.renderTheme = renderTheme;
  PF.setMeta = setMeta;
})();
