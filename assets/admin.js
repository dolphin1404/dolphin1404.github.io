/* =============================================================================
 * admin.js — 관리자 편집기
 *  - content.js / posts.js 를 불러와 폼으로 편집
 *  - 입력 즉시 localStorage(pf_draft_*) 자동 저장
 *  - content.js / posts.js 내보내기(다운로드) · 불러오기(가져오기)
 *  - ?preview=1 로 실제 사이트에서 저장 전 미리보기
 * ========================================================================== */
(function () {
  "use strict";
  function el(id) { return document.getElementById(id); }
  function clone(x) { return JSON.parse(JSON.stringify(x == null ? null : x)); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function time() { var d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); }
  function stamp() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + time(); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function status(msg) { el("saveStatus").textContent = msg; }

  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null) return;
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }

  /* ---- 모델 (편집 중인 데이터) ------------------------------------- */
  var model = { content: null, posts: null };
  try { var dc = localStorage.getItem("pf_draft_content"); model.content = dc ? JSON.parse(dc) : clone(window.CONTENT || {}); }
  catch (e) { model.content = clone(window.CONTENT || {}); }
  try { var dp = localStorage.getItem("pf_draft_posts"); model.posts = dp ? JSON.parse(dp) : clone(window.POSTS || []); }
  catch (e2) { model.posts = clone(window.POSTS || []); }

  function normalize() {
    var c = model.content || (model.content = {});
    if (!c.meta) c.meta = {};
    if (!c.meta.adsense) c.meta.adsense = { enabled: false, client: "", slot: "" };
    if (!c.meta.views) c.meta.views = { enabled: false, namespace: "" };
    if (!c.nav) c.nav = {};
    ["education", "experience", "projects", "skills", "awards"].forEach(function (k) { if (!Array.isArray(c[k])) c[k] = []; });
    if (!Array.isArray(model.posts)) model.posts = [];
  }
  normalize();

  var saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem("pf_draft_content", JSON.stringify(model.content));
        localStorage.setItem("pf_draft_posts", JSON.stringify(model.posts));
        status("자동 저장됨 · " + time());
      } catch (e) { status("저장 실패: " + e.message); }
    }, 300);
  }

  /* ---- 필드 빌더 --------------------------------------------------- */
  function ensureBi(o, k) { if (!o[k] || typeof o[k] !== "object" || Array.isArray(o[k])) o[k] = { ko: "", en: "" }; return o[k]; }
  function ensureBiList(o, k) { var v = o[k]; if (!v || typeof v !== "object" || Array.isArray(v)) v = { ko: [], en: [] }; if (!Array.isArray(v.ko)) v.ko = []; if (!Array.isArray(v.en)) v.en = []; o[k] = v; return v; }
  function ensureArr(o, k) { if (!Array.isArray(o[k])) o[k] = []; return o[k]; }

  function fText(o, k, label, type) {
    var inp = h("input", { type: type || "text" }); inp.value = o[k] == null ? "" : o[k];
    inp.addEventListener("input", function () { o[k] = inp.value; save(); });
    return h("div", { class: "field" }, [h("label", null, label), inp]);
  }
  function fCheck(o, k, label) {
    var inp = h("input", { type: "checkbox" }); inp.checked = !!o[k];
    inp.addEventListener("change", function () { o[k] = inp.checked; save(); });
    return h("div", { class: "field" }, [h("label", { class: "checkbox-row" }, [inp, " " + label])]);
  }
  function fBi(o, k, label, area, big) {
    var bi = ensureBi(o, k);
    function col(lang, name) {
      var inp = area ? h("textarea", big ? { class: "big" } : null) : h("input", { type: "text" });
      inp.value = bi[lang] == null ? "" : bi[lang];
      inp.addEventListener("input", function () { bi[lang] = inp.value; save(); });
      return h("div", { class: "col" }, [h("label", null, name), inp]);
    }
    return h("div", { class: "field" }, [h("label", null, label), h("div", { class: "bi" }, [col("ko", "한국어"), col("en", "English")])]);
  }
  function fBiList(o, k, label) {
    var bi = ensureBiList(o, k);
    function col(lang, name) {
      var ta = h("textarea"); ta.value = (bi[lang] || []).join("\n");
      ta.addEventListener("input", function () { bi[lang] = ta.value.split("\n").filter(function (s) { return s.trim() !== ""; }); save(); });
      return h("div", { class: "col" }, [h("label", null, name + " (한 줄 = 한 항목)"), ta]);
    }
    return h("div", { class: "field" }, [h("label", null, label), h("div", { class: "bi" }, [col("ko", "한국어"), col("en", "English")])]);
  }
  function fBiTags(o, k, label) {
    var bi = ensureBiList(o, k);
    function col(lang, name) {
      var inp = h("input", { type: "text" }); inp.value = (bi[lang] || []).join(", ");
      inp.addEventListener("input", function () { bi[lang] = inp.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean); save(); });
      return h("div", { class: "col" }, [h("label", null, name), inp]);
    }
    return h("div", { class: "field" }, [h("label", null, label + " (쉼표로 구분)"), h("div", { class: "bi" }, [col("ko", "한국어"), col("en", "English")])]);
  }
  function fTags(o, k, label) {
    ensureArr(o, k); var inp = h("input", { type: "text" }); inp.value = o[k].join(", ");
    inp.addEventListener("input", function () { o[k] = inp.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean); save(); });
    return h("div", { class: "field" }, [h("label", null, label + " (쉼표로 구분)"), inp]);
  }
  function fList(o, k, label) {
    ensureArr(o, k); var ta = h("textarea"); ta.value = o[k].join("\n");
    ta.addEventListener("input", function () { o[k] = ta.value.split("\n").filter(function (s) { return s.trim() !== ""; }); save(); });
    return h("div", { class: "field" }, [h("label", null, label + " (한 줄 = 한 항목)"), ta]);
  }

  /* ---- 리스트 섹션 렌더러 ------------------------------------------ */
  function listRender(hint, getArr, titleFn, fieldsFn, template) {
    return function (pane) {
      function draw() {
        var arr = getArr(); pane.innerHTML = "";
        if (hint) pane.appendChild(h("div", { class: "pane-hint", html: hint }));
        arr.forEach(function (item, idx) {
          var head = h("div", { class: "item-head" }, [
            h("span", { class: "idx" }, "#" + (idx + 1)),
            h("span", { class: "ttl" }, titleFn(item) || "(제목 없음)"),
            h("span", { class: "sp" }),
            h("button", { class: "mini", title: "위로", onclick: function () { if (idx > 0) { var x = arr[idx - 1]; arr[idx - 1] = arr[idx]; arr[idx] = x; save(); draw(); } } }, "↑"),
            h("button", { class: "mini", title: "아래로", onclick: function () { if (idx < arr.length - 1) { var x = arr[idx + 1]; arr[idx + 1] = arr[idx]; arr[idx] = x; save(); draw(); } } }, "↓"),
            h("button", { class: "mini danger", title: "삭제", onclick: function () { if (confirm("이 항목을 삭제할까요?")) { arr.splice(idx, 1); save(); draw(); } } }, "✕")
          ]);
          pane.appendChild(h("div", { class: "item" }, [head].concat(fieldsFn(item))));
        });
        pane.appendChild(h("div", { class: "add-row" }, [
          h("button", { class: "add-btn", onclick: function () { arr.push(clone(template())); save(); draw(); } }, "+ 새 항목 추가")
        ]));
      }
      draw();
    };
  }

  function renderMeta(pane) {
    normalize(); var m = model.content.meta;
    pane.innerHTML = "";
    pane.appendChild(h("div", { class: "pane-hint", html: "상단 소개·연락처. 빈 값은 해당 버튼이 자동으로 숨겨집니다." }));
    pane.appendChild(h("div", { class: "item" }, [
      fText(m, "handle", "핸들 (터미널 ~/ 뒤 표시)"),
      fBi(m, "name", "이름"), fBi(m, "role", "직함"),
      fBi(m, "tagline", "한 줄 소개"), fBi(m, "summary", "요약 (소개 섹션)", true),
      fBi(m, "location", "위치"),
      fText(m, "email", "이메일"), fText(m, "github", "GitHub URL"),
      fText(m, "resumeFile", "이력서 파일 경로")
    ]));
    pane.appendChild(h("div", { class: "item" }, [
      h("div", { class: "pane-hint", html: "Google AdSense — <b>승인 후에만</b> 켜세요." }),
      fCheck(m.adsense, "enabled", "광고 사용"),
      fText(m.adsense, "client", "client (ca-pub-...)"),
      fText(m.adsense, "slot", "슬롯 ID (선택)")
    ]));
    pane.appendChild(h("div", { class: "item" }, [
      h("div", { class: "pane-hint", html: "조회수(Abacus 무료 카운터) — 켜고 namespace(예: 도메인)를 정하세요." }),
      fCheck(m.views, "enabled", "조회수 사용"),
      fText(m.views, "namespace", "namespace (예: kyumin-github-io)")
    ]));
  }

  var sections = [
    { id: "meta", label: "기본정보", render: renderMeta },
    { id: "education", label: "학력", render: listRender(
      "학교·연구 등 학력 항목.",
      function () { return model.content.education; },
      function (it) { return it.school && it.school.ko; },
      function (it) { return [fBi(it, "school", "학교/구분"), fBi(it, "degree", "학위/내용"), fBi(it, "period", "기간"), fBi(it, "detail", "상세", true)]; },
      function () { return { school: { ko: "", en: "" }, degree: { ko: "", en: "" }, period: { ko: "", en: "" }, detail: { ko: "", en: "" } }; }) },
    { id: "experience", label: "경력", render: listRender(
      "회사·연구실 경력. 불릿은 한 줄에 하나씩.",
      function () { return model.content.experience; },
      function (it) { return it.org && it.org.ko; },
      function (it) { return [fBi(it, "org", "기관/회사"), fBi(it, "title", "직함"), fBi(it, "period", "기간"), fBiList(it, "bullets", "성과 불릿")]; },
      function () { return { org: { ko: "", en: "" }, title: { ko: "", en: "" }, period: { ko: "", en: "" }, bullets: { ko: [], en: [] } }; }) },
    { id: "projects", label: "프로젝트", render: listRender(
      "대표작은 <code>featured</code> 를 켜면 왼쪽에 강조선이 붙습니다.",
      function () { return model.content.projects; },
      function (it) { return it.name && it.name.ko; },
      function (it) { return [fBi(it, "name", "프로젝트명"), fText(it, "year", "연도"), fBi(it, "role", "역할"), fBi(it, "badge", "배지 (수상/상태)"), fCheck(it, "featured", "대표작(featured)"), fBi(it, "summary", "요약", true), fBiList(it, "bullets", "상세 불릿"), fTags(it, "tags", "태그"), fText(it, "link", "링크 URL")]; },
      function () { return { name: { ko: "", en: "" }, year: "", role: { ko: "", en: "" }, badge: { ko: "", en: "" }, featured: false, summary: { ko: "", en: "" }, bullets: { ko: [], en: [] }, tags: [], link: "" }; }) },
    { id: "skills", label: "기술", render: listRender(
      "그룹별 기술 묶음.",
      function () { return model.content.skills; },
      function (it) { return it.group && it.group.ko; },
      function (it) { return [fBi(it, "group", "그룹명"), fList(it, "items", "항목")]; },
      function () { return { group: { ko: "", en: "" }, items: [] }; }) },
    { id: "awards", label: "수상", render: listRender(
      "수상·장학 내역.",
      function () { return model.content.awards; },
      function (it) { return it.title && it.title.ko; },
      function (it) { return [fBi(it, "title", "수상명"), fBi(it, "org", "주최"), fBi(it, "date", "일자"), fBi(it, "note", "비고")]; },
      function () { return { title: { ko: "", en: "" }, org: { ko: "", en: "" }, date: { ko: "", en: "" }, note: { ko: "", en: "" } }; }) },
    { id: "posts", label: "블로그", render: listRender(
      "글 1개 = 항목 1개. <code>slug</code> 은 주소(영문·하이픈), <code>draft</code> 켜면 목록에 숨김. 본문은 마크다운.",
      function () { return model.posts; },
      function (it) { return (it.title && it.title.ko) || it.slug; },
      function (it) { return [fText(it, "slug", "slug (주소)"), fText(it, "date", "작성일", "date"), fText(it, "cover", "대표 이미지 URL (OG·선택)"), fCheck(it, "draft", "초안(draft) — 목록에서 숨김"), fBi(it, "title", "제목"), fBi(it, "summary", "요약", true), fBiTags(it, "tags", "태그"), fBi(it, "body", "본문 (마크다운)", true, true)]; },
      function () { return { slug: "new-post", date: today(), draft: true, cover: "", tags: { ko: [], en: [] }, title: { ko: "", en: "" }, summary: { ko: "", en: "" }, body: { ko: "", en: "" } }; }) }
  ];

  /* ---- 탭/패널 ----------------------------------------------------- */
  var tabsEl = el("tabs"), panesEl = el("panes"), panes = {}, currentTab = sections[0].id;
  sections.forEach(function (s, i) {
    tabsEl.appendChild(h("button", { class: "tab" + (i === 0 ? " active" : ""), "data-id": s.id, onclick: function () { selectTab(s.id); } }, s.label));
    var pane = h("div", { class: "pane" + (i === 0 ? " active" : ""), id: "pane-" + s.id });
    panesEl.appendChild(pane); panes[s.id] = pane; s.render(pane);
  });
  function selectTab(id) {
    currentTab = id;
    tabsEl.querySelectorAll(".tab").forEach(function (t) { t.classList.toggle("active", t.getAttribute("data-id") === id); });
    Object.keys(panes).forEach(function (k) { panes[k].classList.toggle("active", k === id); });
  }
  function renderAll() { sections.forEach(function (s) { s.render(panes[s.id]); }); }

  /* ---- 내보내기 / 불러오기 / 미리보기 / 복원 ----------------------- */
  function download(filename, text) {
    var blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob), a = h("a", { href: url, download: filename });
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 100);
  }
  el("btnExportContent").addEventListener("click", function () {
    download("content.js", "/* content.js — 관리자 편집기에서 내보냄 " + stamp() + " */\nwindow.CONTENT = " + JSON.stringify(model.content, null, 2) + ";\n");
    status("content.js 내보냄 · " + time());
  });
  el("btnExportPosts").addEventListener("click", function () {
    download("posts.js", "/* posts.js — 관리자 편집기에서 내보냄 " + stamp() + " */\nwindow.POSTS = " + JSON.stringify(model.posts, null, 2) + ";\n");
    status("posts.js 내보냄 · " + time());
  });

  el("btnImport").addEventListener("click", function () { el("fileInput").click(); });
  el("fileInput").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var sandbox = {};
        new Function("window", String(reader.result))(sandbox);
        var loaded = [];
        if (sandbox.CONTENT) { model.content = sandbox.CONTENT; loaded.push("content"); }
        if (sandbox.POSTS) { model.posts = sandbox.POSTS; loaded.push("posts"); }
        if (!loaded.length) { alert("이 파일에서 window.CONTENT 나 window.POSTS 를 찾지 못했습니다."); return; }
        normalize(); save(); renderAll();
        status("불러옴: " + loaded.join(", ") + " · " + time());
      } catch (e) { alert("불러오기 실패: " + e.message); }
      el("fileInput").value = "";
    };
    reader.readAsText(file);
  });

  function previewUrl(lang) { return "../" + lang + (currentTab === "posts" ? "/blog.html?preview=1" : "/?preview=1"); }
  el("btnPreviewKo").addEventListener("click", function () { save(); window.open(previewUrl("ko"), "_blank"); });
  el("btnPreviewEn").addEventListener("click", function () { save(); window.open(previewUrl("en"), "_blank"); });

  el("btnReset").addEventListener("click", function () {
    if (!confirm("편집 내용을 버리고 파일 원본(content.js·posts.js)으로 되돌릴까요?")) return;
    localStorage.removeItem("pf_draft_content"); localStorage.removeItem("pf_draft_posts");
    model.content = clone(window.CONTENT || {}); model.posts = clone(window.POSTS || []);
    normalize(); renderAll(); status("원본 복원됨 · " + time());
  });

  window.__ADMIN = { model: model, normalize: normalize, save: save };
  status((dc || dp) ? "이어서 편집 중 · 자동 저장 켜짐" : "원본 로드됨 · 자동 저장 켜짐");
})();
