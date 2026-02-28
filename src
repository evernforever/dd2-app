import { useState, useRef, useEffect } from "react";

const AGENTS = {
  orchestrator: {
    name: "DD 오케스트레이터",
    icon: "⬡",
    color: "#C8A96E",
    model: "claude-opus-4-6",
    systemPrompt: `당신은 M&A 및 투자 Due Diligence 전문 오케스트레이터입니다. 내부 문서 없이 공개된 인터넷 정보만으로 기업 실사를 수행합니다.

🌐 언어 규칙: 모든 분석 결과, 보고서, 요약, 발견사항은 반드시 한국어(한글)로 작성하라. 영문 소스를 참조하더라도 출력은 항상 한국어로 한다. 고유명사(기업명, 기술명, 툴명)는 영문 병기 가능.

역할: 전체 DD 프로세스 계획 및 조율, 리스크 우선순위 결정, 통합 요약 작성

다음 형식으로 분석하세요:
1. 기업 기본 정보 요약 (업종, 설립연도, 규모, 상장 여부)
2. 각 분야(재무/법무/사업/기술/인력)별 주요 조사 방향 제시
3. 전체 리스크 등급 판단 (🔴 고위험 / 🟡 중간 / 🟢 양호)
4. DD 진행 권고사항

정보 신뢰도 표시: 🔵 공식문서 | 🟡 언론보도 | ⚪ 추정/간접정보`,
  },
  financial: {
    name: "재무 분석",
    icon: "₩",
    color: "#4A9D7F",
    model: "claude-sonnet-4-6",
    systemPrompt: `당신은 M&A 전문 재무 분석가입니다. 공개된 인터넷 정보만으로 기업 재무 실사를 수행합니다.

🌐 언어 규칙: 모든 출력은 반드시 한국어로 작성하라.

주요 조사 소스:
- DART 전자공시 (dart.fss.or.kr) - 사업보고서, 감사보고서
- 투자 유치 뉴스 (시리즈 라운드, 밸류에이션)
- Thevc.kr, Crunchbase (스타트업 투자 이력)
- 신용평가 정보, 뉴스 기사

분석 항목:
1. 매출 규모 및 성장률 (공시 또는 뉴스 기반)
2. 수익성 지표 (영업이익률, 흑자/적자 여부)
3. 재무 건전성 신호 (감사의견, 자금 조달 이력)
4. 투자/자금 조달 현황

출력 형식:
### 재무 분석 결과
| 지표 | 내용 | 출처 | 신뢰도 |
🔴 Red Flags / 🟡 Amber Flags / ✅ 긍정 신호
### 추가 확인 필요 항목`,
  },
  legal: {
    name: "법무 검토",
    icon: "⚖",
    color: "#7B6EA0",
    model: "claude-sonnet-4-6",
    systemPrompt: `당신은 M&A 전문 법무 검토 전문가입니다. 공개된 온라인 정보만으로 법적 리스크를 식별합니다.

🌐 언어 규칙: 모든 출력은 반드시 한국어로 작성하라.
⚠️ 최종 법적 판단은 반드시 자격을 갖춘 변호사에게 확인받아야 합니다.

주요 조사 소스:
- 대법원 판례 검색 (glaw.scourt.go.kr)
- 공정거래위원회 제재 (ftc.go.kr)
- KIPRIS 특허/상표 (kipris.or.kr)
- 뉴스: [기업명] 소송, 과징금, 공정위, 형사

분석 항목:
1. 소송/분쟁 이력
2. 공정위/금감원 제재 이력
3. 특허/IP 현황
4. 규제 컴플라이언스 이슈
5. 경영진 법적 리스크

출력 형식:
### 법무 검토 결과
| 항목 | 내용 | 출처 |
🔴 Red Flags / 🟡 Amber Flags / ✅ 확인 완료
### 전문가 자문 필요 항목`,
  },
  business: {
    name: "사업 분석",
    icon: "◈",
    color: "#D4743A",
    model: "claude-sonnet-4-6",
    systemPrompt: `당신은 M&A 전문 사업 분석가입니다. 공개된 인터넷 정보만으로 비즈니스 가치와 리스크를 분석합니다.

🌐 언어 규칙: 모든 출력은 반드시 한국어로 작성하라.

주요 조사 소스:
- 회사 공식 홈페이지, IR 자료
- 뉴스: 고객사, 파트너십, 수상 이력
- 앱 스토어/G2/Capterra 리뷰
- 증권사 리서치, 시장 보고서
- 채용공고 (성장 방향 파악)

분석 항목:
1. 비즈니스 모델 및 수익 구조
2. 시장 포지셔닝 및 경쟁사 비교
3. 주요 고객사 및 파트너십
4. 성장 트렉션 신호
5. 사업 리스크 (고객 집중도, 경쟁 심화 등)

출력 형식:
### 사업/시장 분석 결과
수익 모델 / 주요 고객 / 경쟁 포지션
🔴 Red Flags / 🟡 Amber Flags / ✅ 강점`,
  },
  tech: {
    name: "기술 검토",
    icon: "</> ",
    color: "#3A8AC4",
    model: "claude-sonnet-4-6",
    systemPrompt: `당신은 기술기업 M&A 전문 기술 심사역입니다. 공개된 온라인 정보만으로 기술 자산의 가치와 리스크를 평가합니다.

🌐 언어 규칙: 모든 출력은 반드시 한국어로 작성하라.

주요 조사 소스:
- GitHub 공개 레포 (코드 품질, 활동성, 스타 수)
- KIPRIS/Google Patents (특허 현황)
- 채용공고 (기술 스택 파악)
- BuiltWith/Wappalyzer (웹 기술 스택)
- CVE DB (보안 취약점 이력)
- 기술 블로그, 컨퍼런스 발표

분석 항목:
1. 기술 스택 및 현대성
2. 특허/IP 포트폴리오
3. 보안 리스크 이력
4. 기술 부채 신호
5. 핵심 기술 인력 의존도

출력 형식:
### 기술 검토 결과
기술 스택 / 특허 현황
🔴 Red Flags / 🟡 Amber Flags / ✅ 기술 강점`,
  },
  hr: {
    name: "인력 조직",
    icon: "⊕",
    color: "#C45B7A",
    model: "claude-sonnet-4-6",
    systemPrompt: `당신은 M&A 전문 인사/조직 분석가입니다. 공개된 온라인 정보만으로 인적 자본 리스크와 조직 특성을 평가합니다.

🌐 언어 규칙: 모든 출력은 반드시 한국어로 작성하라.

주요 조사 소스:
- LinkedIn (경영진 프로파일, 직원 수, 채용 현황)
- 잡플래닛 (직원 리뷰, 평점, 퇴사 이유)
- 블라인드 (익명 직원 의견)
- 뉴스: [기업명] 대표, 임원, 해고, 노사
- DART (임직원 현황, 임원 보수)

분석 항목:
1. 경영진 이력 및 신뢰도
2. 조직 규모 및 성장 추이
3. 조직문화 (잡플래닛/블라인드 기반)
4. 핵심인력 이탈 리스크
5. 노무 리스크 이력

출력 형식:
### 인력/조직 분석 결과
경영진 요약 / 조직문화 평점
🔴 Red Flags / 🟡 Amber Flags / ✅ 조직 강점`,
  },
};

const AGENT_ORDER = ["orchestrator", "financial", "legal", "business", "tech", "hr"];

function TypingIndicator({ color }) {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "8px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: color, opacity: 0.7,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AgentCard({ agentKey, agent, result, isLoading, isQueued }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (result) setExpanded(true);
  }, [result]);

  const status = isLoading ? "loading" : result ? "done" : isQueued ? "queued" : "idle";

  return (
    <div style={{
      border: `1px solid ${status === "done" ? agent.color + "60" : "#2a2a2a"}`,
      borderRadius: "8px",
      overflow: "hidden",
      transition: "all 0.3s ease",
      background: status === "done" ? agent.color + "08" : "#111",
    }}>
      <button
        onClick={() => result && setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "12px 16px", background: "none", border: "none",
          cursor: result ? "pointer" : "default", textAlign: "left",
        }}
      >
        <span style={{
          fontSize: "14px", fontFamily: "monospace", fontWeight: "700",
          color: agent.color, minWidth: "28px", textAlign: "center",
          opacity: status === "idle" ? 0.3 : 1,
        }}>
          {agent.icon}
        </span>
        <span style={{
          flex: 1, fontSize: "13px", fontWeight: "600", letterSpacing: "0.05em",
          color: status === "idle" ? "#444" : status === "queued" ? "#666" : "#ddd",
        }}>
          {agent.name}
        </span>
        {status === "loading" && <TypingIndicator color={agent.color} />}
        {status === "done" && (
          <span style={{ fontSize: "11px", color: agent.color, opacity: 0.8 }}>
            {expanded ? "▲" : "▼"}
          </span>
        )}
        {status === "queued" && (
          <span style={{ fontSize: "10px", color: "#444", letterSpacing: "0.1em" }}>대기중</span>
        )}
      </button>

      {expanded && result && (
        <div style={{
          padding: "0 16px 16px",
          borderTop: `1px solid ${agent.color}20`,
          fontSize: "13px", lineHeight: "1.7", color: "#ccc",
          whiteSpace: "pre-wrap", fontFamily: "'Noto Sans KR', sans-serif",
          maxHeight: "400px", overflowY: "auto",
        }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default function DDApp() {
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState("M&A");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [error, setError] = useState(null);
  const [finalReport, setFinalReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const abortRef = useRef(false);

  const callAgent = async (agentKey, companyName, purposeText, previousContext = "") => {
    const agent = AGENTS[agentKey];
    const userPrompt = `대상 기업: ${companyName}
실사 목적: ${purposeText}
${previousContext ? `\n이전 분석 컨텍스트:\n${previousContext}` : ""}

위 기업에 대해 공개된 인터넷 정보를 기반으로 ${agent.name} 관점에서 Due Diligence를 수행하세요.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: agent.model,
        max_tokens: 1000,
        system: agent.systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.[0]?.text || "";
  };

  const runDD = async () => {
    if (!company.trim()) return;
    abortRef.current = false;
    setIsRunning(true);
    setResults({});
    setLoading({});
    setFinalReport("");
    setError(null);

    const collectedResults = {};

    // 1. Orchestrator 먼저
    setCurrentAgent("orchestrator");
    setLoading({ orchestrator: true });
    try {
      const orchResult = await callAgent("orchestrator", company, purpose);
      if (abortRef.current) return;
      collectedResults["orchestrator"] = orchResult;
      setResults({ orchestrator: orchResult });
      setLoading({});
    } catch (e) {
      setError(`오케스트레이터 오류: ${e.message}`);
      setIsRunning(false);
      return;
    }

    // 2. 전문 분석 에이전트들 순차 실행
    const specialistAgents = ["financial", "legal", "business", "tech", "hr"];

    for (const agentKey of specialistAgents) {
      if (abortRef.current) break;
      setCurrentAgent(agentKey);
      setLoading((prev) => ({ ...prev, [agentKey]: true }));

      try {
        const ctx = collectedResults["orchestrator"] || "";
        const result = await callAgent(agentKey, company, purpose, ctx);
        if (abortRef.current) break;
        collectedResults[agentKey] = result;
        setResults((prev) => ({ ...prev, [agentKey]: result }));
      } catch (e) {
        collectedResults[agentKey] = `⚠️ 분석 중 오류 발생: ${e.message}`;
        setResults((prev) => ({ ...prev, [agentKey]: `⚠️ 분석 중 오류 발생: ${e.message}` }));
      }
      setLoading((prev) => ({ ...prev, [agentKey]: false }));
    }

    if (abortRef.current) {
      setIsRunning(false);
      setCurrentAgent(null);
      return;
    }

    // 3. 최종 보고서
    setReportLoading(true);
    setCurrentAgent("report");
    try {
      const allContext = Object.entries(collectedResults)
        .map(([k, v]) => `## ${AGENTS[k]?.name || k}\n${v}`)
        .join("\n\n---\n\n");

      const reportResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: 1000,
          system: `당신은 M&A 보고서 전문 작성가입니다. 모든 출력은 반드시 한국어로 작성하라.
각 분야 전문가 분석을 통합하여 의사결정자용 DD 요약 보고서를 작성하세요.

보고서 구조:
# [기업명] Due Diligence 요약 보고서

## Executive Summary
권고 의견: [진행 권고 / 조건부 진행 / 중단 권고]
핵심 근거 3가지

## 종합 리스크 스코어카드
| 영역 | 등급 | 핵심 이슈 |
|------|-----|---------|
각 영역별 🔴🟡🟢

## 주요 발견사항 TOP 5
우선순위별 정리

## 권고사항
즉시 조치 / 추가 확인 필요 / 전문가 자문 필요

---
⚠️ 본 보고서는 공개 정보 기반 초안입니다. 최종 의사결정 전 전문가 자문 필수.`,
          messages: [{
            role: "user",
            content: `기업명: ${company}\n실사 목적: ${purpose}\n\n아래 각 분야 분석 결과를 통합하여 최종 DD 요약 보고서를 작성하세요:\n\n${allContext}`,
          }],
        }),
      });
      const reportData = await reportResponse.json();
      setFinalReport(reportData.content?.[0]?.text || "");
    } catch (e) {
      setFinalReport(`⚠️ 보고서 생성 오류: ${e.message}`);
    }

    setReportLoading(false);
    setIsRunning(false);
    setCurrentAgent(null);
  };

  const stop = () => {
    abortRef.current = true;
    setIsRunning(false);
    setCurrentAgent(null);
    setLoading({});
    setReportLoading(false);
  };

  const isQueued = (agentKey) => {
    if (!isRunning) return false;
    const order = ["orchestrator", ...["financial", "legal", "business", "tech", "hr"]];
    const currentIdx = order.indexOf(currentAgent);
    const agentIdx = order.indexOf(agentKey);
    return agentIdx > currentIdx && !results[agentKey];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea:focus, input:focus { outline: none; }
        select { appearance: none; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0a0a0a", color: "#e0e0e0",
        fontFamily: "'Noto Sans KR', sans-serif", padding: "0",
      }}>
        {/* Header */}
        <div style={{
          borderBottom: "1px solid #1a1a1a", padding: "20px 32px",
          display: "flex", alignItems: "center", gap: "16px",
          position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10,
        }}>
          <div style={{
            width: "32px", height: "32px", background: "#C8A96E",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }} />
          <div>
            <h1 style={{
              fontFamily: "Syne, sans-serif", fontSize: "18px",
              fontWeight: "800", letterSpacing: "0.15em", color: "#fff",
            }}>DD INTELLIGENCE</h1>
            <p style={{ fontSize: "10px", color: "#444", letterSpacing: "0.2em" }}>
              DUE DILIGENCE MULTI-AGENT SYSTEM
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Input Section */}
          <div style={{
            background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px",
            padding: "24px", marginBottom: "28px",
          }}>
            <p style={{ fontSize: "11px", color: "#C8A96E", letterSpacing: "0.2em", marginBottom: "20px" }}>
              ▸ 조사 대상 설정
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", marginBottom: "16px" }}>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isRunning && company.trim() && runDD()}
                placeholder="기업명 입력 (예: 카카오, 쿠팡, 토스)"
                disabled={isRunning}
                style={{
                  background: "#0a0a0a", border: "1px solid #252525", borderRadius: "8px",
                  padding: "14px 18px", fontSize: "15px", color: "#fff",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  transition: "border-color 0.2s",
                }}
              />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                disabled={isRunning}
                style={{
                  background: "#0a0a0a", border: "1px solid #252525", borderRadius: "8px",
                  padding: "14px 18px", fontSize: "13px", color: "#aaa",
                  fontFamily: "'Noto Sans KR', sans-serif", cursor: "pointer",
                  minWidth: "120px",
                }}
              >
                <option>M&A</option>
                <option>투자 검토</option>
                <option>파트너십</option>
                <option>경쟁사 분석</option>
              </select>
            </div>

            <button
              onClick={isRunning ? stop : runDD}
              disabled={!isRunning && !company.trim()}
              style={{
                width: "100%", padding: "14px", borderRadius: "8px", border: "none",
                background: isRunning ? "#2a1a1a" : company.trim() ? "#C8A96E" : "#1a1a1a",
                color: isRunning ? "#C45B7A" : company.trim() ? "#0a0a0a" : "#333",
                fontSize: "13px", fontWeight: "700", letterSpacing: "0.15em",
                cursor: company.trim() || isRunning ? "pointer" : "not-allowed",
                fontFamily: "Syne, sans-serif", transition: "all 0.2s",
              }}
            >
              {isRunning ? "⬛  분석 중단" : "▶  DD 분석 시작"}
            </button>
          </div>

          {error && (
            <div style={{
              background: "#1a0808", border: "1px solid #4a1515", borderRadius: "8px",
              padding: "14px 18px", marginBottom: "20px", fontSize: "13px", color: "#e07070",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Agent Grid */}
          {(isRunning || Object.keys(results).length > 0) && (
            <div style={{ animation: "fadeIn 0.4s ease", marginBottom: "28px" }}>
              <p style={{ fontSize: "11px", color: "#444", letterSpacing: "0.2em", marginBottom: "14px" }}>
                ▸ 에이전트 분석 현황
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {AGENT_ORDER.map((key) => (
                  <AgentCard
                    key={key}
                    agentKey={key}
                    agent={AGENTS[key]}
                    result={results[key]}
                    isLoading={loading[key]}
                    isQueued={isQueued(key)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Final Report */}
          {(reportLoading || finalReport) && (
            <div style={{
              animation: "fadeIn 0.5s ease",
              border: "1px solid #C8A96E40",
              borderRadius: "12px", overflow: "hidden",
              background: "#C8A96E06",
            }}>
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid #C8A96E20",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "20px", height: "20px", background: "#C8A96E",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  animation: reportLoading ? "pulse 1.5s infinite" : "none",
                }} />
                <span style={{
                  fontFamily: "Syne, sans-serif", fontSize: "13px",
                  fontWeight: "700", letterSpacing: "0.15em", color: "#C8A96E",
                }}>
                  FINAL DD REPORT
                </span>
                {reportLoading && (
                  <span style={{ fontSize: "11px", color: "#666", marginLeft: "auto" }}>
                    보고서 생성 중...
                  </span>
                )}
              </div>
              {finalReport && (
                <div style={{
                  padding: "24px", fontSize: "13px", lineHeight: "1.8",
                  color: "#ccc", whiteSpace: "pre-wrap",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>
                  {finalReport}
                  <div style={{
                    marginTop: "24px", padding: "14px", borderRadius: "8px",
                    background: "#1a1505", border: "1px solid #3a2e10",
                    fontSize: "11px", color: "#8a7a50", lineHeight: "1.6",
                  }}>
                    ⚠️ 본 보고서는 공개 정보 기반 AI 초안입니다. 투자·인수 의사결정 전 공인회계사, 변호사 등 전문가 자문을 반드시 받으시기 바랍니다.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isRunning && Object.keys(results).length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#2a2a2a" }}>
              <div style={{
                fontSize: "48px", marginBottom: "16px", opacity: 0.3,
                fontFamily: "Syne, sans-serif",
              }}>⬡</div>
              <p style={{ fontSize: "13px", letterSpacing: "0.1em" }}>
                기업명을 입력하고 DD 분석을 시작하세요
              </p>
              <p style={{ fontSize: "11px", marginTop: "8px", color: "#222" }}>
                DART · 법원 판례 · LinkedIn · 잡플래닛 · GitHub 등 공개 정보 기반
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
