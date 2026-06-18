/* =============================================================================
 * posts.js — 블로그 글 데이터 (글 1개 = 객체 1개)
 * -----------------------------------------------------------------------------
 * 최신 글이 위로 오게 date 내림차순으로 두면 보기 좋습니다.
 * body 는 간단한 마크다운을 지원합니다:
 *   # 제목  ## 소제목   **굵게**  *기울임*  `코드`  [링크](주소)
 *   - 목록   1. 번호목록   > 인용   ```코드블록```   --- 구분선
 * draft: true 로 두면 목록에 안 보입니다(작성 중인 글).
 * ========================================================================== */

window.POSTS = [
  {
    slug: "hello-portfolio",
    date: "2026-06-18",
    tags: { ko: ["공지", "회고"], en: ["Notice", "Retro"] },
    title: {
      ko: "포트폴리오를 열며 — 자소서를 '데이터'로 관리하기",
      en: "Opening this portfolio — managing my story as data"
    },
    summary: {
      ko: "흩어져 있던 자기소개서와 이력서를 한곳에 모으고, 한국어·영어 두 언어로 관리하는 사이트를 만들었습니다.",
      en: "I gathered my scattered cover letters and CV into one place and built a site that manages everything as bilingual data."
    },
    body: {
      ko: [
        "## 왜 만들었나",
        "",
        "여러 회사에 지원하면서 자기소개서가 폴더 여기저기 흩어졌습니다. 같은 경험을 회사마다 다르게 쓰다 보니, 정작 **\"나는 어떤 사람인가\"** 라는 핵심이 흐려지더군요.",
        "",
        "그래서 결정했습니다. 경험을 한 곳에 **데이터로** 모으고, 거기서 필요한 만큼 꺼내 쓰자.",
        "",
        "## 어떻게 만들었나",
        "",
        "- 모든 내용은 `content.js` 한 파일에서 한국어·영어로 함께 관리합니다.",
        "- `/ko`, `/en` 페이지는 같은 화면틀에 데이터만 끼워 렌더링합니다.",
        "- 빌드 과정이 없어서, 고치고 `git push` 하면 바로 반영됩니다.",
        "",
        "> 핵심 원칙: 내용·디자인·화면틀을 분리한다. 그래야 글 한 번 고치면 양쪽 언어에 자동으로 반영됩니다.",
        "",
        "앞으로 이 블로그에는 프로젝트를 만들며 배운 것들을 기록하려 합니다. 첫 글은 여기까지."
      ].join("\n"),
      en: [
        "## Why I built this",
        "",
        "Applying to many companies, my cover letters ended up scattered across folders. Writing the same experience differently each time blurred the one thing that matters: **who I actually am.**",
        "",
        "So I decided to gather my experience in one place **as data**, and pull from it as needed.",
        "",
        "## How it works",
        "",
        "- All content lives in a single `content.js` file, in Korean and English together.",
        "- The `/ko` and `/en` pages render the same layout with the right language data.",
        "- There's no build step — edit, `git push`, and it's live.",
        "",
        "> Core principle: separate content, design, and layout. Then editing once updates both languages.",
        "",
        "I'll use this blog to record what I learn while building. That's it for the first post."
      ].join("\n")
    }
  },
  {
    slug: "anti-phishing-latency",
    date: "2026-06-10",
    tags: { ko: ["프로젝트", "LLM", "성능"], en: ["Project", "LLM", "Performance"] },
    title: {
      ko: "응답을 4초에서 1초로 — 피싱방지 키보드의 LLM 게이팅",
      en: "From 4s to 1s — LLM gating in an anti-phishing keyboard"
    },
    summary: {
      ko: "타이핑하는 순간 위험을 경고하려면 속도가 생명입니다. 매 글자마다 LLM을 부르지 않고도 실시간성을 확보한 방법을 정리합니다.",
      en: "To warn while you type, speed is everything. Here's how I kept it real-time without calling the LLM on every keystroke."
    },
    body: {
      ko: [
        "## 문제: 실시간이 아니면 의미가 없다",
        "",
        "보이스피싱·메신저피싱은 **대화 도중** 일어납니다. 대화가 끝난 뒤 탐지하면 이미 늦습니다. 그래서 타이핑하는 순간 위험을 알려야 했는데, 초기 구조는 응답에 약 4초가 걸렸습니다.",
        "",
        "## 원인: LLM을 너무 자주 불렀다",
        "",
        "처음에는 입력이 바뀔 때마다 로컬 LLM(Gemma 3)에 문장을 보냈습니다. 사용자가 한 글자 칠 때마다 추론이 도니 느릴 수밖에요.",
        "",
        "## 해결: 형태소 기반 게이팅",
        "",
        "`KIWI` 형태소 분석기로 **문장이 끝났는지**를 먼저 가볍게 판단하고, 종결어미나 기호 같은 신호가 나올 때만 LLM을 호출했습니다.",
        "",
        "```",
        "입력 변화 → KIWI로 종결 신호 확인",
        "          → 신호 없음: 대기 (LLM 호출 안 함)",
        "          → 신호 있음: LLM에 위험도 분석 요청",
        "```",
        "",
        "여기에 금융사기 데이터셋으로 프롬프트를 튜닝해 한 번의 호출을 더 정확하게 만들었습니다.",
        "",
        "## 결과",
        "",
        "- 응답: 약 **4초 → 1초 미만** (약 4배)",
        "- 불필요한 추론 호출을 크게 줄여 배터리·발열에도 유리",
        "- 제12회 전국 ICT 융합 공모전 **우수상**",
        "",
        "지금은 서버 파이프라인을 **온디바이스 AI**로 옮기는 작업을 하고 있습니다. 개인정보를 아예 기기 밖으로 내보내지 않기 위해서요."
      ].join("\n"),
      en: [
        "## The problem: if it isn't real-time, it's useless",
        "",
        "Voice and messenger phishing happen **mid-conversation**. Detecting it afterward is too late. I needed to warn the moment someone types — but the first version took about 4 seconds to respond.",
        "",
        "## The cause: calling the LLM too often",
        "",
        "Initially I sent the sentence to a local LLM (Gemma 3) on every input change. Running inference on each keystroke is inevitably slow.",
        "",
        "## The fix: morphology-based gating",
        "",
        "I used the `KIWI` morphological analyzer to cheaply check **whether a sentence had ended**, and only called the LLM when an ending or symbol cue appeared.",
        "",
        "```",
        "input change -> check end-of-sentence cue with KIWI",
        "             -> no cue: wait (no LLM call)",
        "             -> cue:    ask LLM to score risk",
        "```",
        "",
        "I also tuned the prompt on a financial-fraud dataset so each single call was more accurate.",
        "",
        "## The result",
        "",
        "- Latency: about **4s -> under 1s** (~4x)",
        "- Far fewer wasteful inference calls — better for battery and heat",
        "- Excellence Award at the 12th National ICT Convergence Contest",
        "",
        "I'm now moving the server pipeline to **on-device AI**, so personal data never leaves the phone at all."
      ].join("\n")
    }
  }
];
