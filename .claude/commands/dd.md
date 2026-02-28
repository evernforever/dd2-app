# Due Diligence 전체 실행 + PPTX 자동 생성

대상 기업: $ARGUMENTS

다음 순서로 Due Diligence를 수행하고 PPTX 보고서까지 자동 생성하라.

---

## STEP 1: 기업 기본 조사
**dd-orchestrator** agent를 호출하여 `$ARGUMENTS` 기업의 기본 정보를 파악하고 DD 계획을 수립하라.

## STEP 2: 전문 분석 (병렬 실행)
orchestrator 완료 후, 아래 agent들을 동시에 호출하라:
- **dd-financial-analyst** — 재무 분석
- **dd-legal-reviewer** — 법무 검토
- **dd-business-analyst** — 사업/시장 분석
- **dd-tech-reviewer** — 기술/IP 검토
- **dd-hr-analyst** — 인력/조직 분석

## STEP 3: 통합 보고서 작성
모든 분석 완료 후 **dd-report-writer** agent를 호출하여 최종 보고서를 작성하라.
- 파일명: `dd-report-$ARGUMENTS-$(date +%Y%m%d).md`
- 모든 내용은 한국어로 작성

## STEP 4: PPTX 자동 생성
보고서 파일 생성 완료 즉시 **dd-pptx-maker** agent를 호출하여:
- 생성된 `dd-report-$ARGUMENTS-*.md` 파일을 읽어
- `dd-report-$ARGUMENTS-$(date +%Y%m%d).pptx` 파일로 변환하라

## 완료 시 출력
```
✅ DD 분석 완료: $ARGUMENTS
📄 보고서: dd-report-$ARGUMENTS-YYYYMMDD.md
📊 발표자료: dd-report-$ARGUMENTS-YYYYMMDD.pptx
```

---
모든 출력은 **한국어**로 작성하라.
