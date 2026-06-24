'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ============================
// 퀴즈 데이터
// ============================
const QUIZ_DATA = [
  {
    id: 1,
    question: '판 구조론에 의하면, 대륙은 현재도 조금씩 이동하고 있다.',
    answer: true,
    explanation: '판 구조론에 따르면 지구의 판들은 맨틀 대류에 의해 매년 수 cm씩 이동합니다.',
    category: '고체지구',
  },
  {
    id: 2,
    question: '현무암은 SiO₂ 함량이 높아 색이 밝은 편이다.',
    answer: false,
    explanation: '현무암은 SiO₂ 함량이 낮은 염기성 암석으로, 어두운 색을 띱니다. 밝은 색은 화강암 등 산성 암석의 특징입니다.',
    category: '고체지구',
  },
  {
    id: 3,
    question: '북반구에서 저기압 중심부로 바람은 반시계 방향으로 불어 들어온다.',
    answer: true,
    explanation: '북반구에서는 전향력(코리올리 힘)에 의해 저기압에서 바람이 반시계 방향으로 수렴합니다.',
    category: '대기와 해양',
  },
  {
    id: 4,
    question: '엘니뇨 현상 시 동태평양 해수면 온도가 평년보다 낮아진다.',
    answer: false,
    explanation: '엘니뇨 시 무역풍이 약해져 따뜻한 해수가 동태평양으로 이동하면서 동태평양 해수면 온도가 오히려 높아집니다.',
    category: '대기와 해양',
  },
  {
    id: 5,
    question: '태양은 현재 주계열성 단계에 있다.',
    answer: true,
    explanation: '태양은 수소 핵융합 반응을 통해 에너지를 생산하는 주계열성 단계에 있으며, 앞으로 약 50억 년간 이 단계를 유지할 것입니다.',
    category: '우주와 은하',
  },
  {
    id: 6,
    question: '지구 내부에서 P파는 S파보다 느리게 전파된다.',
    answer: false,
    explanation: 'P파(종파)는 S파(횡파)보다 빠르게 전파됩니다. P파가 먼저 도달하기 때문에 Primary(1차) 파라고 불립니다.',
    category: '고체지구',
  },
  {
    id: 7,
    question: '허블의 법칙에 따르면 은하의 후퇴 속도는 거리에 비례한다.',
    answer: true,
    explanation: '허블은 은하들이 우리로부터 멀어질수록 더 빠른 속도로 후퇴한다는 것을 발견했습니다. (v = H₀ × d)',
    category: '우주와 은하',
  },
  {
    id: 8,
    question: '심층수는 표층수보다 수온이 높고 밀도가 낮다.',
    answer: false,
    explanation: '심층수는 수온이 낮고 밀도가 높습니다. 극 지방에서 냉각된 표층수가 가라앉아 심층 순환을 형성합니다.',
    category: '대기와 해양',
  },
  {
    id: 9,
    question: '세페이드 변광성은 별까지의 거리를 측정하는 표준 광원으로 사용된다.',
    answer: true,
    explanation: '세페이드 변광성은 변광 주기와 절대 광도 사이에 관계가 있어, 주기를 관측하면 실제 밝기를 알 수 있으므로 거리 측정에 활용됩니다.',
    category: '우주와 은하',
  },
  {
    id: 10,
    question: '변환 단층은 두 판이 서로 어긋나게 이동하는 경계로, 지진은 발생하지만 화산은 거의 없다.',
    answer: true,
    explanation: '변환 단층 경계는 판이 생성되거나 소멸되지 않고 옆으로 미끄러지므로, 지진은 자주 발생하지만 화산 활동은 거의 없습니다.',
    category: '고체지구',
  },
]

// ============================
// 타입 정의
// ============================
type GamePhase = 'nickname' | 'playing' | 'result'

interface LeaderboardEntry {
  id: number
  nickname: string
  score: number
  total: number
  played_at: string
}

// ============================
// 메인 컴포넌트
// ============================
export default function QuizPage() {
  const [phase, setPhase] = useState<GamePhase>('nickname')
  const [nickname, setNickname] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUIZ_DATA.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [nicknameError, setNicknameError] = useState('')

  const currentQuiz = QUIZ_DATA[currentIndex]
  const userAnswer = answers[currentIndex]

  // ----------------------------
  // 닉네임 시작
  // ----------------------------
  const handleStart = () => {
    const trimmed = nickname.trim()
    if (!trimmed) {
      setNicknameError('닉네임을 입력해주세요!')
      return
    }
    if (trimmed.length > 12) {
      setNicknameError('닉네임은 12자 이하로 입력해주세요.')
      return
    }
    setNicknameError('')
    setPhase('playing')
  }

  // ----------------------------
  // OX 선택
  // ----------------------------
  const handleAnswer = (selected: boolean) => {
    if (userAnswer !== null) return // 이미 답변함

    const newAnswers = [...answers]
    newAnswers[currentIndex] = selected
    setAnswers(newAnswers)
    setShowExplanation(true)
  }

  // ----------------------------
  // 다음 문제
  // ----------------------------
  const handleNext = () => {
    setShowExplanation(false)
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // 게임 종료 - 점수 계산
      const finalScore = answers.reduce((acc, ans, idx) => {
        return acc + (ans === QUIZ_DATA[idx].answer ? 1 : 0)
      }, 0)
      setScore(finalScore)
      submitResult(finalScore)
    }
  }

  // ----------------------------
  // 결과 Supabase 저장
  // ----------------------------
  const submitResult = async (finalScore: number) => {
    setIsSubmitting(true)
    setPhase('result')
    try {
      await supabase.from('quiz_results').insert({
        nickname: nickname.trim(),
        score: finalScore,
        total: QUIZ_DATA.length,
      })
    } catch (err) {
      console.error('결과 저장 실패:', err)
    } finally {
      setIsSubmitting(false)
    }
    fetchLeaderboard()
  }

  // ----------------------------
  // 리더보드 불러오기
  // ----------------------------
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true)
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('id, nickname, score, total, played_at')
        .order('score', { ascending: false })
        .order('played_at', { ascending: true })
        .limit(10)

      if (!error && data) {
        setLeaderboard(data)
      }
    } catch (err) {
      console.error('리더보드 불러오기 실패:', err)
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  // ----------------------------
  // 다시 하기
  // ----------------------------
  const handleRestart = () => {
    setPhase('nickname')
    setNickname('')
    setCurrentIndex(0)
    setAnswers(Array(QUIZ_DATA.length).fill(null))
    setShowExplanation(false)
    setScore(0)
    setLeaderboard([])
  }

  // ----------------------------
  // 렌더링
  // ----------------------------
  return (
    <div className="quiz-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

        .quiz-page {
          font-family: 'Noto Sans KR', sans-serif;
          min-height: 100vh;
          background: radial-gradient(ellipse at top, #0a1628 0%, #050d1a 60%, #000 100%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
        }

        /* ---- 헤더 ---- */
        .quiz-header {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(12px);
          background: rgba(10, 22, 40, 0.85);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0 1.5rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .quiz-logo {
          font-size: 1.1rem;
          font-weight: 900;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .quiz-back-btn {
          font-size: 0.8rem;
          color: #94a3b8;
          text-decoration: none;
          padding: 0.4rem 0.9rem;
          border: 1px solid #334155;
          border-radius: 999px;
          transition: all 0.2s;
        }
        .quiz-back-btn:hover { color: #34d399; border-color: #34d399; }

        /* ---- 컨테이너 ---- */
        .quiz-container {
          width: 100%;
          max-width: 680px;
          padding: 2rem 1.5rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ---- PHASE: 닉네임 ---- */
        .nickname-card {
          width: 100%;
          background: rgba(15, 30, 55, 0.8);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          backdrop-filter: blur(8px);
          margin-top: 3rem;
          animation: fadeUp 0.5s ease;
        }
        .nickname-emoji { font-size: 4rem; margin-bottom: 1rem; }
        .nickname-title {
          font-size: 1.8rem;
          font-weight: 900;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .nickname-sub { color: #64748b; font-size: 0.95rem; margin-bottom: 2rem; }
        .nickname-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          font-size: 1rem;
          color: #e2e8f0;
          outline: none;
          text-align: center;
          transition: border-color 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .nickname-input:focus { border-color: #34d399; }
        .nickname-input::placeholder { color: #475569; }
        .nickname-error { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; }
        .start-btn {
          margin-top: 1.5rem;
          width: 100%;
          padding: 1rem;
          font-size: 1.05rem;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #34d399, #22d3ee);
          color: #05101f;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }
        .start-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(52,211,153,0.3); }
        .start-btn:active { transform: scale(0.97); }

        /* ---- PHASE: 게임 ---- */
        .progress-bar-wrap {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          height: 6px;
          margin-bottom: 0.6rem;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .progress-text {
          font-size: 0.8rem;
          color: #64748b;
          text-align: right;
          margin-bottom: 1.5rem;
        }
        .category-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          background: rgba(52, 211, 153, 0.12);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.25);
          margin-bottom: 1.2rem;
        }
        .question-card {
          width: 100%;
          background: rgba(15, 30, 55, 0.85);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem 1.8rem;
          text-align: center;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.35s ease;
        }
        .question-text {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.7;
          color: #f1f5f9;
          margin-bottom: 2rem;
        }
        .ox-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .ox-btn {
          flex: 1;
          max-width: 160px;
          padding: 1.2rem 0;
          font-size: 2.5rem;
          border: 2px solid transparent;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.22s;
          background: rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
        }
        .ox-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ox-btn-o { border-color: rgba(52,211,153,0.3); }
        .ox-btn-o::before { background: rgba(52,211,153,0.08); }
        .ox-btn-x { border-color: rgba(248,113,113,0.3); }
        .ox-btn-x::before { background: rgba(248,113,113,0.08); }
        .ox-btn:not(:disabled):hover::before { opacity: 1; }
        .ox-btn:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .ox-btn:disabled { cursor: not-allowed; }
        .ox-btn-selected-correct {
          border-color: #34d399 !important;
          background: rgba(52,211,153,0.15) !important;
          box-shadow: 0 0 20px rgba(52,211,153,0.25);
        }
        .ox-btn-selected-wrong {
          border-color: #f87171 !important;
          background: rgba(248,113,113,0.15) !important;
          box-shadow: 0 0 20px rgba(248,113,113,0.2);
        }
        .ox-btn-correct-hint {
          border-color: #34d399 !important;
          opacity: 0.6;
        }

        /* ---- 해설 ---- */
        .explanation-box {
          margin-top: 1.5rem;
          padding: 1.2rem 1.4rem;
          border-radius: 14px;
          text-align: left;
          animation: fadeUp 0.3s ease;
        }
        .explanation-correct {
          background: rgba(52, 211, 153, 0.08);
          border: 1px solid rgba(52, 211, 153, 0.25);
        }
        .explanation-wrong {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.25);
        }
        .explanation-label {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }
        .explanation-label-correct { color: #34d399; }
        .explanation-label-wrong { color: #f87171; }
        .explanation-text { font-size: 0.88rem; color: #94a3b8; line-height: 1.65; }

        .next-btn {
          width: 100%;
          margin-top: 1.2rem;
          padding: 0.9rem;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #34d399, #22d3ee);
          color: #05101f;
          cursor: pointer;
          transition: all 0.22s;
          font-family: inherit;
        }
        .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(52,211,153,0.25); }

        /* ---- PHASE: 결과 ---- */
        .result-card {
          width: 100%;
          text-align: center;
          animation: fadeUp 0.5s ease;
        }
        .result-emoji { font-size: 5rem; margin-bottom: 1rem; }
        .result-title {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .result-nickname { font-size: 1rem; color: #64748b; margin-bottom: 1.8rem; }
        .result-nickname strong { color: #e2e8f0; }
        .score-display {
          display: inline-flex;
          align-items: baseline;
          gap: 0.3rem;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 20px;
          padding: 1.2rem 2.5rem;
          margin-bottom: 2.5rem;
        }
        .score-number {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .score-total { font-size: 1.5rem; color: #64748b; }

        /* ---- 리더보드 ---- */
        .leaderboard-section {
          width: 100%;
          margin-bottom: 1.5rem;
        }
        .leaderboard-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }
        .leaderboard-table th {
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .leaderboard-table th:last-child,
        .leaderboard-table td:last-child { text-align: right; }
        .leaderboard-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .leaderboard-row:hover { background: rgba(255,255,255,0.03); }
        .leaderboard-row td {
          font-size: 0.88rem;
          padding: 0.7rem 0.8rem;
          color: #cbd5e1;
        }
        .rank-cell { color: #64748b; font-weight: 700; width: 32px; }
        .rank-1 { color: #fbbf24; }
        .rank-2 { color: #94a3b8; }
        .rank-3 { color: #f97316; }
        .my-row td { color: #34d399 !important; font-weight: 700; }
        .score-cell { font-weight: 700; color: #e2e8f0 !important; }
        .loading-text { color: #475569; font-size: 0.9rem; text-align: center; padding: 2rem 0; }

        .restart-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #34d399, #22d3ee);
          color: #05101f;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
          margin-bottom: 0.8rem;
        }
        .restart-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(52,211,153,0.3); }
        .home-btn {
          display: block;
          text-align: center;
          color: #475569;
          text-decoration: none;
          font-size: 0.88rem;
          transition: color 0.2s;
        }
        .home-btn:hover { color: #94a3b8; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .question-text { font-size: 1.05rem; }
          .ox-btn { font-size: 2rem; padding: 1rem 0; }
          .score-number { font-size: 3rem; }
        }
      `}</style>

      {/* 헤더 */}
      <header className="quiz-header">
        <span className="quiz-logo">지구최강 🌍</span>
        <Link href="/" className="quiz-back-btn">← 홈으로</Link>
      </header>

      <div className="quiz-container">

        {/* ==================== 닉네임 입력 ==================== */}
        {phase === 'nickname' && (
          <div className="nickname-card">
            <div className="nickname-emoji">🌍</div>
            <h1 className="nickname-title">OX 퀴즈 도전!</h1>
            <p className="nickname-sub">지구과학 개념 10문제를 풀어보세요</p>
            <input
              id="nickname-input"
              className="nickname-input"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              maxLength={12}
              autoFocus
            />
            {nicknameError && <p className="nickname-error">{nicknameError}</p>}
            <button id="start-quiz-btn" className="start-btn" onClick={handleStart}>
              게임 시작하기 🚀
            </button>
          </div>
        )}

        {/* ==================== 게임 중 ==================== */}
        {phase === 'playing' && currentQuiz && (
          <>
            {/* 진행 바 */}
            <div style={{ width: '100%', marginTop: '2rem', marginBottom: '0.5rem' }}>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / QUIZ_DATA.length) * 100}%` }}
                />
              </div>
              <p className="progress-text">{currentIndex + 1} / {QUIZ_DATA.length}</p>
            </div>

            <div className="question-card">
              <span className="category-badge">{currentQuiz.category}</span>

              <p className="question-text">Q{currentIndex + 1}. {currentQuiz.question}</p>

              <div className="ox-buttons">
                {/* O 버튼 */}
                <button
                  id={`answer-o-${currentIndex}`}
                  className={`ox-btn ox-btn-o ${
                    userAnswer !== null
                      ? userAnswer === true
                        ? currentQuiz.answer === true
                          ? 'ox-btn-selected-correct'
                          : 'ox-btn-selected-wrong'
                        : currentQuiz.answer === true
                        ? 'ox-btn-correct-hint'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleAnswer(true)}
                  disabled={userAnswer !== null}
                >
                  ⭕
                </button>

                {/* X 버튼 */}
                <button
                  id={`answer-x-${currentIndex}`}
                  className={`ox-btn ox-btn-x ${
                    userAnswer !== null
                      ? userAnswer === false
                        ? currentQuiz.answer === false
                          ? 'ox-btn-selected-correct'
                          : 'ox-btn-selected-wrong'
                        : currentQuiz.answer === false
                        ? 'ox-btn-correct-hint'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleAnswer(false)}
                  disabled={userAnswer !== null}
                >
                  ❌
                </button>
              </div>

              {/* 해설 */}
              {showExplanation && userAnswer !== null && (
                <>
                  <div
                    className={`explanation-box ${
                      userAnswer === currentQuiz.answer ? 'explanation-correct' : 'explanation-wrong'
                    }`}
                  >
                    <p className={`explanation-label ${userAnswer === currentQuiz.answer ? 'explanation-label-correct' : 'explanation-label-wrong'}`}>
                      {userAnswer === currentQuiz.answer ? '✅ 정답입니다!' : '❌ 오답입니다!'}
                    </p>
                    <p className="explanation-text">{currentQuiz.explanation}</p>
                  </div>
                  <button id="next-btn" className="next-btn" onClick={handleNext}>
                    {currentIndex < QUIZ_DATA.length - 1 ? '다음 문제 →' : '결과 보기 🏆'}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* ==================== 결과 ==================== */}
        {phase === 'result' && (
          <div className="result-card" style={{ marginTop: '2rem' }}>
            <div className="result-emoji">
              {score === 10 ? '🏆' : score >= 8 ? '🌟' : score >= 6 ? '👍' : score >= 4 ? '😅' : '😢'}
            </div>
            <h1 className="result-title">
              {score === 10 ? '만점 달성!' : score >= 8 ? '훌륭해요!' : score >= 6 ? '잘 했어요!' : score >= 4 ? '조금 더 공부해요!' : '다시 도전해봐요!'}
            </h1>
            <p className="result-nickname"><strong>{nickname}</strong>님의 점수</p>

            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {QUIZ_DATA.length}</span>
            </div>

            {/* 리더보드 */}
            <div className="leaderboard-section">
              <p className="leaderboard-title">🏅 리더보드 Top 10</p>
              {isLoadingLeaderboard ? (
                <p className="loading-text">순위 불러오는 중…</p>
              ) : leaderboard.length === 0 ? (
                <p className="loading-text">아직 기록이 없습니다.</p>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>닉네임</th>
                      <th>날짜</th>
                      <th>점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => {
                      const isMe = entry.nickname === nickname.trim() && entry.score === score
                      const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-cell'
                      const rankEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`
                      return (
                        <tr key={entry.id} className={`leaderboard-row ${isMe ? 'my-row' : ''}`}>
                          <td className={`rank-cell ${rankClass}`}>{rankEmoji}</td>
                          <td>{entry.nickname}{isMe ? ' ← 나' : ''}</td>
                          <td style={{ color: '#475569', fontSize: '0.78rem' }}>
                            {new Date(entry.played_at).toLocaleDateString('ko-KR')}
                          </td>
                          <td className="score-cell">{entry.score} / {entry.total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <button id="restart-btn" className="restart-btn" onClick={handleRestart}>
              다시 도전하기 🔄
            </button>
            <Link href="/" className="home-btn">홈으로 돌아가기</Link>
          </div>
        )}

      </div>
    </div>
  )
}
