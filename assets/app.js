/* =============================================================================
 * app.js — 메인 포트폴리오 렌더링과 상태 기반 상호작용
 * 이벤트 → window.PF.STATE 변경 → 담당 render 함수 호출
 * ========================================================================== */
(() => {
  "use strict";

  const PF = window.PF;
  if (!PF) {
    console.error("common.js (window.PF)가 먼저 로드되어야 합니다.");
    return;
  }
  const CONTENT = PF.getContent();
  if (!CONTENT) {
    console.error("content.js (window.CONTENT)를 찾을 수 없습니다.");
    return;
  }

  const { STATE, STR, esc, t } = PF;
  const GITHUB_API = "https://api.github.com/users/dolphin1404/repos?sort=updated&per_page=100";
  const LANGUAGE = PF.LANG;
  const byId = (id) => document.getElementById(id);

  const COPY = {
    ko: {
      featured: "대표 프로젝트",
      githubRepos: "GitHub 저장소",
      githubDescription: "GitHub API에서 실시간으로 가져온 공개 저장소입니다.",
      loading: "프로젝트를 불러오는 중...",
      loadError: "프로젝트를 불러올 수 없습니다.",
      rateLimit: "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.",
      retry: "다시 시도",
      empty: "표시할 프로젝트가 없습니다.",
      noDescription: "등록된 설명이 없습니다.",
      all: "전체",
      updated: "업데이트",
      contact: "연락",
      contactIntro: "문의 내용을 입력해 주세요. 이 예제는 유효성 검사 후 성공 상태만 표시합니다.",
      name: "이름",
      email: "이메일",
      message: "메시지",
      namePlaceholder: "홍길동",
      emailPlaceholder: "name@example.com",
      messagePlaceholder: "문의 내용을 입력해 주세요.",
      send: "보내기",
      required: "필수 입력 항목입니다.",
      invalidEmail: "올바른 이메일 형식을 입력해 주세요.",
      success: "입력 내용이 확인되었습니다. 감사합니다!",
      profileAlt: "이규민의 GitHub 프로필 사진",
      aboutLabel: "이규민 소개",
      backTop: "맨 위로 이동"
    },
    en: {
      featured: "Featured projects",
      githubRepos: "GitHub repositories",
      githubDescription: "Public repositories loaded live from the GitHub API.",
      loading: "Loading projects...",
      loadError: "Unable to load projects.",
      rateLimit: "The GitHub API rate limit was reached. Please try again later.",
      retry: "Try again",
      empty: "No projects to display.",
      noDescription: "No description provided.",
      all: "All",
      updated: "Updated",
      contact: "Contact",
      contactIntro: "Enter your message. This demo validates the form and shows a success state.",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "name@example.com",
      messagePlaceholder: "Tell me what you would like to discuss.",
      send: "Send",
      required: "This field is required.",
      invalidEmail: "Enter a valid email address.",
      success: "Your message passed validation. Thank you!",
      profileAlt: "GitHub profile photo of Kyumin Lee",
      aboutLabel: "About Kyumin Lee",
      backTop: "Back to top"
    }
  }[LANGUAGE];

  document.documentElement.lang = LANGUAGE;
  document.title = `${t(CONTENT.meta.name)} — ${t(CONTENT.meta.role)}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription?.setAttribute("content", t(CONTENT.meta.summary).slice(0, 155));

  const section = (id, index, innerHtml, label = t(CONTENT.nav[id])) => `
    <section id="${id}" class="reveal" aria-labelledby="${id}-title">
      <div class="wrap">
        <h2 class="section-head" id="${id}-title">
          <span class="hash">#</span>${esc(label)}
          <span class="idx">${index}</span>
        </h2>
        ${innerHtml}
      </div>
    </section>
  `;

  const buildHero = () => {
    const meta = CONTENT.meta;
    const details = [
      `<span><span class="ic" aria-hidden="true">◉</span>${esc(t(meta.location))}</span>`
    ];
    const buttons = [];
    if (meta.email) {
      details.push(`<span><span class="ic" aria-hidden="true">✉</span>${esc(meta.email)}</span>`);
      buttons.push(`<a class="btn btn-primary" href="mailto:${esc(meta.email)}">✉ ${esc(STR.email)}</a>`);
    }
    if (meta.resumeFile) {
      buttons.push(`<a class="btn" href="${esc(meta.resumeFile)}" target="_blank" rel="noopener">⤓ ${esc(STR.resume)}</a>`);
    }
    if (meta.github) {
      buttons.push(`<a class="btn" href="${esc(meta.github)}" target="_blank" rel="noopener">⌘ ${esc(STR.github)}</a>`);
    }
    buttons.push(`<a class="btn" href="#projects">${esc(t(CONTENT.nav.projects))}</a>`);
    buttons.push(`<a class="btn" href="#contact">${esc(COPY.contact)}</a>`);

    byId("hero").innerHTML = `
      <div class="wrap">
        <div class="hero-term"><span class="accent">$</span> whoami</div>
        <h1>${esc(t(meta.name))}</h1>
        <div class="role">${esc(t(meta.role))}<span class="cursor" aria-hidden="true"></span></div>
        <p class="tagline">${esc(t(meta.tagline))}</p>
        <p class="summary">${esc(t(meta.summary))}</p>
        <div class="hero-meta">${details.join("")}</div>
        <div class="btn-row">${buttons.join("")}</div>
      </div>
    `;
  };

  const buildAbout = () => section("about", "00", `
    <div class="about-grid">
      <img
        class="profile-image"
        src="../images/profile.jpg"
        alt="${esc(COPY.profileAlt)}"
        width="320"
        height="320"
      />
      <article class="about-copy" aria-label="${esc(COPY.aboutLabel)}">
        <p>${esc(t(CONTENT.meta.summary))}</p>
      </article>
    </div>
  `);

  const buildEducation = () => {
    const cards = CONTENT.education.map(({ school, degree, period, detail }) => `
      <article class="tl-item">
        <div class="tl-top">
          <h3 class="tl-org">${esc(t(school))}</h3>
          <span class="tl-period">${esc(t(period))}</span>
        </div>
        <div class="tl-title">${esc(t(degree))}</div>
        <p class="tl-detail">${esc(t(detail))}</p>
      </article>
    `).join("");
    return section("education", "01", `<div class="timeline">${cards}</div>`);
  };

  const buildExperience = () => {
    const cards = CONTENT.experience.map(({ org, title, period, bullets }) => {
      const items = (t(bullets) || []).map((bullet) => `<li>${esc(bullet)}</li>`).join("");
      return `
        <article class="tl-item">
          <div class="tl-top">
            <h3 class="tl-org">${esc(t(org))}</h3>
            <span class="tl-period">${esc(t(period))}</span>
          </div>
          <div class="tl-title">${esc(t(title))}</div>
          ${items ? `<ul class="tl-bullets">${items}</ul>` : ""}
        </article>
      `;
    }).join("");
    return section("experience", "02", `<div class="timeline">${cards}</div>`);
  };

  const buildFeaturedProjectCards = () => CONTENT.projects.map((project) => {
    const { name, year, role, badge, featured, summary, bullets, tags, link } = project;
    const bulletItems = (t(bullets) || []).map((bullet) => `<li>${esc(bullet)}</li>`).join("");
    const tagItems = (tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("");
    const badgeHtml = t(badge) ? `<span class="proj-badge">${esc(t(badge))}</span>` : "";
    const linkHtml = link
      ? `<a class="proj-link" href="${esc(link)}" target="_blank" rel="noopener">${esc(STR.live)}</a>`
      : "";
    return `
      <article class="proj${featured ? " featured" : ""}">
        <div class="proj-top">
          <h4 class="proj-name">${esc(t(name))}</h4>
          <span class="proj-year">${esc(year || "")}</span>
        </div>
        <div class="proj-role">${esc(t(role))}</div>
        ${badgeHtml}
        <p class="proj-summary">${esc(t(summary))}</p>
        ${bulletItems ? `<ul class="proj-bullets">${bulletItems}</ul>` : ""}
        <div class="proj-foot">${tagItems}${linkHtml}</div>
      </article>
    `;
  }).join("");

  const buildProjects = () => section("projects", "03", `
    <div class="project-group">
      <h3 class="subsection-title">${esc(COPY.featured)}</h3>
      <div class="proj-grid">${buildFeaturedProjectCards()}</div>
    </div>
    <div class="project-group github-projects" id="githubProjects">
      <div class="github-heading">
        <div>
          <h3 class="subsection-title">${esc(COPY.githubRepos)}</h3>
          <p class="section-note">${esc(COPY.githubDescription)}</p>
        </div>
        <a class="github-profile-link" href="https://github.com/dolphin1404" target="_blank" rel="noopener">
          github.com/dolphin1404 ↗
        </a>
      </div>
      <div class="repo-filters" id="repoFilters" aria-label="${esc(COPY.githubRepos)}"></div>
      <div class="repo-status" id="repoStatus" role="status" aria-live="polite"></div>
      <div class="repo-grid" id="repoGrid"></div>
    </div>
  `);

  const buildSkills = () => {
    const cards = CONTENT.skills.map(({ group, items }) => `
      <article class="skill-card">
        <h3>${esc(t(group))}</h3>
        <div class="skill-tags">${(items || []).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div>
      </article>
    `).join("");
    return section("skills", "04", `<div class="skills-grid">${cards}</div>`);
  };

  const buildAwards = () => {
    const awards = CONTENT.awards.map(({ title, org, date, note }) => `
      <article class="award">
        <h3 class="award-title">${esc(t(title))}</h3>
        <span class="award-org">${esc(t(org))}</span>
        <span class="award-date">${esc(t(date))}</span>
        ${t(note) ? `<p class="award-note">${esc(t(note))}</p>` : ""}
      </article>
    `).join("");
    return section("awards", "05", `<div class="awards-list">${awards}</div>`);
  };

  const formField = ({ id, label, type = "text", autocomplete, placeholder, textarea = false }) => {
    const describedBy = `${id}Error`;
    const commonAttributes = `
      id="${id}"
      name="${id}"
      placeholder="${esc(placeholder)}"
      autocomplete="${autocomplete}"
      aria-describedby="${describedBy}"
      required
    `;
    const input = textarea
      ? `<textarea ${commonAttributes} rows="6"></textarea>`
      : `<input ${commonAttributes} type="${type}" />`;
    return `
      <div class="form-field">
        <label for="${id}">${esc(label)}</label>
        ${input}
        <p class="field-error" id="${describedBy}"></p>
      </div>
    `;
  };

  const buildContact = () => section("contact", "06", `
    <div class="contact-layout">
      <div class="contact-copy">
        <p>${esc(COPY.contactIntro)}</p>
        <a href="mailto:${esc(CONTENT.meta.email)}">${esc(CONTENT.meta.email)}</a>
      </div>
      <form id="contactForm" class="contact-form" novalidate>
        ${formField({
          id: "name",
          label: COPY.name,
          autocomplete: "name",
          placeholder: COPY.namePlaceholder
        })}
        ${formField({
          id: "email",
          label: COPY.email,
          type: "email",
          autocomplete: "email",
          placeholder: COPY.emailPlaceholder
        })}
        ${formField({
          id: "message",
          label: COPY.message,
          autocomplete: "off",
          placeholder: COPY.messagePlaceholder,
          textarea: true
        })}
        <button class="btn btn-primary" type="submit">${esc(COPY.send)}</button>
        <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
      </form>
    </div>
  `, COPY.contact);

  const buildFooter = () => {
    const meta = CONTENT.meta;
    const links = [];
    if (meta.email) links.push(`<a href="mailto:${esc(meta.email)}">${esc(STR.email)}</a>`);
    if (meta.github) {
      links.push(`<a href="${esc(meta.github)}" target="_blank" rel="noopener">${esc(STR.github)}</a>`);
    }
    links.push(`<a href="blog.html">${esc(t(CONTENT.nav.blog))}</a>`);

    byId("footer").innerHTML = `
      <div class="wrap">
        <div class="term"><span class="accent">$</span> echo "${esc(t(meta.name))} © ${new Date().getFullYear()}"</div>
        <div class="links">${links.join("")}</div>
        <div class="term footer-built">${esc(STR.builtWith)}</div>
      </div>
    `;

    if (!byId("backToTop")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `<button class="back-to-top" id="backToTop" type="button" aria-label="${esc(COPY.backTop)}" hidden>↑</button>`
      );
    }
  };

  const visibleRepositories = () => {
    const { items, filter } = STATE.projects;
    if (filter === "all") return items;
    return items.filter(({ language }) => (language || "Other") === filter);
  };

  const renderRepositoryFilters = () => {
    const filters = byId("repoFilters");
    if (!filters) return;
    if (STATE.projects.status !== "success" || !STATE.projects.items.length) {
      filters.innerHTML = "";
      return;
    }

    const languages = [
      ...new Set(STATE.projects.items.map(({ language }) => language || "Other"))
    ].sort((a, b) => a.localeCompare(b));

    filters.innerHTML = [
      { value: "all", label: COPY.all },
      ...languages.map((language) => ({ value: language, label: language }))
    ].map(({ value, label }) => `
      <button
        class="filter-btn"
        type="button"
        data-filter="${esc(value)}"
        aria-pressed="${String(STATE.projects.filter === value)}"
      >${esc(label)}</button>
    `).join("");
  };

  const renderProjects = () => {
    const status = byId("repoStatus");
    const grid = byId("repoGrid");
    if (!status || !grid) return;

    renderRepositoryFilters();
    grid.innerHTML = "";
    status.className = "repo-status";

    if (STATE.projects.status === "loading") {
      status.innerHTML = `<span class="spinner" aria-hidden="true"></span>${esc(COPY.loading)}`;
      return;
    }
    if (STATE.projects.status === "error") {
      status.classList.add("error");
      status.innerHTML = `
        <span>${esc(STATE.projects.error || COPY.loadError)}</span>
        <button class="btn retry-btn" type="button" data-action="retry">${esc(COPY.retry)}</button>
      `;
      return;
    }
    if (STATE.projects.status !== "success") return;

    const repositories = visibleRepositories();
    if (!repositories.length) {
      status.textContent = COPY.empty;
      return;
    }

    status.textContent = "";
    const dateFormatter = new Intl.DateTimeFormat(LANGUAGE === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    grid.innerHTML = repositories.map((repository) => {
      const {
        name,
        description,
        html_url: htmlUrl,
        language,
        stargazers_count: stars,
        updated_at: updatedAt
      } = repository;
      return `
        <article class="repo-card">
          <div class="repo-card-top">
            <h4><a href="${esc(htmlUrl)}" target="_blank" rel="noopener">${esc(name)} ↗</a></h4>
            <span aria-label="${stars} stars">★ ${stars}</span>
          </div>
          <p>${esc(description || COPY.noDescription)}</p>
          <div class="repo-meta">
            <span>${esc(language || "Other")}</span>
            <time datetime="${esc(updatedAt)}">${esc(COPY.updated)} ${esc(dateFormatter.format(new Date(updatedAt)))}</time>
          </div>
        </article>
      `;
    }).join("");
  };

  const loadGithubProjects = async () => {
    STATE.projects.status = "loading";
    STATE.projects.error = null;
    renderProjects();

    try {
      const response = await fetch(GITHUB_API, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) {
        const error = new Error(response.status === 403 ? COPY.rateLimit : COPY.loadError);
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      STATE.projects.items = data
        .filter(({ fork, archived }) => !fork && !archived)
        .sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at));
      STATE.projects.status = "success";
      STATE.projects.filter = "all";
    } catch (error) {
      STATE.projects.status = "error";
      STATE.projects.items = [];
      STATE.projects.error = error.message || COPY.loadError;
    }
    renderProjects();
  };

  const bindProjectEvents = () => {
    byId("githubProjects")?.addEventListener("click", (event) => {
      const retry = event.target.closest('[data-action="retry"]');
      if (retry) {
        loadGithubProjects();
        return;
      }
      const filterButton = event.target.closest("[data-filter]");
      if (!filterButton) return;
      STATE.projects.filter = filterButton.dataset.filter;
      renderProjects();
    });
  };

  const validateField = (name, value) => {
    const cleanValue = value.trim();
    if (!cleanValue) return COPY.required;
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
      return COPY.invalidEmail;
    }
    return "";
  };

  const renderForm = () => {
    Object.keys(STATE.form.values).forEach((name) => {
      const input = byId(name);
      const errorElement = byId(`${name}Error`);
      if (!input || !errorElement) return;
      const error = STATE.form.errors[name] || "";
      errorElement.textContent = error;
      input.setAttribute("aria-invalid", String(Boolean(error)));
      input.classList.toggle("invalid", Boolean(error));
    });
    const formStatus = byId("formStatus");
    if (formStatus) {
      formStatus.textContent = STATE.form.submitted ? COPY.success : "";
      formStatus.classList.toggle("success", STATE.form.submitted);
    }
  };

  const bindFormEvents = () => {
    const form = byId("contactForm");
    if (!form) return;

    Object.keys(STATE.form.values).forEach((name) => {
      const input = byId(name);
      input?.addEventListener("input", (event) => {
        STATE.form.values[name] = event.target.value;
        STATE.form.submitted = false;
        if (Object.hasOwn(STATE.form.errors, name)) {
          const error = validateField(name, event.target.value);
          if (error) STATE.form.errors[name] = error;
          else delete STATE.form.errors[name];
        }
        renderForm();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const errors = {};
      Object.entries(STATE.form.values).forEach(([name, value]) => {
        const error = validateField(name, value);
        if (error) errors[name] = error;
      });
      STATE.form.errors = errors;
      STATE.form.submitted = Object.keys(errors).length === 0;
      renderForm();
      if (!STATE.form.submitted) {
        byId(Object.keys(errors)[0])?.focus();
      }
    });
  };

  const renderScrollState = () => {
    byId("nav")?.classList.toggle("scrolled", STATE.scroll.navActive);
    const topButton = byId("backToTop");
    if (!topButton) return;
    topButton.hidden = !STATE.scroll.showTopButton;
    topButton.classList.toggle("visible", STATE.scroll.showTopButton);
    topButton.setAttribute("aria-hidden", String(!STATE.scroll.showTopButton));
  };

  const bindScrollEvents = () => {
    let ticking = false;
    const update = () => {
      const nextNavActive = scrollY >= 60;
      const nextShowTop = scrollY >= 300;
      if (
        nextNavActive !== STATE.scroll.navActive
        || nextShowTop !== STATE.scroll.showTopButton
      ) {
        STATE.scroll.navActive = nextNavActive;
        STATE.scroll.showTopButton = nextShowTop;
        renderScrollState();
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    byId("backToTop")?.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: "smooth" });
      byId("nav")?.focus({ preventScroll: true });
    });
    update();
  };

  const build = () => {
    PF.buildNav(byId("nav"), CONTENT, { page: "home" });
    buildHero();
    byId("main").innerHTML = [
      buildAbout(),
      buildEducation(),
      buildExperience(),
      buildProjects(),
      buildSkills(),
      buildAwards(),
      buildContact()
    ].join("");
    buildFooter();
    bindProjectEvents();
    bindFormEvents();
    bindScrollEvents();
    renderForm();
    renderScrollState();
    PF.initAdsense(CONTENT);
    PF.reveal();
    loadGithubProjects();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
