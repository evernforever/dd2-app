# DD 보고서만 생성

현재 대화에서 수집된 모든 분석 결과를 바탕으로
**dd-report-writer** agent를 호출하여 `$ARGUMENTS` 기업의 최종 DD 보고서를 작성하라.
파일명: `dd-report-$ARGUMENTS-$(date +%Y%m%d).md`
