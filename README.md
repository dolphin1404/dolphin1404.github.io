# Portfolio — Kyumin Lee · 이규민

외부 UI 프레임워크 없이 HTML, CSS, Vanilla JavaScript로 만든 반응형 개발자 포트폴리오입니다. 한국어·영어 페이지, 블로그, 관리자 편집기를 유지하면서 GitHub API, 폼 검증, 접근 가능한 인터랙션과 명시적인 상태 렌더링 흐름을 구현했습니다.

**배포 URL:** https://dolphin1404.github.io/

## 주요 기능

- 한국어·영어 포트폴리오와 블로그
- 모바일 햄버거 메뉴와 키보드 포커스 관리
- 다크·라이트 테마 및 `localStorage` 저장
- GitHub REST API 저장소 목록과 언어 필터
- API 로딩·성공·빈 결과·오류·재시도 UI
- Contact 폼 필수값·이메일 형식 검증
- 부드러운 섹션 이동, 스크롤 네비게이션, 맨 위로 버튼
- Intersection Observer 등장 애니메이션
- 모바일·태블릿·데스크톱 반응형 레이아웃

## 폴더 구조

```text
index.html       # 브라우저 언어에 따라 /ko 또는 /en으로 이동
ko/ · en/        # 메인 포트폴리오와 블로그
admin/           # 콘텐츠 관리자 편집기
data/            # 이력서와 블로그 데이터
assets/          # CSS, 공개 페이지 JavaScript, 관리자 파일, 이력서 PDF
images/          # 프로필 이미지와 제출용 화면 캡처
```

콘텐츠는 `data/content.js`, 화면 생성은 `assets/app.js`, 공통 상태와 네비게이션은 `assets/common.js`, 테마와 블로그 부가기능은 `assets/features.js`가 담당합니다.

## 실행

빌드 과정이나 패키지 설치가 필요하지 않습니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/ko/` 또는 `http://localhost:8000/en/`을 엽니다. 파일을 직접 열지 않고 로컬 서버를 사용하는 이유는 실제 배포 환경과 동일하게 API와 상대 경로를 확인하기 위해서입니다.

## 설계 설명

### 시맨틱 HTML

페이지의 큰 영역은 `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`로 구분하고, 프로젝트·경력·기술·수상처럼 독립적으로 읽을 수 있는 항목은 `<article>`로 표현합니다. Contact의 `label for`는 각 입력의 `id`와 연결하며 오류 문구는 `aria-describedby`로 연결합니다.

### Flexbox와 Grid

- 네비게이션은 로고·메뉴·테마·언어 선택을 한 방향으로 정렬하므로 Flexbox를 사용합니다.
- 대표 프로젝트와 GitHub 저장소는 행과 열이 화면 폭에 따라 동시에 변하므로 Grid의 `auto-fit`과 `minmax()`를 사용합니다.
- 작은 태그 목록처럼 한 방향으로 흐르면서 줄바꿈만 필요한 요소는 Flexbox를 사용합니다.

### 모바일 퍼스트 반응형

모바일 레이아웃을 기본값으로 작성하고 다음 `min-width` 브레이크포인트에서 확장합니다.

- `768px`: 햄버거 메뉴를 가로 네비게이션으로 바꾸고 About·Contact를 2열로 배치
- `1024px`: 최대 콘텐츠 폭과 여백을 늘리고 저장소 Grid의 최소 카드 폭을 확대

### CSS 변수와 테마

`:root`에는 배경(`--bg`), 표면(`--surface`), 본문(`--text`), 보조 텍스트(`--muted`), 강조색(`--accent`), 테두리(`--border`), 오류·성공·포커스 색을 정의합니다. `html[data-theme="light"]`가 같은 변수만 덮어쓰므로 컴포넌트 CSS를 중복하지 않고 테마를 바꿀 수 있습니다.

### 이벤트 → 상태 → 렌더

`assets/common.js`의 단일 `STATE` 객체가 공개 메인 화면의 상태를 보관합니다.

| 사용자/시스템 이벤트 | 상태 변경 | 화면 업데이트 |
|---|---|---|
| 테마 버튼 클릭 | `STATE.theme` | `renderTheme()`이 CSS 테마와 `aria-pressed` 변경 |
| 햄버거 클릭·Escape | `STATE.menuOpen` | `renderMenu()`가 메뉴와 `aria-expanded` 변경 |
| GitHub API 요청 | `STATE.projects.status/items/error` | `renderProjects()`가 로딩·카드·빈 결과·오류 표시 |
| 언어 필터 클릭 | `STATE.projects.filter` | `renderProjects()`가 `filter()` 결과와 버튼 상태 표시 |
| 폼 입력·제출 | `STATE.form.values/errors/submitted` | `renderForm()`이 오류·`aria-invalid`·성공 메시지 표시 |
| 스크롤 | `STATE.scroll` | `renderScrollState()`가 네비게이션과 맨 위 버튼 변경 |

DOM 요소는 `querySelector`, `querySelectorAll`, `getElementById`로 선택하고 이벤트는 HTML의 `onclick` 대신 `addEventListener`로 연결합니다.

## JavaScript 문법과 배열 메서드

- 화살표 함수는 짧은 렌더·이벤트 콜백에서 함수 의도를 간결하게 드러냅니다.
- 구조분해 할당은 GitHub 응답과 콘텐츠 객체에서 필요한 필드만 이름으로 꺼냅니다.
- `filter()`는 fork·보관 저장소 제외와 언어 필터에 사용합니다.
- `map()`은 콘텐츠 및 API 배열을 카드 HTML로 변환합니다.
- `forEach()`는 입력 필드 이벤트와 Intersection Observer 대상 등록에 사용합니다.
- 템플릿 리터럴은 동적인 시맨틱 HTML을 생성합니다.

## GitHub API 비동기 처리

`loadGithubProjects()`는 다음 흐름으로 동작합니다.

1. `STATE.projects.status = "loading"`으로 바꾸고 로딩 UI를 렌더합니다.
2. `fetch`를 `await`하여 `https://api.github.com/users/dolphin1404/repos`를 호출합니다.
3. 정상 응답은 배열을 정리한 뒤 `success` 상태와 카드로 렌더합니다.
4. 정상 응답이지만 결과가 없으면 빈 상태를 렌더합니다.
5. 네트워크 오류나 비정상 응답은 `catch`에서 `error` 상태로 바꾸고 재시도 버튼을 렌더합니다.
6. 인증 없는 API의 시간당 요청 한도를 초과한 403 응답은 별도 안내 문구를 표시합니다.

## 접근성

- 테마 버튼: `aria-pressed`와 상태별 `aria-label`
- 햄버거 버튼: `aria-controls`, `aria-expanded`, Escape 닫기, 포커스 반환
- 모바일 메뉴: 열릴 때 첫 링크로 이동하며 Tab 포커스가 메뉴 안에서 순환
- API와 폼 상태: `aria-live`로 변경 알림
- 폼: label 연결, 필드별 오류, `aria-invalid`
- 모든 조작 요소: `:focus-visible` 표시
- `prefers-reduced-motion`: 애니메이션과 부드러운 스크롤 최소화

## 스크롤 기준값

- `60px`: 네비게이션 배경과 그림자 변경
- `300px`: 맨 위로 버튼 표시
- Intersection Observer `threshold: 0.2`: 섹션 등장 애니메이션

## 화면 캡처

### 데스크톱

![데스크톱 포트폴리오](images/screenshots/desktop.png)

### 모바일

![모바일 포트폴리오](images/screenshots/mobile.png)

### 다크 모드

![다크 모드 포트폴리오](images/screenshots/dark-mode.png)

## 배포

이 저장소는 GitHub Pages 사용자 사이트입니다. 검증된 변경을 `main`에 병합하면 `https://dolphin1404.github.io/`에 반영됩니다. API 키나 빌드 환경 변수는 필요하지 않습니다.
