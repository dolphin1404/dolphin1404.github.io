---
title: "Hermes Agent는 어떻게 스킬을 학습하는가?"
date: 2026-08-24 15:00:00 +0900
categories: [AI Agent, Code Analysis]
tags: [Hermes Agent, LLM Agent, Skill, Self-Improvement, Python]
description: "Hermes Agent의 실제 코드를 따라가며 사용자의 대화 속 경험이 어떻게 재사용 가능한 SKILL.md가 되는지 분석."
image:
  path: /assets/img/posts/hermes-skill-learning/learning-loop.svg
  alt: Hermes Agent의 스킬 학습 루프
pin: true
math: false
---

Hermes를 사용하다 보면 한 번쯤 이런 질문이 생긴다.

> “AI Agent가 스킬을 학습한다는데, 정말 모델이 다시 학습되는 걸까?”

먼저 결론부터 말하면 **모델의 가중치가 바뀌는 것은 아니다.**

Hermes는 작업 중 발견한 절차를 `SKILL.md`라는 Markdown 파일로 저장한다.

다음에 비슷한 요청이 들어오면 이 파일을 다시 읽고,

이전에 성공했던 순서를 재사용한다.

쉽게 말하면 모델을 다시 훈련하는 방식이 아니라, **잘 정리된 작업 노트를 다음 대화에서 다시 꺼내 보는 방식**에 가깝다.

이번 글에서는 다음 질문을 실제 코드 기준으로 살펴보려 한다.

- Hermes는 언제 “배울 것이 생겼다”고 판단할까?
- 누가 대화를 검토하고 `SKILL.md`를 만들까?
- 저장된 스킬은 다음 요청에서 어떻게 다시 사용될까?

> 분석 기준은 2026년 8월 24일의 `NousResearch/hermes-agent` 코드다.
>
> 구현은 빠르게 바뀔 수 있으므로,
>
> 링크한 원본 코드도 함께 확인하는 것을 권한다.
{: .prompt-info }

## 이 글의 핵심

1. Hermes의 학습 결과는 모델 파라미터가 아니라 `SKILL.md` 파일이다.
2. 조건을 충족하면 사용자 응답 이후 별도의 리뷰 에이전트가 대화를 검토한다.
3. 다음 요청에서는 스킬 목록을 먼저 보고, 필요한 경우 `skill_view`로 전체 내용을 읽는다.

## 목차

**1. Hermes에서 스킬은 무엇인가**

**2. 학습 시점을 어떻게 알아차리는가**

**3. 백그라운드 리뷰는 왜 따로 실행되는가**

**4. 어떤 경험을 스킬로 저장하는가**

**5. `SKILL.md`는 어떤 과정을 거쳐 생성되는가**

**6. 다음 요청에서 스킬을 어떻게 다시 사용하는가**

**7. Curator는 어떤 역할을 하는가**

**8. 장점과 한계**

![Hermes Agent 스킬 학습 전체 흐름](/assets/img/posts/hermes-skill-learning/learning-loop.svg)
_그림 1. 대화에서 생긴 경험이 다음 세션의 절차적 컨텍스트가 되는 과정_

## 1. Hermes에서 스킬은 무엇인가?
Hermes 코드에서 스킬은 “**procedural memory**”, 즉 **절차 기억**으로 설명된다.

여기서 Memory와 Skill을 혼동하기 쉽다.
둘의 차이는 다음과 같다.

| 구분 | 저장하는 내용 | 예시 |
|---|---|---|
| Memory | 계속 기억해야 하는 사실 | 사용자 선호, 작업 환경, 프로젝트 규칙 |
| Skill | 다시 사용할 수 있는 절차 | 설치 순서, 디버깅 방법, 검증 과정 |

파일 구조는 단순하다.

```text
~/.hermes/skills/
└── <category>/
    └── <skill-name>/
        ├── SKILL.md
        ├── references/
        ├── templates/
        └── scripts/
```

`SKILL.md`에는 **“언제 이 스킬을 써야 하는지”**,
**실행 절차**, **주의점**, **검증 방법**이 들어간다.

긴 자료는 `references/`, 재사용할 골격은 `templates/`, 결정적으로 다시 실행할 작업은 `scripts/`로 분리한다.

---

여기서 중요한 점은 **스킬은 실행 코드 그 자체가 아니라, 미래의 에이전트가 읽을 작업 지침이다.**

**Hermes**는 스킬의 이름과 설명을 먼저 보여 주며, 현재 요청과 관련이 있다고 판단되면 `skill_view`로 전체 내용을 읽는다.

관련 구현은 [`agent/prompt_builder.py`](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py)에서 확인할 수 있다.

<br>**한 줄로 요약하면, Memory는 “무엇을 기억할지”, Skill은 “어떻게 작업할지”를 저장한다.**
<br><br>

## 2. “배울 때가 됐다”는 것을 어떻게 알아차릴까?

스킬 생성에는 두 종류의 신호가 있다.

<h3>1. 메인 에이전트가 받는 지침 - SKILLS_GUIDANCE</h3>

```python
SKILLS_GUIDANCE = (
    "When you work out a non-trivial workflow, record it with skill_manage "
    "for future reuse.\n"
    "When using a skill and finding it outdated, incomplete, or wrong, "
    "patch it immediately with skill_manage(action='patch') — don't wait to be asked. "
    "Skills that aren't maintained become liabilities.\n"
    "\n"
    "## Skill Safety Rule\n"
    "1. **UNAVAILABLE** — If a skill placeholder contains `[SKILL_PRUNED]`, the skill content was lost in compression and is inaccessible.\n"
    "2. **RELOAD** — Before performing any action that depends on a skill, re-check its content with `skill_view(name='...')` if it shows `[SKILL_PRUNED]`.\n"
    "3. **WAIT** — If a skill is loading or was just pruned, wait for the reload confirmation before proceeding.\n"
    "4. **DEDUP** — After reloading a pruned skill, **ignore any remaining `[SKILL_PRUNED]` markers for that same skill** — they are historical artifacts from previous compactions and do not need further action."
)
```

복잡한 작업을 끝냈거나, 까다로운 오류를 해결했거나, 반복해서 쓸 만한 작업 순서를 발견했다면 스킬 저장을 고려하도록 안내한다.

기존 스킬에 잘못된 내용이 있었다면 새 스킬을 늘리기보다 기존 파일을 patch하도록 한다.

이 지침은 [Code Link <NousResearch/hermes-agent/prompt_builder.py - SKILLS_GUIDANCE>](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py)에 정의되어 있다.

<h3>2. 도구 사용 횟수 카운터 - agent._iters_since_skill </h3>

대화 루프는 `skill_manage`를 사용할 수 있는 상태에서 도구 호출 반복이 일어날 때마다 `_iters_since_skill`을 증가시킨다.

리뷰 주기는 `skills.creation_nudge_interval`로 설정할 수 있다.

```python
if skill_manage_is_available:
    agent._iters_since_skill += 1
```

턴이 끝날 때 카운터가 임계값을 넘으면 `_should_review_skills`가 켜지고 카운터는 0으로 돌아간다.

이후 사용자 응답이 먼저 전달된 다음, 백그라운드 리뷰가 시작된다.

즉 사용자는 본 작업의 응답을 기다리느라 리뷰까지 함께 기다릴 필요가 없다.

카운터와 트리거는 [Code Link agent/conversation_loop.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/conversation_loop.py), [Code Linke agent/turn_finalizer.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/turn_finalizer.py)에서 이어진다.

<br>
여기서 오해하기 쉬운 부분이 있다.

임계값에 도달했다고 무조건 새 스킬을 만드는 것은 아니다.

카운터는 **리뷰를 시작하는 조건**일 뿐이다.

실제 저장 여부는 다음 단계의 LLM 판단과 보호 규칙이 결정한다.
<br>
<br>

즉, “도구를 많이 사용했다”와 “새 스킬이 만들어졌다”는 같은 뜻이 아니다.

## 3. 백그라운드 리뷰는 왜 따로 실행될까?

Hermes는 현재 대화를 그대로 수정 모드로 바꾸지 않는다.

대화 스냅샷을 복사한 뒤, 별도의 `AIAgent`를 백그라운드 스레드에서 실행한다.

이 리뷰 에이전트는 원래 에이전트의 모델과 인증 정보를 활용하지만, 사용할 수 있는 도구는 memory와 skill 관리 도구로 제한된다.
<br>
<br>
이 격리에는 **세 가지 이유**가 있다.

1. 사용자의 현재 작업과 학습 리뷰가 모델의 주의를 두고 경쟁하지 않는다.
2. 리뷰용 프롬프트가 실제 대화 기록에 섞여 다음 턴의 역할을 오염시키지 않는다.
3. 백그라운드 에이전트가 터미널 같은 불필요한 도구를 호출하지 못한다.

실제로 리뷰 fork에는 persistence가 비활성화되고 도구 whitelist가 적용된다.

같은 모델을 사용하면 기존 prompt cache를 활용한다.

다른 보조 모델을 사용하면 대화를 digest 형태로 줄여 전달한다.

이 동작은 [Code Link agent/background_review.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/background_review.py)에 구현되어 있다.

![Hermes Agent의 메모리·스킬 학습 아키텍처](/assets/img/posts/hermes-skill-learning/verified-skill-learning-flow.svg)
_그림 2. 공식 아키텍처와 현재 코드에서 스킬 학습에 직접 관련된 경로만 남긴 흐름도_

## 4. 어떤 경험을 스킬로 저장할까?

리뷰 프롬프트는 꽤 구체적이다.

다음 중 하나가 나타나면 스킬 업데이트 후보로 본다.

- 사용자가 말투, 형식, 가독성, 작업 순서를 교정했다.
- 비자명한 수정, 우회 방법, 디버깅 경로가 실제로 작동했다.
- 이번 세션에서 읽은 기존 스킬에 잘못된 명령이나 빠진 단계가 있었다.
- 같은 종류의 미래 작업에서 다시 쓸 수 있는 검증된 절차가 생겼다.

반대로 다음은 저장하지 않는다.

- 설치되지 않은 바이너리나 일시적인 자격 증명 문제 같은 환경 의존 오류
- 재시도로 사라진 일시적 실패 그 자체
- 오늘의 PR 번호나 특정 오류 문자열에만 맞는 일회성 서사
- 끝내 해결하지 못한 시도들을 “권장 절차”처럼 포장한 내용

![Hermes의 스킬 생성 판단 그래프](/assets/img/posts/hermes-skill-learning/signal-decision.svg)
_그림 3. 신호가 있더라도 지속성·검증·소유권 필터를 통과해야 한다_

특히 흥미로운 것은 “새 스킬 생성”이 우선순위의 마지막이라는 점이다.

리뷰 에이전트는 다음 순서로 행동하도록 지시받는다.

1. 이번 세션에서 이미 읽은, curator가 관리하는 스킬을 patch한다.
2. 같은 문제군을 다루는 기존 umbrella skill을 찾는다.
3. 그 스킬 아래에 reference, template, script를 추가한다.
4. 어느 것에도 들어맞지 않을 때만 class-level 새 스킬을 만든다.

따라서 좋은 스킬 이름은 `fix-error-1234`가 아니라 `python-package-troubleshooting`처럼 **문제의 클래스**를 표현해야 한다.

이 판단 규칙 전체는 [ Code Link background_review.py:_SKILL_REVIEW_PROMPT](https://github.com/NousResearch/hermes-agent/blob/main/agent/background_review.py)에 들어 있다.

## 5. 판단은 어떻게 실제 `SKILL.md`가 될까?

리뷰 에이전트가 새 스킬이 필요하다고 판단하면 `skill_manage(action="create")`를 호출한다.

이후 작업은 모델이 임의로 파일을 쓰는 방식이 아니다.

정해진 검증 파이프라인을 통과한다.

```text
LLM tool call
  → name / category / frontmatter 검증
  → 이름 충돌 확인
  → 디렉터리 생성
  → atomic_write_text(SKILL.md)
  → security scan
  → 실패 시 rollback
  → usage, provenance 기록
  → system prompt cache 무효화
```

핵심 생성 함수인 [Code Link skill_manager_tool.py:_create_skill](https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_manager_tool.py)은 이름과 frontmatter, 콘텐츠 크기를 먼저 검사한다.

통과하면 `SKILL.md`를 원자적으로 기록하고 security scan hook을 호출한다.

에이전트 생성 스킬 검사가 설정에서 활성화되어 있고 위험 판정이 나오면, 방금 만든 디렉터리를 제거해 생성 전 상태로 되돌린다.

생성에 성공하면 스킬 목록을 담은 시스템 프롬프트 캐시를 비운다. 이는 다음 요청에서 새 스킬이 검색 대상에 들어가도록 하기 위해서다.

그리고 누가 만든 스킬인지도 기록한다.

<br>

백그라운드 리뷰가 만든 스킬은 curator 관리 대상으로 표시한다.

사용자가 직접 만든 스킬은 사용자 소유로 남겨 자동 관리가 함부로 수정하지 못하게 한다.

관련 코드는 [Code Link tools/skill_manager_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_manager_tool.py)와 [Code Link tools/skill_provenance.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_provenance.py)에서 확인할 수 있다.

## 6. 다음 요청에서는 어떻게 다시 사용할까?

저장만 해서는 학습 루프가 완성되지 않는다.

미래의 에이전트가 새 스킬의 존재를 알아야 한다.

Hermes의 prompt builder는 사용 가능한 스킬의 이름과 description을 `<available_skills>` 목록으로 만든다.

모델은 이 목록을 보고 현재 요청과 관련된 스킬이 있는지 확인한다.

관련성이 있다면 `skill_view(name)`로 전체 `SKILL.md`를 불러온다.

<br>

이때 description이 사실상 **검색 인덱스** 역할을 한다.

따라서 description에는 기능 소개보다 “언제 이 스킬을 사용해야 하는가”가 먼저 들어가는 편이 좋다.

선택된 뒤에는 `skill_view`가 전체 `SKILL.md`와 필요한 지원 파일을 읽는다.

정리하면 학습 결과는 다음과 같이 돌아온다.

```text
과거 대화의 성공 경험
→ SKILL.md
→ 다음 세션의 available_skills
→ skill_view
→ 현재 문제 해결 절차
```

가중치는 바뀌지 않는다. 대신 모델이 받는 **작업 컨텍스트와 행동 규칙**이 달라진다.

<br>

한 줄로 요약하면, **과거의 성공 경험을 다음 요청의 체크리스트로 바꾸는 구조**다.

## 7. Curator는 무엇을 할까?

스킬 생성과 Curator를 같은 기능으로 이해하기 쉽지만 역할은 다르다.

- background review: 방금 끝난 대화에서 새 지식을 찾아 스킬을 생성하거나 patch한다.
- curator: 이미 존재하는 스킬의 사용량과 중복을 장기적으로 관리한다.

curator는 `~/.hermes/skills/.usage.json`의 view, use, patch 시각을 읽는다.

기본값 기준으로 30일 동안 활동이 없으면 stale, 90일 동안 없으면 archived 상태로 옮긴다.

다시 사용하면 active로 돌아올 수 있고, archive는 hard delete가 아니므로 복구 가능하다.

![Hermes 스킬 lifecycle](/assets/img/posts/hermes-skill-learning/skill-lifecycle.svg)
_그림 4. curator의 결정적 lifecycle 전이. pinned 스킬은 자동 전이에서 제외된다_

LLM이 겹치는 스킬을 umbrella로 합치는 consolidation 단계도 있지만 기본값은 꺼져 있다.

반면 시간 기반 stale/archive 전이는 curator가 활성화되어 있으면 결정적으로 실행된다.

pinned 스킬은 자동 전이를 건너뛴다.

Hub에서 설치한 외부 소유 스킬은 curator의 수정 대상이 아니다.

자세한 기본값과 불변조건은 [Code Link agent/curator.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/curator.py)에서 볼 수 있다.

## 8. 직접 코드를 보고 느낀 장점과 한계

### 장점

- 추가 학습 인프라 없이 파일만으로 개인화된 절차를 축적한다.
- 사람이 `SKILL.md`를 열어 무엇을 배웠는지 감사할 수 있다.
- 잘못 배운 내용은 patch하거나 archive하고, 버전 관리할 수 있다.
- 사용자 소유와 자동 생성 스킬의 경계를 provenance로 분리한다.
- main task와 review를 분리해 응답 지연과 대화 오염을 줄인다.

### 한계

- 무엇이 재사용 가능한 지식인지 판단하는 주체는 여전히 LLM이므로 오판 가능성이 있다.
- 잘못된 성공 경험이 검증을 통과하면 미래 세션에 반복 전파될 수 있다.
- 스킬 수가 많아지면 description 품질과 curator 정책이 검색 정확도를 좌우한다.
- 파일 기반 학습은 새로운 능력을 모델 안에 만드는 것이 아니라, 기존 능력을 더 일관되게 호출하는 방식이다.

그래서 Hermes의 안전장치는 “무조건 많이 기억하기”보다 **검증된 절차만, 올바른 소유권 아래, 더 넓은 문제 클래스에 저장하기**에 집중한다.

## 결론: Hermes가 학습하는 것은 작업 방식이다

지금까지 내용을 한 문장으로 정리하면 이렇다.

> 대화에서 검증된 절차를 발견하고, 격리된 리뷰가 저장 가치를 판단한 뒤,
>
> 안전한 파일 쓰기로 `SKILL.md`를 만들고, 미래 세션의 시스템 프롬프트가 그 절차를 다시 호출한다.

이 방식은 파인튜닝보다 훨씬 가볍고 투명하다고 볼 수 있다.

동시에 “학습”이라는 표현을 사용할 때 모델 내부 학습과 런타임 컨텍스트 학습을 구분해야 한다는 점도 보여 준다.

Hermes가 스스로 더 나아지는 비밀은 가중치 변화가 아니라, **경험을 읽을 수 있는 절차로 바꾸는 피드백 루프**에 있다.

---

### 참고

- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- [background_review.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/background_review.py)
- [turn_finalizer.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/turn_finalizer.py)
- [prompt_builder.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py)
- [skill_manager_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_manager_tool.py)
- [curator.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/curator.py)
