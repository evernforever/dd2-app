# 🔍 DD Multi-Agent System — 인터넷 조사 기반

내부 문서 없이 공개된 인터넷 정보만으로 기업 Due Diligence를 수행하는 Claude Code subagent 시스템입니다.

## 활용 공개 데이터 소스

| 영역 | 주요 소스 |
|------|---------|
| 재무 | DART 전자공시, 투자 유치 뉴스, Crunchbase/Thevc |
| 법무 | 대법원 판례, 공정위 제재, KIPRIS 특허 DB |
| 사업 | 공식 홈페이지, 증권사 리포트, 경쟁사 비교 |
| 기술 | GitHub, 채용공고, BuiltWith, CVE DB |
| 인력 | LinkedIn, 잡플래닛, 블라인드, 뉴스 |

## Subagent 구조

```
.claude/agents/
├── dd-orchestrator.md       # 총괄 + 공개정보 수집 조율 (opus)
├── dd-financial-analyst.md  # DART/공시/뉴스 재무 분석 (sonnet)
├── dd-legal-reviewer.md     # 법원/공정위/규제 조사 (sonnet)
├── dd-business-analyst.md   # 시장/경쟁/트렉션 조사 (sonnet)
├── dd-tech-reviewer.md      # GitHub/특허/기술 조사 (sonnet)
├── dd-hr-analyst.md         # LinkedIn/잡플래닛 조사 (sonnet)
└── dd-report-writer.md      # 통합 보고서 작성 (opus)
```

## 설치

```bash
# 프로젝트에 적용
cp -r .claude/ /your-project/

# 또는 글로벌 적용
cp .claude/agents/*.md ~/.claude/agents/
```

## 사용 예시

```
# 전체 DD
> 카카오에 대한 공개 정보 기반 DD 진행해줘

# 개별 조사
> dd-legal-reviewer로 토스 소송/제재 이력 조사해줘

# 특정 목적
> 쿠팡 파트너십 검토를 위한 간단한 DD 해줘
```

## 한계 및 주의사항

✅ **가능한 것**
- 상장사 재무 추이 파악 (DART)
- 공시된 소송/규제 제재 이력
- 시장 포지셔닝 및 경쟁 분석
- 경영진 이력 및 평판 조사

⚠️ **불가능한 것 (실제 DD에서 추가 필요)**
- 내부 계약서 및 Change of Control 조항
- 비공개 재무제표 상세
- 미등록 소송, 내부 컴플라이언스
- 실제 고객 이탈률, 파이프라인

---
⚠️ 본 시스템은 초기 스크리닝 도구입니다. 최종 투자/인수 결정 전 반드시 전문가 자문을 받으세요.