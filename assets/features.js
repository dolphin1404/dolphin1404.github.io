/* =============================================================================
 * features.js — 공개 페이지(메인·블로그)에 얹는 추가 기능 (순수 부가 기능)
 *  1) 다크/라이트 테마 토글
 *  2) 블로그 글별 OG/Twitter 메타 + 대표 이미지
 *  3) 조회수 (설정으로 on/off, 장애 시 조용히 숨김)
 * common.js 와 app.js/blog.js 뒤에 로드하세요. 기존 파일은 건드리지 않습니다.
 * ========================================================================== */
(function () {
  "use strict";
  var PF = window.PF || (window.PF = {});
  var LANG = (window.SITE_LANG === "en") ? "en" : "ko";
  function t(v) { return PF.t ? PF.t(v) : (v == null ? "" : (typeof v === "string" ? v : (v[LANG] || v.ko || v.en || ""))); }
  function getContent() { return PF.getContent ? PF.getContent() : (window.CONTENT || {}); }
  function getPosts() { return PF.getPosts ? PF.getPosts() : (window.POSTS || []); }

  /* ---- 1) 테마 ----------------------------------------------------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function systemTheme() { try { return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"; } catch (e) { return "dark"; } }
  function currentTheme() { return document.documentElement.getAttribute("data-theme") || lsGet("pf_theme") || systemTheme(); }
  function applyTheme(th) { document.documentElement.setAttribute("data-theme", th); }
  function initTheme() { applyTheme(currentTheme()); }

  function injectThemeToggle() {
    var lt = document.querySelector(".lang-toggle");
    if (!lt || document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "테마 전환 / toggle theme");
    function icon() { btn.textContent = currentTheme() === "light" ? "☾" : "☀"; }
    icon();
    btn.addEventListener("click", function () {
      var nt = currentTheme() === "light" ? "dark" : "light";
      applyTheme(nt); lsSet("pf_theme", nt); icon();
    });
    lt.parentNode.insertBefore(btn, lt);
  }

  /* ---- 2) OG / Twitter 메타 --------------------------------------- */
  function setMeta(attr, key, val) {
    if (val == null || val === "") return;
    var m = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
    m.setAttribute("content", val);
  }
  function slugFromHref(href) { var m = /[?&]slug=([^&]+)/.exec(href || ""); return m ? decodeURIComponent(m[1]) : ""; }

  /* ---- 3) 조회수 (Abacus 무료 카운터, CORS 허용, 장애 시 숨김) ----- */
  var ABACUS = "https://abacus.jasoncameron.dev";
  function fmtNum(n) { try { return Number(n).toLocaleString(); } catch (e) { return "" + n; } }
  function viewsCfg() { var c = getContent(); return (c.meta && c.meta.views) || {}; }
  function callCounter(kind, ns, key, cb) {
    var url = ABACUS + "/" + kind + "/" + encodeURIComponent(ns) + "/" + encodeURIComponent(key);
    fetch(url).then(function (r) { return r.json(); }).then(function (d) { cb(d && (d.value != null ? d.value : null)); }).catch(function () { cb(null); });
  }
  function viewsLabel(v) { return v == null ? "" : (LANG === "en" ? ("· " + fmtNum(v) + " views") : ("· 조회 " + fmtNum(v))); }

  function enhanceBlog() {
    var main = document.getElementById("blogmain");
    if (!main) return;
    var cfg = viewsCfg(), viewsOn = !!(cfg.enabled && cfg.namespace);
    var slug = slugFromHref(location.search);

    if (slug) {                                   // 글 상세
      var post = getPosts().filter(function (p) { return p.slug === slug; })[0];
      if (!post) return;
      var url = location.href.split("#")[0];
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
        var title = main.querySelector(".article-title");
        if (title && !main.querySelector(".article-cover")) {
          var img = document.createElement("img");
          img.className = "article-cover"; img.src = post.cover; img.alt = t(post.title); img.loading = "lazy";
          title.parentNode.insertBefore(img, title);
        }
      }
      if (viewsOn) {
        var meta = main.querySelector(".post-meta");
        if (meta) {
          var span = document.createElement("span"); span.className = "post-views"; meta.appendChild(span);
          var seen = false; try { seen = sessionStorage.getItem("pf_seen_" + slug) === "1"; } catch (e) {}
          var show = function (v) { span.textContent = viewsLabel(v); };
          if (seen) callCounter("get", cfg.namespace, slug, show);
          else callCounter("hit", cfg.namespace, slug, function (v) { try { sessionStorage.setItem("pf_seen_" + slug, "1"); } catch (e) {} show(v); });
        }
      }
    } else if (viewsOn) {                          // 목록: 카드별 조회수(증가 안 함)
      main.querySelectorAll(".post-card").forEach(function (card) {
        var s = slugFromHref(card.getAttribute("href")); if (!s) return;
        var meta = card.querySelector(".post-meta"); if (!meta) return;
        var span = document.createElement("span"); span.className = "post-views"; meta.appendChild(span);
        callCounter("get", cfg.namespace, s, function (v) { span.textContent = viewsLabel(v); });
      });
    }
  }

  function run() { initTheme(); injectThemeToggle(); enhanceBlog(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  PF.applyTheme = applyTheme; PF.currentTheme = currentTheme; PF.setMeta = setMeta;
})();
