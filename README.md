# Portfolio — Kyumin Lee · 이규민

---

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

## 🛠 Manage content
모든 내용은 `data/content.js`(이력서)와 `data/posts.js`(블로그)에서 관리합니다.
코드 없이 편집하려면 `/admin` 편집기를 사용하세요.
👉 편집·블로그·애드센스·배포 등 자세한 방법: **[MANAGE.md](MANAGE.md)**

