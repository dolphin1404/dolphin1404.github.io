/* =============================================================================
 * content.js — 포트폴리오의 모든 콘텐츠 (단일 데이터 소스)
 * -----------------------------------------------------------------------------
 * 여기 한 곳만 고치면 /ko, /en 양쪽 페이지에 자동 반영됩니다.
 * 모든 텍스트는 { ko: "...", en: "..." } 형태로 한국어/영어를 함께 둡니다.
 * (관리자 편집기 /admin 에서 폼으로 편집하고 다시 내보낼 수 있습니다.)
 * ========================================================================== */

window.CONTENT = {
  meta: {
    name: { ko: "이규민", en: "Kyumin Lee" },
    handle: "kyumin",
    role: { ko: "AI · 백엔드 개발자", en: "AI · Backend Developer" },
    tagline: {
      ko: "문제를 발견하면 직접 만들고, 배포해서 확인해 보는 개발자",
      en: "I like solving problems by building, shipping, and learning from the result."
    },
    summary: {
      ko: "LLM 에이전트와 온디바이스 AI를 공부하고, FastAPI와 WebSocket을 활용한 백엔드 개발을 주로 합니다. 만든 기능은 직접 배포하고 사용해 보면서 개선하는 과정을 좋아합니다.",
      en: "I study LLM agents and on-device AI, and mainly build backends with FastAPI and WebSocket. I enjoy deploying what I make, trying it myself, and improving it from there."
    },
    location: { ko: "대한민국 경기도", en: "Gyeonggi-do, South Korea" },
    email: "kyumin1404@gmail.com",
    github: "https://github.com/dolphin1404",
    scholar: "",
    resumeFile: "../assets/Kyumin_Lee_CV.pdf",
    adsense: { enabled: false, client: "", slot: "" },
    // 조회수(Abacus 무료 카운터). enabled:true + namespace 지정 시 작동.
    views: { enabled: false, namespace: "" }
  },

  nav: {
    about:      { ko: "소개",       en: "About" },
    education:  { ko: "학력",       en: "Education" },
    experience: { ko: "경력",       en: "Experience" },
    projects:   { ko: "프로젝트",   en: "Projects" },
    skills:     { ko: "기술",       en: "Skills" },
    awards:     { ko: "수상",       en: "Awards" },
    blog:       { ko: "블로그",     en: "Blog" }
  },

  education: [
    {
      school: { ko: "충북대학교", en: "Chungbuk National University" },
      degree: { ko: "소프트웨어학부 · 공학사 (재학)", en: "B.S. in Software, School of Computer Science" },
      period: { ko: "2021.03 – 2027.02 (졸업 예정)", en: "Mar 2021 – Feb 2027 (expected)" },
      detail: {
        ko: "정보통신공학부로 입학한 뒤 소프트웨어학부로 전과했습니다.",
        en: "Admitted to Information & Communication Engineering, then transferred to the School of Computer Science."
      }
    },
    {
      school: { ko: "학부 연구 (과제 참여자)", en: "Undergraduate Research(in progress)" },
      degree: { ko: "신뢰할 수 있는 LLM 기반 에이전트 연구", en: "Toward Reliable LLM-Based Agents" },
      period: { ko: "이건명 교수 지도 · AI Lab", en: "Advised by Prof. Keon-Myung Lee · AI Lab" },
      detail: {
        ko: "사용자 입력이나 실행 환경의 제약을 에이전트가 놓치지 않도록 하는 방법을 연구하고 있습니다. 오픈소스 에이전트의 동작을 분석하면서 발견한 문제에서 시작한 주제입니다.",
        en: "I study ways to help agents account for user input and constraints in their execution environment. The topic grew out of issues I found while examining how an open-source agent works."
      }
    }
  ],

  experience: [
    {
      org: { ko: "충북대 AI Lab", en: "AI Lab, Chungbuk Nat'l University" },
      title: { ko: "학부연구생", en: "Undergraduate Researcher" },
      period: { ko: "2025.09 – 2026.08", en: "Sep 2025 – Aug 2026" },
      bullets: {
        ko: [
          "시계열 예측 모델 TimeXer를 공부하고 금융 시계열 데이터에 적용했습니다.",
          "오픈소스 AI 에이전트의 동작 구조를 분석하고 멀티에이전트 형태로 확장하고 있습니다."
        ],
        en: [
          "Studied the TimeXer forecasting model and applied it to financial time-series data.",
          "Reviewed how an open-source AI agent works and began extending it into a multi-agent system."
        ]
      }
    },
    {
      org: { ko: "한국전자통신연구원 (ETRI)", en: "ETRI" },
      title: { ko: "연구연수생 · 디지털융합연구소", en: "Research Trainee · Digital Convergence Lab" },
      period: { ko: "2025.07 – 2025.08", en: "Jul 2025 – Aug 2025" },
      bullets: {
        ko: [
          "'Beyond X-verse' 과제에서 모션캡처 3사(Xsens 수트·OptiTrack 광학·Manus 장갑) SDK를 통합한 단일 뷰어 모듈을 Python으로 개발.",
          "서로 다른 장비의 좌표계와 시간축을 맞추고 실시간 영상과 동기화해 동작을 기록할 수 있도록 했습니다.",
          "건당 30분 이상 걸리던 수작업 변환을 자동화해 반복 작업 시간을 줄였습니다."
        ],
        en: [
          "Built a unified viewer module in Python integrating motion-capture SDKs from three vendors — Xsens (suit), OptiTrack (optical), Manus (gloves).",
          "Aligned coordinate systems and timelines across devices and synchronized the data with real-time video.",
          "Automated a manual conversion that took more than 30 minutes per case."
        ]
      }
    },
    {
      org: { ko: "정보통신정책연구원 (KISDI)", en: "KISDI" },
      title: { ko: "동계 현장실습 · 기획예산팀", en: "Field Trainee · Budget Planning Team" },
      period: { ko: "2024.12 – 2025.01", en: "Dec 2024 – Jan 2025" },
      bullets: {
        ko: ["예산 보고서 생성을 자동화하는 Python 프로그램을 직접 제안·구현하고 제출 연동까지 구성해 반복 행정업무를 줄임."],
        en: ["Proposed and built a Python program automating budget-report generation with submission integration, cutting repetitive administrative work."]
      }
    }
  ],

  projects: [
    {
      name: { ko: "AI 피싱방지 키보드", en: "Anti-Phishing AI Keyboard" },
      year: "2025",
      role: { ko: "백엔드 · AI 개발 / DB 설계 리드", en: "Backend · AI / DB design lead" },
      badge: { ko: "전국 ICT 융합 공모전 우수상", en: "Excellence Award · National ICT Contest" },
      featured: true,
      summary: {
        ko: "입력 중인 문장에서 금융사기 위험을 감지해 사용자와 가족에게 알려 주는 키보드입니다. 개인정보가 외부 모델로 전송되지 않도록 로컬 LLM을 사용했습니다.",
        en: "A keyboard that detects signs of financial fraud in typed messages and alerts the user and their family. It uses a local LLM so personal text is not sent to an external model."
      },
      bullets: {
        ko: [
          "커스텀 키보드의 입력을 WebSocket과 FastAPI로 전달해 위험도를 분석하고 사용자와 가족에게 알림을 보냈습니다.",
          "Gemma 3와 KIWI 형태소 분석기를 함께 사용해 문장이 끝나는 시점에만 모델을 호출하도록 구성했습니다.",
          "호출 횟수와 프롬프트를 조정해 응답 시간을 약 4초에서 1초 미만으로 줄였습니다.",
          "현재는 서버에서 처리하던 기능을 기기 안에서 실행하는 방식으로 바꾸고 있습니다."
        ],
        en: [
          "Custom keyboard → WebSocket → FastAPI for real-time analysis; stages fraud risk and alerts the user and family.",
          "On-premise local LLM (Gemma 3) plus a KIWI morphological-analyzer gate that invokes the LLM only on sentence-ending or symbol cues.",
          "Cut latency from ~4s to under 1s (≈4×) via lightweight invocation logic and prompt tuning on a fraud dataset.",
          "Now re-architecting from a server pipeline to on-device AI, preparing for commercialization."
        ]
      },
      tags: ["FastAPI", "WebSocket", "Local LLM", "Gemma 3", "KIWI", "On-device AI"],
      link: ""
    },
    {
      name: { ko: "CLIP-IT · 영상 독서 플랫폼", en: "CLIP-IT · Video Reading Platform" },
      year: "2026",
      role: { ko: "팀장 · 웹 개발", en: "Team Lead · Web Development" },
      badge: { ko: "졸업작품 · 배포 운영 중", en: "Capstone · Deployed" },
      featured: true,
      summary: {
        ko: "고전문학 원문과 장면별 영상을 함께 볼 수 있는 졸업작품입니다. 팀장을 맡아 웹 화면, API, 데이터베이스와 배포를 담당했습니다.",
        en: "A capstone project for reading classic literature alongside scene-based video. As team lead, I handled the web UI, API, database, and deployment."
      },
      bullets: {
        ko: [
          "Next.js App Router로 화면과 API를 구성하고 Vercel에 배포했습니다.",
          "처음에는 Supabase로 시작했지만, 이후 인증과 데이터 저장소를 AWS Cognito·RDS PostgreSQL·S3로 옮겼습니다.",
          "책, 북마크, 노트, 형광펜 API와 데이터베이스를 설계하고 영상이 끊기지 않도록 더블 버퍼링 플레이어를 구현했습니다.",
          "개발뿐 아니라 기획서, 백로그와 발표 자료도 정리하며 팀 진행을 맡았습니다."
        ],
        en: [
          "Built the UI and API with Next.js App Router and deployed the project on Vercel.",
          "Started with Supabase, then moved authentication and storage to AWS Cognito, RDS PostgreSQL, and S3.",
          "Designed the database and APIs for books, bookmarks, notes, and highlights, and built a double-buffered video player.",
          "Managed the team schedule and also prepared the proposal, backlog, and presentation."
        ]
      },
      tags: ["Next.js", "Vercel", "AWS", "PostgreSQL", "S3", "GitHub"],
      link: "https://cbnu-clip-it.vercel.app/"
    },
    {
      name: { ko: "LLM 에이전트 연구 · 멀티에이전트 확장", en: "LLM Agent Research · Multi-agent Extension" },
      year: "2025 –",
      role: { ko: "학부연구", en: "Undergraduate research" },
      badge: { ko: "", en: "" },
      featured: false,
      summary: {
        ko: "오픈소스 AI 에이전트의 코드를 읽고 동작 과정을 정리한 뒤, 역할이 다른 여러 에이전트가 협업하는 구조로 확장하고 있습니다.",
        en: "I read and document how an open-source AI agent works, then extend it so agents with different roles can collaborate."
      },
      bullets: {
        ko: [
          "TypeScript 코드베이스에서 작업 스케줄링과 에이전트 루프가 사용자, 서버, LLM을 연결하는 과정을 따라가며 정리했습니다.",
          "금융사기 패턴을 찾고 방어 로직의 초안을 만드는 연구 도구로 에이전트를 사용했습니다.",
          "오타나 모바일 타이핑 지연 같은 실제 입력 조건을 에이전트가 놓치는 문제를 확인해 사람의 검토 단계를 추가했습니다.",
          "기획, 개발, 코드 리뷰 역할을 나눈 멀티에이전트 구조를 실험하고 있습니다."
        ],
        en: [
          "Read the TypeScript codebase and documented how task scheduling and the agent loop connect the user, server, and LLM.",
          "Used the agent as a research tool to find fraud patterns and prepare first drafts of defense logic.",
          "Found that the agent missed practical input conditions such as typos and mobile typing delay, so I added a human review step.",
          "Currently experimenting with a multi-agent setup that separates planning, development, and code-review roles."
        ]
      },
      tags: ["LLM Agents", "Multi-agent", "HITL", "TypeScript", "Agent harness"],
      link: ""
    },
    {
      name: { ko: "나무보카 · AI 단어장 앱", en: "Namuvoca · AI Vocabulary App" },
      year: "2025",
      role: { ko: "기획 · 개발", en: "Planner · Developer" },
      badge: { ko: "App Store 출시·운영", en: "Published on the App Store" },
      featured: false,
      summary: {
        ko: "LLM이 단어·퀴즈·팟캐스트형 오디오를 생성하는 학습 앱. 실제 사용자 피드백을 받으며 운영, 아이디어부터 배포까지 전 과정을 경험.",
        en: "A vocabulary app where an LLM generates words, quizzes, and podcast-style audio. I built and released it, then updated it from user feedback."
      },
      bullets: {
        ko: ["Flutter + Supabase(Auth·DB)로 구축해 앱스토어에 출시·운영하며 DB 설계를 실전 적용."],
        en: ["Built the app with Flutter and Supabase, including authentication and database design, and released it on the App Store."]
      },
      tags: ["Flutter", "Supabase", "LLM"],
      link: ""
    },
    {
      name: { ko: "뤼튼 어시스턴트 · 생성형 AI 아이디어톤", en: "Wrtn Assistant · Generative-AI Ideathon" },
      year: "2024",
      role: { ko: "팀 PDAPRO", en: "Team PDAPRO" },
      badge: { ko: "최우수상 (21개 대학 중 2위)", en: "Top Award (2nd of 21 universities)" },
      featured: false,
      summary: {
        ko: "제2회 생성형 AI 아이디어톤(뤼튼×Microsoft)에서 AI 메모리 기능을 더한 뤼튼 포털을 제안해 결선 진출, 제안 기능은 실서비스에 반영.",
        en: "Proposed a Wrtn portal augmented with an AI-memory feature at the 2nd Generative-AI Ideathon (Wrtn × Microsoft); reached the finals and the idea was reflected in the real service."
      },
      bullets: { ko: [], en: [] },
      tags: ["Generative AI", "Product", "Microsoft"],
      link: ""
    }
  ],

  skills: [
    { group: { ko: "언어", en: "Languages" },
      items: ["Python (주력)", "TypeScript", "C / C++", "C#", "SQL", "Solidity (기초)"] },
    { group: { ko: "AI / ML · LLM", en: "AI / ML · LLM" },
      items: ["로컬·온디바이스 LLM (Gemma 3)", "OpenAI / Anthropic API", "프롬프트 엔지니어링", "RAG", "멀티에이전트 (LangGraph)", "에이전트 하니스 분석", "시계열 예측 (TimeXer)", "PyTorch", "앙상블"] },
    { group: { ko: "백엔드 · 데이터", en: "Backend · Data" },
      items: ["FastAPI", "WebSocket", "REST API", "관계형 DB 설계", "PostgreSQL", "Supabase", "AWS (Cognito·RDS·S3)"] },
    { group: { ko: "프론트 · 인프라 · 도구", en: "Frontend · Infra · Tools" },
      items: ["Next.js", "Flutter", "Vercel", "Git / GitHub", "AI 코딩 에이전트 (Claude Code)", "KIWI 형태소 분석기"] },
    { group: { ko: "자격 · 어학", en: "Certifications · Languages" },
      items: ["SQL 개발자 (SQLD)", "한국어 (모국어)", "일본어 (JLPT N3)", "영어 (OPIc IM1)"] }
  ],

  awards: [
    { title: { ko: "제12회 전국 ICT융합 공모전 우수상", en: "Excellence Award · 12th National ICT Convergence Contest" },
      org: { ko: "충북인공지능산업협회", en: "Chungbuk AI Industry Association" },
      date: { ko: "2025.11", en: "Nov 2025" },
      note: { ko: "AI 피싱방지 키보드 · 백엔드/DB 리드", en: "Anti-phishing AI keyboard · backend/DB lead" } },
    { title: { ko: "DB드림리더 'Dream Labs' 공모전 대상", en: "Grand Prize · DB Dream Leader 'Dream Labs'" },
      org: { ko: "DB김준기문화재단", en: "DB Kim Jun-Ki Cultural Foundation" },
      date: { ko: "2025.09", en: "Sep 2025" },
      note: { ko: "전국 10개 팀 중 1위", en: "1st of 10 national teams" } },
    { title: { ko: "생성형 AI 아이디어톤 최우수상", en: "Top Award · Generative-AI Ideathon" },
      org: { ko: "뤼튼테크놀로지스 × Microsoft", en: "Wrtn Technologies × Microsoft" },
      date: { ko: "2024.07", en: "Jul 2024" },
      note: { ko: "21개 대학 중 2위", en: "2nd of 21 universities" } },
    { title: { ko: "SW중심대학 마일리지 장학금 대상", en: "Grand Prize · SW-Centered University Scholarship" },
      org: { ko: "충북대 SW중심대학사업단", en: "Chungbuk National University" },
      date: { ko: "2024.07", en: "Jul 2024" },
      note: { ko: "참여부문", en: "Participation category" } },
    { title: { ko: "DB드림리더 2기 장학생", en: "DB Dream Leader 2nd-Cohort Scholar" },
      org: { ko: "DB김준기문화재단", en: "DB Kim Jun-Ki Cultural Foundation" },
      date: { ko: "2025.02 – 2027.02", en: "Feb 2025 – Feb 2027" },
      note: { ko: "", en: "" } }
  ]
};
