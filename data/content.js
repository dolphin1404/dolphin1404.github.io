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
      ko: "아이디어를 '실제로 도는 서비스'까지 만드는 개발자",
      en: "I turn ideas into services that actually ship."
    },
    summary: {
      ko: "충북대 소프트웨어학부 4학년, AI Lab 학부연구생입니다. LLM 에이전트와 온디바이스 AI를 연구하고, 실시간 백엔드(FastAPI·WebSocket)와 DB 설계로 아이디어를 실제 서비스까지 만든다. 피싱방지 키보드로 전국 ICT 융합 공모전 우수상, 졸업작품 CLIP-IT 실배포.",
      en: "4th-year B.S. in Software at Chungbuk National University and an undergraduate researcher at the AI Lab. I work on LLM agents and on-device AI, and connect research to real products with real-time backends (FastAPI/WebSocket) and database design. My anti-phishing keyboard won an Excellence Award at the National ICT Convergence Contest, and my capstone CLIP-IT is live in production."
    },
    location: { ko: "대한민국 경기도", en: "Gyeonggi-do, South Korea" },
    email: "kyumin1404@gmail.com",
    github: "http://github.com/dolphin1404",
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
        ko: "학점 3.95 / 4.5 (백분율 93.5). 정보통신공학부로 입학한 뒤 소프트웨어학부로 전과했습니다.",
        en: "GPA 3.95 / 4.50. Admitted to Information & Communication Engineering, then transferred to the School of Software."
      }
    },
    {
      school: { ko: "학부 연구 (진행 중)", en: "Undergraduate Research(in progress)" },
      degree: { ko: "신뢰할 수 있는 LLM 기반 에이전트 연구", en: "Toward Reliable LLM-Based Agents" },
      period: { ko: "이건명 교수 지도 · AI Lab", en: "Advised by Prof. Keon-Myung Lee · AI Lab" },
      detail: {
        ko: "사용자 입력과 환경 제약을 구조적 사전정보로 반영해 LLM 에이전트의 신뢰성을 높이는 주제. 에이전트 하니스 내부 분석과 시계열 모델링 경험에서 발전시켰습니다.",
        en: "Incorporating user-input and environmental constraints as structural priors to make LLM agents more reliable — developed from hands-on analysis of agent-harness internals and time-series modeling."
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
          "시계열 방향: SOTA 예측 모델 TimeXer를 분석하고 금융 시계열 데이터에 직접 적용.",
          "LLM 에이전트 방향: 오픈소스 AI 에이전트 내부 구조를 분석하고 멀티에이전트 시스템으로 확장 (아래 프로젝트 참고)."
        ],
        en: [
          "Time-series: studied the SOTA forecasting model TimeXer and ran it on financial time-series data.",
          "LLM agents: analyzed the internals of an open-source AI agent and extended it into a multi-agent system (see Projects)."
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
          "서로 다른 벤더의 센서 좌표·시간축을 통일하고 실시간 영상과 동기화, 이후 동작을 기록·예측.",
          "건당 30분 이상 걸리던 수작업 변환을 자동화해 연구실 워크플로의 핵심 병목을 제거."
        ],
        en: [
          "Built a unified viewer module in Python integrating motion-capture SDKs from three vendors — Xsens (suit), OptiTrack (optical), Manus (gloves).",
          "Unified coordinate systems and timelines across vendors, synchronized with real-time video, and recorded/predicted subsequent motion.",
          "Automated a manual conversion that took 30+ minutes per case, removing a key bottleneck in the lab's workflow."
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
        ko: "타이핑하는 순간 1초 안에 금융사기 위험을 경고하는 키보드. 개인정보를 외부로 보내지 않는 온프레미스 로컬 LLM 구조.",
        en: "A keyboard that warns of financial-fraud risk within 1 second as you type — on-premise local LLM, no personal data sent out."
      },
      bullets: {
        ko: [
          "커스텀 키보드 → WebSocket → FastAPI로 입력을 실시간 분석하고 단계별 위험도를 산출, 사용자·가족에게 경고.",
          "로컬 LLM(Gemma 3) 온프레미스 추론 + KIWI 형태소 분석기 게이팅으로 문장 종결·기호 신호에서만 LLM 호출.",
          "경량 호출 로직과 금융사기 데이터셋 프롬프트 튜닝으로 응답을 약 4초 → 1초 미만(≈4배)으로 단축.",
          "현재 서버 파이프라인을 온디바이스 AI로 재설계하며 사업화 준비 중."
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
      role: { ko: "팀장 · 웹 풀스택 전담", en: "Team Lead · Full-stack Web" },
      badge: { ko: "졸업작품 · 실배포 운영 중", en: "Capstone · Live in production" },
      featured: true,
      summary: {
        ko: "고전문학 원문을 장면 단위로 AI 영상과 동기화해 읽는 플랫폼. Claude Code와 협업하는 AI-Native 방식으로 한 학기 만에 풀스택 실배포.",
        en: "Reads classic literature synced scene-by-scene with AI-generated video. Built full-stack and shipped in one semester via an AI-Native workflow with Claude Code."
      },
      bullets: {
        ko: [
          "Next.js(App Router) 단일 코드베이스로 화면+API 구성, Vercel 서버리스 배포, GitHub 형상관리.",
          "초기 Supabase(Auth+DB)로 구축 후 AWS(Cognito · RDS PostgreSQL · S3 presigned URL)로 마이그레이션.",
          "JWT 미들웨어 인증, 책/북마크/노트/형광펜 CRUD API, DB 설계, 끊김 없는 연속 재생 플레이어(더블 버퍼링) 구현.",
          "기획서·백로그·발표자료까지 직접 작성하며 3.5인분 분량을 한 학기에 완성."
        ],
        en: [
          "Single Next.js (App Router) codebase for UI + API, deployed serverless on Vercel with GitHub version control.",
          "Built on Supabase (Auth+DB) first, then migrated to AWS (Cognito · RDS PostgreSQL · S3 presigned URLs).",
          "JWT-middleware auth, CRUD APIs for books/bookmarks/notes/highlights, DB design, and a seamless double-buffered video player.",
          "Wrote the proposal, backlog, and presentation myself — shipping ~3.5 people's worth of work in one semester."
        ]
      },
      tags: ["Next.js", "Vercel", "AWS", "PostgreSQL", "S3", "AI-Native"],
      link: "https://cbnu-clip-it.vercel.app/"
    },
    {
      name: { ko: "LLM 에이전트 연구 · 멀티에이전트 확장", en: "LLM Agent Research · Multi-agent Extension" },
      year: "2025 –",
      role: { ko: "학부연구 (졸업논문 주제)", en: "Undergraduate research (thesis topic)" },
      badge: { ko: "", en: "" },
      featured: false,
      summary: {
        ko: "오픈소스 AI 에이전트의 내부를 코드 수준에서 해부하고, 역할 특화 멀티에이전트로 확장하며 신뢰성을 연구.",
        en: "Dissecting an open-source AI agent at the code level and extending it into role-specialized multi-agents to study reliability."
      },
      bullets: {
        ko: [
          "에이전트의 TypeScript 코드베이스를 분석해 작업 스케줄링·에이전트 루프·핵심 추상화가 사용자–서버–LLM 상호작용을 매개하는 방식을 추적.",
          "에이전트를 연구 도구로 투입해 새로운 금융사기 패턴을 탐색하고 방어 로직 초안을 자동 생성 — 개발 속도를 크게 가속.",
          "에이전트가 현실의 물리 입력(오타·모바일 타이핑 지연)을 무시해 취약한 로직을 만드는 신뢰성 결함을 발견, HITL(사람 검토) 방식을 도입.",
          "CEO/CTO/코드리뷰어 등 역할 특화 에이전트로 확장해 멀티에이전트 오케스트레이션과 신뢰성을 연구 중."
        ],
        en: [
          "Traced how task scheduling, the agent loop, and core abstractions mediate user–server–LLM interaction in the agent's TypeScript codebase.",
          "Deployed the agent as a research tool to discover new fraud patterns and auto-draft defense logic, sharply accelerating development.",
          "Found a reliability gap — the agent ignored real-world input (typos, mobile typing latency) and produced insecure logic — and adopted human-in-the-loop review.",
          "Extending toward role-specialized agents (CEO/CTO/code-reviewer) to study multi-agent orchestration and trustworthiness."
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
        en: "A learning app where an LLM generates vocabulary, quizzes, and podcast-style audio. Operated with real user feedback, end to end."
      },
      bullets: {
        ko: ["Flutter + Supabase(Auth·DB)로 구축해 앱스토어에 출시·운영하며 DB 설계를 실전 적용."],
        en: ["Built and shipped with Flutter + Supabase (Auth/DB), applying database design in production."]
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
