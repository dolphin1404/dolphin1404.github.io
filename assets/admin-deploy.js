/* =============================================================================
 * admin-deploy.js — 관리자 편집기에서 GitHub로 바로 커밋(토큰 방식)
 *  admin.js 가 노출한 window.__ADMIN.model 을 읽어 content.js / posts.js 를
 *  GitHub Contents API 로 직접 커밋합니다. admin.js 뒤에 로드하세요.
 *
 *  보안: 토큰은 이 브라우저의 localStorage 에만 저장됩니다. 반드시
 *  "이 저장소 하나"에만 Contents(읽기/쓰기) 권한을 준 fine-grained 토큰을 쓰세요.
 * ========================================================================== */
(function () {
  "use strict";
  var A = window.__ADMIN;
  if (!A) { console.error("admin.js (window.__ADMIN) 가 먼저 로드되어야 합니다."); return; }

  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null) return; e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }
  function b64utf8(s) { return btoa(unescape(encodeURIComponent(s))); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function stamp() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); }

  var DEF = { owner: "", repo: "", branch: "main", pathContent: "data/content.js", pathPosts: "data/posts.js", token: "" };
  function cfg() { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem("pf_gh") || "{}")); } catch (e) { return Object.assign({}, DEF); } }
  function saveCfg(c) { try { localStorage.setItem("pf_gh", JSON.stringify(c)); } catch (e) {} }

  function exportText(which) {
    var m = A.model;
    if (which === "posts") return "/* posts.js — GitHub 커밋 " + stamp() + " */\nwindow.POSTS = " + JSON.stringify(m.posts, null, 2) + ";\n";
    return "/* content.js — GitHub 커밋 " + stamp() + " */\nwindow.CONTENT = " + JSON.stringify(m.content, null, 2) + ";\n";
  }

  // GitHub Contents API: 기존 파일 sha 조회 후 PUT(생성/수정)
  function ghHeaders(c) { return { "Authorization": "Bearer " + c.token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }; }
  function getSha(c, path) {
    var url = "https://api.github.com/repos/" + c.owner + "/" + c.repo + "/contents/" + path + "?ref=" + encodeURIComponent(c.branch);
    return fetch(url, { headers: ghHeaders(c) }).then(function (r) {
      if (r.status === 200) return r.json().then(function (j) { return j.sha; });
      if (r.status === 404) return null;            // 새 파일
      return r.json().then(function (j) { throw new Error("조회 실패 " + r.status + ": " + (j.message || "")); });
    });
  }
  function putFile(c, path, text, message) {
    return getSha(c, path).then(function (sha) {
      var url = "https://api.github.com/repos/" + c.owner + "/" + c.repo + "/contents/" + path;
      var body = { message: message, content: b64utf8(text), branch: c.branch };
      if (sha) body.sha = sha;
      return fetch(url, { method: "PUT", headers: ghHeaders(c), body: JSON.stringify(body) }).then(function (r) {
        return r.json().then(function (j) { if (!r.ok) throw new Error("커밋 실패 " + r.status + ": " + (j.message || "")); return j; });
      });
    });
  }

  /* ---- UI ---------------------------------------------------------- */
  var panel, statusEl;
  function field(c, key, label, type) {
    var inp = h("input", { type: type || "text", value: c[key] || "" });
    inp.addEventListener("input", function () { var cur = cfg(); cur[key] = inp.value; saveCfg(cur); });
    return h("div", { class: "field" }, [h("label", null, label), inp]);
  }
  function setStatus(msg, ok) { statusEl.textContent = msg; statusEl.style.color = ok === false ? "#e24b4a" : (ok ? "var(--accent-2)" : "var(--muted)"); }

  function commit(targets) {
    var c = cfg();
    if (!c.owner || !c.repo || !c.token) { setStatus("owner · repo · token 을 먼저 채워주세요.", false); return; }
    setStatus("커밋 중…");
    var jobs = [];
    if (targets.indexOf("content") > -1) jobs.push(["content.js", c.pathContent, exportText("content")]);
    if (targets.indexOf("posts") > -1) jobs.push(["posts.js", c.pathPosts, exportText("posts")]);
    var done = [];
    (function next(i) {
      if (i >= jobs.length) { setStatus("✓ 커밋 완료: " + done.join(", ") + " · " + stamp(), true); return; }
      var j = jobs[i];
      putFile(c, j[1], j[2], "admin: " + j[0] + " 업데이트 (" + stamp() + ")")
        .then(function () { done.push(j[0]); next(i + 1); })
        .catch(function (e) { setStatus("✗ " + j[0] + " — " + e.message, false); });
    })(0);
  }

  function buildPanel() {
    var c = cfg();
    panel = h("div", { class: "gh-panel", id: "ghPanel", style: "display:none" }, [
      h("div", { class: "gh-warn", html: "⚠ <b>토큰은 이 브라우저에만</b> 저장됩니다. 반드시 <b>이 저장소 하나</b>에 Contents 읽기/쓰기 권한만 준 fine-grained 토큰을 사용하세요. 공용 PC에서는 사용 후 토큰을 지우세요." }),
      h("div", { class: "gh-grid" }, [
        field(c, "owner", "GitHub owner (사용자명)"),
        field(c, "repo", "repo (예: 사용자명.github.io)"),
        field(c, "branch", "branch"),
        field(c, "token", "토큰 (fine-grained PAT)", "password"),
        field(c, "pathContent", "content.js 경로"),
        field(c, "pathPosts", "posts.js 경로")
      ]),
      h("div", { class: "gh-actions" }, [
        h("button", { class: "t-btn primary", onclick: function () { commit(["content", "posts"]); } }, "⬆ 둘 다 커밋"),
        h("button", { class: "t-btn", onclick: function () { commit(["content"]); } }, "content.js"),
        h("button", { class: "t-btn", onclick: function () { commit(["posts"]); } }, "posts.js"),
        (statusEl = h("span", { class: "gh-status" }, ""))
      ])
    ]);
    var anchor = document.querySelector(".banner") || document.querySelector(".tabs");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panel, anchor);
    else document.body.appendChild(panel);

    var toolbar = document.querySelector(".toolbar");
    if (toolbar) {
      var resetBtn = document.getElementById("btnReset");
      var ghBtn = h("button", { class: "t-btn", id: "btnGh", onclick: function () { panel.style.display = panel.style.display === "none" ? "block" : "none"; } }, "⬆ GitHub");
      if (resetBtn && resetBtn.parentNode === toolbar) toolbar.insertBefore(ghBtn, resetBtn); else toolbar.appendChild(ghBtn);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildPanel);
  else buildPanel();

  window.__ADMIN.exportText = exportText;
  window.__ADMIN.b64utf8 = b64utf8;
})();
