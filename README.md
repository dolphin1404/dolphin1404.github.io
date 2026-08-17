# Kyu.log

이규민의 개발 블로그 + 포트폴리오. Jekyll [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 테마 기반, GitHub Pages(GitHub Actions)로 배포됩니다.

- 블로그: <https://dolphin1404.github.io/>
- 포트폴리오: <https://dolphin1404.github.io/ko/> · <https://dolphin1404.github.io/en/>

## 글 쓰는 법

`_posts/` 폴더에 `YYYY-MM-DD-제목-슬러그.md` 파일을 만들고 push하면 끝.

```markdown
---
title: "글 제목"
date: 2026-08-17 21:00:00 +0900
categories: [헤르메스]
tags: [LLM, 보안]
description: "목록·검색에 보이는 한 줄 요약"
---

본문은 마크다운으로 작성합니다.
```

- 초안: 파일을 `_drafts/`에 두면 배포되지 않습니다 (파일명에 날짜 불필요)
- 이미지: `assets/img/` 등에 넣고 `![설명](/assets/img/파일.png)`
- 글 URL: `/posts/제목-슬러그/`

## 폴더 구조

```
_posts/       블로그 글 (마크다운)
_tabs/        사이드바 탭 (About, 포트폴리오, 개인정보처리방침 등)
_includes/metadata-hook.html   애드센스 등 <head> 커스텀 삽입
_config.yml   사이트 설정 (제목, 소셜, 애널리틱스, 댓글 등)
ko/ en/       기존 포트폴리오 (정적 파일 그대로 유지)
data/ images/ assets/          포트폴리오 데이터·이미지·스크립트
ads.txt       애드센스 게시자 ID (승인 후 활성화)
```

## 로컬 미리보기 (선택)

Ruby 3.1+ 설치 후:

```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000
```

로컬 환경이 없어도 push하면 GitHub Actions가 자동 빌드·배포합니다.
