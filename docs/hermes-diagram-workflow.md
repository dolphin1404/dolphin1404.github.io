# 코드 기반 아키텍처 흐름도 작업 방식

## 목적

공식 문서와 실제 코드를 함께 확인해, 블로그와 발표 자료에서 바로 사용할 수 있는 단순하고 정확한 구조도를 만든다.

## 정확성 원칙

1. 공식 문서에서 전체 구조와 공개 개념을 확인한다.
2. 현재 기본 브랜치의 코드에서 트리거, 조건, 저장, 재사용 경로를 검증한다.
3. 모든 화살표는 코드에서 확인되는 호출 또는 데이터 이동만 표현한다.
4. 설정 가능한 숫자는 기본값처럼 고정해서 쓰지 않는다.
5. 항상 실행되는 흐름과 조건부 흐름을 구분한다.
6. 저장 단계와 다음 요청에서의 재사용 단계를 분리한다.

## 시각 원칙

- `assets/img/posts/hermes-skill-learning/system-architecture.svg`를 Hermes 다이어그램의 고정 기준으로 사용한다.
- 새 그림을 만들기 전에 기준 SVG의 색상, 글꼴 클래스, 선 굵기, 박스 모서리, 바깥 여백을 그대로 가져온다.
- 1200×700 안팎의 가로형 SVG를 기본으로 한다.
- 전체 글꼴은 Pretendard를 우선 사용한다.
- 흰 배경, 회색 선, 강조색 한 가지로 제한한다.
- 박스에는 제목만 우선 배치한다.
- 파일명, 저장 형식, 핵심 조건만 한 줄로 보충한다.
- 긴 부연 설명과 하단 요약문은 넣지 않는다.
- 화살표는 직선 또는 직각으로 배치하고 서로 교차시키지 않는다.
- 최소 56px의 바깥 여백을 확보한다.
- UML은 시퀀스 구조와 생명선 배치를 유지하되 색상과 타이포그래피는 기준 SVG를 따른다.
- 텍스트 전용 레인과 연결선 전용 레인을 먼저 분리한다.
- 연결선과 라벨 사이는 최소 12px, 라벨과 박스 경계 사이는 최소 16px를 확보한다.
- UML 생명선이 메시지 라벨 뒤를 지날 때는 흰색 마스크를 두거나 라벨을 이동한다.

## 검증 순서

1. 문서와 코드에서 확인한 사실을 대응시킨다.
2. 근거 없는 노드와 화살표를 제거한다.
3. SVG를 실제 브라우저에서 최종 크기로 렌더링한다.
4. 원본 크기와 블로그 본문 폭에서 각각 렌더링한다.
5. 글자 잘림, 박스 겹침, 화살표와 텍스트의 충돌, 화살표 교차를 눈으로 확인한다.
6. 하나라도 겹치거나 잘린 요소가 있으면 전달하지 않고 좌표를 다시 배치한다.
7. 본문과 그림의 용어, 파일명, 조건이 같은지 확인한다.

## 본문 코드 링크 규칙

- 코드 근거 링크의 화면 표기는 `[Code Link 경로 - 함수 또는 역할]` 형식을 유지한다.
- 링크 URL은 검증한 커밋과 정확한 줄 범위를 가리킨다.
- 사용자가 직접 고친 링크 문구와 표기 방식은 후속 편집에서 덮어쓰지 않는다.

## 이번 Hermes 그림에서 확인한 사실

- 사용자 요청은 `AIAgent`의 Prompt Builder, Provider Resolution, Tool Dispatch 흐름을 거친다.
- 세션은 SQLite 기반 Session Storage에 저장되며 FTS5 검색을 사용한다.
- 조건이 충족된 턴은 사용자 응답 이후 별도의 백그라운드 리뷰로 전달될 수 있다.
- 리뷰 에이전트는 memory 및 skill 관리 도구만 사용하도록 제한된다.
- Memory는 세션 시작 시 frozen snapshot으로 시스템 프롬프트에 들어간다.
- Skill은 이름과 description으로 구성된 compact index가 먼저 노출된다.
- 관련 스킬의 전체 내용은 `skill_view`가 필요할 때 읽는다.

## 기준 자료

- <https://hermes-agent.nousresearch.com/docs/developer-guide/architecture>
- <https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/>
- <https://hermes-agent.nousresearch.com/docs/user-guide/features/memory>
- <https://github.com/NousResearch/hermes-agent/blob/main/agent/background_review.py>
- <https://github.com/NousResearch/hermes-agent/blob/main/agent/turn_finalizer.py>
