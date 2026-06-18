# Portfolio — Kyumin Lee · 이규민

빌드 없이 GitHub Pages에 바로 올라가는 **한국어 / 영어 2개 언어** 개발자 포트폴리오.
A build-free, bilingual (KO / EN) developer portfolio for GitHub Pages.

**🔗 Live:** `https://<your-username>.github.io/`

---

## ✨ Features
- **이중 언어 / Bilingual** — `/ko`, `/en` 라우트. 콘텐츠는 데이터 파일 한 곳에서 관리해 양쪽에 자동 반영.
- **다크 · 라이트 테마 / Theme toggle** — 버튼 전환 + OS 설정 자동 감지, 선택 기억.
- **블로그 / Blog** — 마크다운 작성, 글별 OG 공유 미리보기.
- **관리자 편집기 / Admin editor** (`/admin`) — 브라우저 폼으로 편집, 파일 내보내기 또는 GitHub로 바로 커밋.
- **무빌드 정적 / No build** — HTML · CSS · Vanilla JS. 프레임워크·의존성·빌드 단계 없음.

## 🗂 Structure
```
index.html     # 방문자 언어에 따라 /ko · /en 분기
ko/ · en/      # 메인 + 블로그 (얇은 껍데기)
admin/         # 관리자 편집기 (noindex)
data/          # content.js(이력서) · posts.js(블로그)  ← 콘텐츠는 여기서 관리
assets/        # style.css · 렌더 스크립트 · 이력서 PDF
```

## 🚀 Run locally
```bash
python -m http.server 8000   # → http://localhost:8000
```

## ☁ Deploy (GitHub Pages)
`<your-username>.github.io` 저장소에 **이 폴더의 내용**을 올린 뒤,
**Settings → Pages** 에서 `main` 브랜치를 소스로 지정하면 끝.

## 🛠 Manage content
모든 내용은 `data/content.js`(이력서)와 `data/posts.js`(블로그)에서 관리합니다.
코드 없이 편집하려면 `/admin` 편집기를 사용하세요.
👉 편집·블로그·애드센스·배포 등 자세한 방법: **[MANAGE.md](MANAGE.md)**

## 🧰 Built with
Vanilla JavaScript · CSS custom properties · GitHub Pages — no framework, no build, no dependencies.
