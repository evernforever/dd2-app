import { useState, useRef, useEffect } from "react";

const AGENT_CONFIGS = [
  {
    key: "orchestrator",
    name: "DD 오케스트레이터",
    icon: "⬡",
    color: "#C8A96E",
    prompt: (company, purpose) => `당신은 M&A 및 투자 Due Diligence 전문 오케스트레이터입니다. 모든 출력은 반드시 한국어로 작성하라.

대상 기업: ${company}
실사 목적: ${purpose}

다음을 분석하세요:
1. 기업 기본 정보 요약 (업종, 설립연도, 규모, 상장 여부, 대표자)
2. 최근 주요 뉴스 및 이슈 (알려진 것 기반)
3. 각 분야별 핵심 리스크 신호 (재무/법무/사업/기술/인력)
4. 전체 리스크 등급: 🔴 고위험 / 🟡 중간 / 🟢 양호
5. DD 진행 권고사항

정보 신뢰도: 🔵 공식문서 | 🟡 언론보도 | ⚪ 추정/간접정보`,
  },
  {
    key: "financial",
    name: "재무 분석",
    icon: "₩",
    color: "#4A9D7F",
    prompt: (company, purpose, ctx) => `당신은 M&A 전문 재무 분석가입니다. 모든 출력은 반드시 한국어로 작성하라.

대상 기업: ${company} | 목적: ${purpose}
${ctx ? `오케스트레이터 분석:\n${ctx}\n` : ""}
공개 정보 기반으로 재무 실사를 수행하세요:

1. 매출 규모 및 성장률 (DART 공시 또는 알려진 수치)
2. 수익성 (영업이익률, 흑자/적자 여부)
3. 재무 건전성 신호 (감사의견, 부채 현황, 자금 조달 이력)
4. 투자 유치 이력 및 밸류에이션 (스타트업의 경우)
5. 주요 재무 리스크

출력 형식:
### 재무 분석 결과
| 지표 | 내용 | 신뢰도 |
🔴 Red Flags / 🟡 Amber Flags / ✅ 긍정 신호
### 추가 확인 필요 항목`,
  },
  {
    key: "legal",
    name: "법무 검토",
    icon: "⚖",
    color: "#7B6EA0",
    prompt: (company, purpose, ctx) => `당신은 M&A 전문 법무 검토 전문가입니다. 모든 출력은 반드시 한국어로 작성하라.
⚠️ 최종 법적 판단은 자격을 갖춘 변호사 확인 필수.

대상 기업: ${company} | 목적: ${purpose}
${ctx ? `오케스트레이터 분석:\n${ctx}\n` : ""}
공개 정보 기반으로 법무 실사를 수행하세요:

1. 소송/분쟁 이력 (대법원 판례, 뉴스 기반)
2. 공정위/금감원 제재 이력 및 과징금
3. 특허/상표 현황 (KIPRIS 기반)
4. 규제 컴플라이언스 이슈 (인허가, 개인정보 등)
5. 경영진 법적 리스크

출력 형식:
### 법무 검토 결과
🔴 Red Flags / 🟡 Amber Flags / ✅ 확인 완료
### 전문가 자문 필요 항목`,
  },
  {
    key: "business",
    name: "사업 분석",
    icon: "◈",
    color: "#D4743A",
    prompt: (company, purpose, ctx) => `당신은 M&A 전문 사업 분석가입니다. 모든 출력은 반드시 한국어로 작성하라.

대상 기업: ${company} | 목적: ${purpose}
${ctx ? `오케스트레이터 분석:\n${ctx}\n` : ""}
공개 정보 기반으로 사업/시장 분석을 수행하세요:

1. 비즈니스 모델 및 수익 구조
2. 시장 포지셔닝 및 주요 경쟁사 비교
3. 주요 고객사 및 파트너십 현황
4. 성장 트렉션 신호 (수상, 미디어 노출, 파트너십)
5. 사업 리스크 (고객 집중도, 경쟁 심화, 시장 변화)

출력 형식:
### 사업/시장 분석 결과
수익 모델 / 경쟁 포지션 / 성장 가능성
🔴 Red Flags / 🟡 Amber Flags / ✅ 강점 및 기회`,
  },
  {
    key: "tech",
    name: "기술 검토",
    icon: "</>",
    color: "#3A8AC4",
    prompt: (company, purpose, ctx) => `당신은 기술기업 M&A 전문 기술 심사역입니다. 모든 출력은 반드시 한국어로 작성하라.

대상 기업: ${company} | 목적: ${purpose}
${ctx ? `오케스트레이터 분석:\n${ctx}\n` : ""}
공개 정보 기반으로 기술 자산을 평가하세요:

1. 기술 스택 및 현대성 (GitHub, 채용공고, 블로그 기반)
2. 특허/IP 포트폴리오 (KIPRIS, Google Patents)
3. 보안 리스크 이력 (CVE, 데이터 유출 뉴스)
4. 기술 부채 신호 및 확장성
5. 핵심 기술 인력 의존도

출력 형식:
### 기술 검토 결과
기술 스택 요약 / 특허 현황
🔴 Red Flags / 🟡 Amber Flags / ✅ 기술 강점`,
  },
  {
    key: "hr",
    name: "인력 조직",
    icon: "⊕",
    color: "#C45B7A",
    prompt: (company, purpose, ctx) => `당신은 M&A 전문 인사/조직 분석가입니다. 모든 출력은 반드시 한국어로 작성하라.

대상 기업: ${company} | 목적: ${purpose}
${ctx ? `오케스트레이터 분석:\n${ctx}\n` : ""}
공개 정보 기반으로 인력/조직 분석을 수행하세요:

1. 경영진 이력 및 신뢰도 (LinkedIn, 뉴스 기반)
2. 조직 규모 및 성장 추이
3. 조직문화 평가 (잡플래닛/블라인드 기반)
4. 핵심인력 이탈 리스크
5. 노무 리스크 이력 (임금체불, 분쟁, 중대재해)

출력 형식:
### 인력/조직 분석 결과
경영진 요약 / 문화 평가
🔴 Red Flags / 🟡 Amber Flags / ✅ 조직 강점`,
  },
];

const REPORT_PROMPT = (company, purpose, allResults) => `당신은 M&A 보고서 전문 작성가입니다. 모든 출력은 반드시 한국어로 작성하라.

아래 각 분야 분석 결과를 통합하여 의사결정자용 DD 최종 보고서를 작성하세요.

기업명: ${company} | 목적: ${purpose}

${allResults}

---
보고서 구조:
# ${company} Due Diligence 요약 보고서

## Executive Summary
권고 의견: [진행 권고 / 조건부 진행 / 중단 권고]
핵심 근거 3가지 (불릿 포인트)

## 종합 리스크 스코어카드
| 영역 | 등급 | 핵심 이슈 |
|------|-----|---------|
(각 영역별 🔴🟡🟢 표시)

## 주요 발견사항 TOP 5
우선순위 순으로 정리

## 권고사항 및 다음 단계
- 즉시 조치 필요
- 추가 확인 필요
- 전문가 자문 필요 항목

---
⚠️ 본 보고서는 공개 정보 기반 AI 초안입니다. 최종 의사결정 전 전문가 자문 필수.`;

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text || "";
}

function TypingDots({ color }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: color,
          display: "inline-block",
          animation: `ddBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </span>
  );
}

function AgentRow({ agent, result, isLoading, isQueued }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (result) setOpen(true); }, [result]);

  const status = isLoading ? "loading" : result ? "done" : isQueued ? "queued" : "idle";

  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${status === "done" ? agent.color + "55" : "#222"}`,
      background: status === "done" ? agent.color + "09" : "#0f0f0f",
      overflow: "hidden",
      transition: "border-color 0.3s, background 0.3s",
    }}>
      <button onClick={() => result && setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "11px 16px", background: "none", border: "none",
        cursor: result ? "pointer" : "default", textAlign: "left",
      }}>
        <span style={{
          fontFamily: "monospace", fontWeight: 700, fontSize: 13,
          color: status === "idle" ? "#2a2a2a" : agent.color,
          minWidth: 26, textAlign: "center",
        }}>{agent.icon}</span>
        <span style={{
          flex: 1, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
          color: status === "idle" ? "#333" : status === "queued" ? "#555" : "#ccc",
        }}>{agent.name}</span>
        {status === "loading" && <TypingDots color={agent.color} />}
        {status === "queued" && <span style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em" }}>대기</span>}
        {status === "done" && (
          <span style={{ fontSize: 10, color: agent.color + "aa" }}>{open ? "▲" : "▼"}</span>
        )}
      </button>
      {open && result && (
        <div style={{
          borderTop: `1px solid ${agent.color}18`,
          padding: "14px 16px",
          fontSize: 12.5, lineHeight: 1.75, color: "#bbb",
          whiteSpace: "pre-wrap", fontFamily: "'Noto Sans KR', sans-serif",
          maxHeight: 380, overflowY: "auto",
        }}>{result}</div>
      )}
    </div>
  );
}

export default function DDApp() {
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState("M&A");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState("");
  const [report, setReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const aborted = useRef(false);

  const isQueued = key => {
    if (!running) return false;
    const order = AGENT_CONFIGS.map(a => a.key);
    return order.indexOf(key) > order.indexOf(current) && !results[key];
  };

  const run = async () => {
    if (!company.trim()) return;
    aborted.current = false;
    setRunning(true);
    setResults({});
    setLoading({});
    setReport("");
    setError("");

    const collected = {};

    // 1. Orchestrator
    setCurrent("orchestrator");
    setLoading({ orchestrator: true });
    try {
      const r = await callClaude(AGENT_CONFIGS[0].prompt(company, purpose));
      if (aborted.current) return;
      collected.orchestrator = r;
      setResults({ orchestrator: r });
    } catch (e) {
      setError(`오케스트레이터 오류: ${e.message}`);
      setRunning(false);
      return;
    } finally {
      setLoading({});
    }

    // 2. Specialists
    for (const agent of AGENT_CONFIGS.slice(1)) {
      if (aborted.current) break;
      setCurrent(agent.key);
      setLoading(p => ({ ...p, [agent.key]: true }));
      try {
        const r = await callClaude(agent.prompt(company, purpose, collected.orchestrator));
        if (aborted.current) break;
        collected[agent.key] = r;
        setResults(p => ({ ...p, [agent.key]: r }));
      } catch (e) {
        const msg = `⚠️ 오류: ${e.message}`;
        collected[agent.key] = msg;
        setResults(p => ({ ...p, [agent.key]: msg }));
      }
      setLoading(p => ({ ...p, [agent.key]: false }));
    }

    if (aborted.current) { setRunning(false); setCurrent(null); return; }

    // 3. Final report
    setReportLoading(true);
    setCurrent("report");
    try {
      const allCtx = AGENT_CONFIGS
        .map(a => collected[a.key] ? `## ${a.name}\n${collected[a.key]}` : "")
        .filter(Boolean).join("\n\n---\n\n");
      const r = await callClaude(REPORT_PROMPT(company, purpose, allCtx));
      setReport(r);
    } catch (e) {
      setReport(`⚠️ 보고서 생성 오류: ${e.message}`);
    }
    setReportLoading(false);
    setRunning(false);
    setCurrent(null);
  };

  const stop = () => {
    aborted.current = true;
    setRunning(false);
    setCurrent(null);
    setLoading({});
    setReportLoading(false);
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Noto+Sans+KR:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ddBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ddFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ddPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
        input:focus,select:focus{outline:none}
        select{-webkit-appearance:none;appearance:none}
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#080808", color: "#ddd",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          borderBottom: "1px solid #161616", padding: "18px 28px",
          display: "flex", alignItems: "center", gap: 14,
          position: "sticky", top: 0, zIndex: 20, background: "#080808",
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8"
              fill="none" stroke="#C8A96E" strokeWidth="1.5" />
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11"
              fill="#C8A96E22" stroke="#C8A96E" strokeWidth="1" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Syne, sans-serif", fontWeight: 800,
              fontSize: 15, letterSpacing: "0.18em", color: "#eee",
            }}>DD INTELLIGENCE</div>
            <div style={{ fontSize: 9, color: "#383838", letterSpacing: "0.22em", marginTop: 1 }}>
              DUE DILIGENCE MULTI-AGENT SYSTEM
            </div>
          </div>
          {running && (
            <div style={{
              fontSize: 10, color: "#C8A96E", letterSpacing: "0.1em",
              animation: "ddPulse 1.8s infinite",
            }}>● 분석 진행중</div>
          )}
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px" }}>

          {/* Input card */}
          <div style={{
            background: "#0e0e0e", border: "1px solid #1a1a1a",
            borderRadius: 12, padding: "22px 22px 20px", marginBottom: 24,
          }}>
            <div style={{
              fontSize: 9, color: "#C8A96E", letterSpacing: "0.25em", marginBottom: 16,
            }}>▸ 조사 대상</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !running && company.trim() && run()}
                placeholder="기업명 입력 (예: 카카오, 쿠팡, 토스)"
                disabled={running}
                style={{
                  flex: 1, background: "#080808", border: "1px solid #202020",
                  borderRadius: 8, padding: "13px 16px", fontSize: 14,
                  color: "#eee", fontFamily: "'Noto Sans KR', sans-serif",
                }}
              />
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                disabled={running}
                style={{
                  background: "#080808", border: "1px solid #202020",
                  borderRadius: 8, padding: "13px 14px", fontSize: 12,
                  color: "#888", fontFamily: "'Noto Sans KR', sans-serif",
                  cursor: "pointer", minWidth: 110,
                }}
              >
                <option>M&A</option>
                <option>투자 검토</option>
                <option>파트너십</option>
                <option>경쟁사 분석</option>
              </select>
            </div>
            <button
              onClick={running ? stop : run}
              disabled={!running && !company.trim()}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 8, border: "none",
                background: running ? "#1c0f0f"
                  : company.trim() ? "#C8A96E" : "#141414",
                color: running ? "#C45B7A"
                  : company.trim() ? "#0a0a0a" : "#2a2a2a",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.18em",
                fontFamily: "Syne, sans-serif",
                cursor: (company.trim() || running) ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {running ? "⬛  분석 중단" : "▶  DD 분석 시작"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#160a0a", border: "1px solid #3a1212",
              borderRadius: 8, padding: "12px 16px", marginBottom: 18,
              fontSize: 12, color: "#d46060",
            }}>⚠️ {error}</div>
          )}

          {/* Agent rows */}
          {(running || hasResults) && (
            <div style={{ animation: "ddFade 0.35s ease", marginBottom: 24 }}>
              <div style={{
                fontSize: 9, color: "#2e2e2e", letterSpacing: "0.22em", marginBottom: 12,
              }}>▸ 에이전트 분석 현황</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {AGENT_CONFIGS.map(agent => (
                  <AgentRow
                    key={agent.key}
                    agent={agent}
                    result={results[agent.key]}
                    isLoading={!!loading[agent.key]}
                    isQueued={isQueued(agent.key)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Final report */}
          {(reportLoading || report) && (
            <div style={{
              animation: "ddFade 0.4s ease",
              border: "1px solid #C8A96E33",
              borderRadius: 12, overflow: "hidden",
              background: "#C8A96E05",
            }}>
              <div style={{
                padding: "14px 18px", borderBottom: "1px solid #C8A96E18",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 28 28"
                  style={{ animation: reportLoading ? "ddPulse 1.5s infinite" : "none" }}>
                  <polygon points="14,2 26,8 26,20 14,26 2,20 2,8"
                    fill="#C8A96E33" stroke="#C8A96E" strokeWidth="1.5" />
                </svg>
                <span style={{
                  fontFamily: "Syne, sans-serif", fontSize: 11,
                  fontWeight: 800, letterSpacing: "0.2em", color: "#C8A96E",
                }}>FINAL DD REPORT</span>
                {reportLoading && (
                  <span style={{ fontSize: 10, color: "#444", marginLeft: "auto" }}>
                    보고서 생성 중 <TypingDots color="#C8A96E" />
                  </span>
                )}
              </div>
              {report && (
                <div style={{
                  padding: "22px 20px",
                  fontSize: 13, lineHeight: 1.85, color: "#bbb",
                  whiteSpace: "pre-wrap", fontFamily: "'Noto Sans KR', sans-serif",
                }}>
                  {report}
                  <div style={{
                    marginTop: 20, padding: "12px 14px", borderRadius: 8,
                    background: "#120f05", border: "1px solid #2e2510",
                    fontSize: 10, color: "#6a5e38", lineHeight: 1.65,
                  }}>
                    ⚠️ 본 보고서는 Claude AI의 학습 데이터 기반 초안입니다. 실시간 웹 검색은 포함되지 않으며, 투자·인수 의사결정 전 반드시 공인회계사·변호사 등 전문가 자문을 받으시기 바랍니다.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!running && !hasResults && !report && (
            <div style={{ textAlign: "center", padding: "56px 0", color: "#1e1e1e" }}>
              <svg width="48" height="48" viewBox="0 0 28 28" style={{ marginBottom: 14, opacity: 0.2 }}>
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8"
                  fill="none" stroke="#C8A96E" strokeWidth="1.5" />
              </svg>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#252525" }}>
                기업명을 입력하고 DD 분석을 시작하세요
              </div>
              <div style={{ fontSize: 10, marginTop: 8, color: "#1a1a1a" }}>
                재무 · 법무 · 사업 · 기술 · 인력 5개 영역 동시 분석
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
