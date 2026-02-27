import { useState, useCallback } from 'react'
import ModuleNav    from './components/ModuleNav.jsx'
import QuestionCard from './components/QuestionCard.jsx'
import StackDiagram from './components/StackDiagram.jsx'
import ResultPanel  from './components/ResultPanel.jsx'
import { MODULES }  from './data/questions.js'

// ─── Scoring Engine ───────────────────────────────────────────────────────────
const calcSkillLevel = (pct) => {
  if (pct >= 90) return { level: 'Expert',       color: '#BF5FFF', glyph: '◈' }
  if (pct >= 75) return { level: 'Advanced',     color: '#00FFFF', glyph: '◆' }
  if (pct >= 50) return { level: 'Intermediate', color: '#00FF88', glyph: '◇' }
  return              { level: 'Beginner',       color: '#FFB800', glyph: '○' }
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onReset, totalScore, totalPossible }) {
  const pct = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
  return (
    <header className="nb-header">
      <div className="nb-header-inner">
        <div className="nb-logo-group">
          <span className="nb-logo-glyph">λ</span>
          <div>
            <div className="nb-logo-title">NULLBYTE ACADEMY</div>
            <div className="nb-logo-sub">Interactive Testing Lab</div>
          </div>
        </div>

        <div className="nb-header-right">
          {totalPossible > 0 && (
            <div className="nb-score-pill">
              <span className="nb-score-label">SCORE</span>
              <span className="nb-score-val">{totalScore}</span>
              <span className="nb-score-sep">/</span>
              <span className="nb-score-total">{totalPossible}</span>
              <span className="nb-score-pct">({pct}%)</span>
            </div>
          )}
          <button className="nb-btn-ghost" onClick={onReset}>↺ Reset</button>
        </div>
      </div>

      {/* Scan line */}
      <div className="nb-header-scan" />
    </header>
  )
}

// ─── Lab View (StackDiagram wrapper) ─────────────────────────────────────────
function LabView({ moduleId, onBack }) {
  return (
    <div className="nb-lab-view">
      <div className="nb-lab-header">
        <button className="nb-btn-ghost nb-back-btn" onClick={onBack}>
          ← Back to Quiz
        </button>
        <div className="nb-lab-badge">PRACTICAL LAB</div>
      </div>
      <StackDiagram moduleId={moduleId} />
    </div>
  )
}

// ─── Quiz Engine ──────────────────────────────────────────────────────────────
function QuizEngine({ module, moduleScores, onScore, onFinish }) {
  const questions = module.questions
  const [qIndex,   setQIndex]   = useState(0)
  const [answers,  setAnswers]  = useState({})   // { questionId: isCorrect }
  const [showLab,  setShowLab]  = useState(false)
  const [finished, setFinished] = useState(false)

  const handleAnswer = useCallback((questionId, isCorrect) => {
    setAnswers(prev => {
      if (prev[questionId] !== undefined) return prev
      const next = { ...prev, [questionId]: isCorrect }
      if (isCorrect) onScore(module.id, 1)
      return next
    })
  }, [module.id, onScore])

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1)
    } else {
      setFinished(true)
      onFinish(module.id)
    }
  }

  const scored  = Object.values(answers).filter(Boolean).length
  const total   = questions.length
  const current = questions[qIndex]

  if (showLab) {
    return <LabView moduleId={module.id} onBack={() => setShowLab(false)} />
  }

  if (finished) {
    const pct = Math.round((scored / total) * 100)
    return (
      <div className="nb-module-done">
        <div className="nb-done-glyph">✓</div>
        <h2 className="nb-done-title">Module Complete</h2>
        <p className="nb-done-sub">{module.title}</p>
        <div className="nb-done-score">
          {scored} / {total} correct  ·  {pct}%
        </div>
        <button className="nb-btn-primary" onClick={() => setShowLab(true)}>
          Open Practical Lab →
        </button>
      </div>
    )
  }

  return (
    <div className="nb-quiz-engine">
      {/* Progress bar */}
      <div className="nb-progress-bar">
        <div className="nb-progress-meta">
          <span className="nb-progress-label">
            Question {qIndex + 1} of {total}
          </span>
          <button
            className="nb-btn-ghost nb-lab-btn"
            onClick={() => setShowLab(true)}
          >
            ⬡ Open Lab
          </button>
        </div>
        <div className="nb-progress-track">
          <div
            className="nb-progress-fill"
            style={{ width: `${((qIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <QuestionCard
        key={current.id}
        question={current}
        answered={answers[current.id]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isLast={qIndex === questions.length - 1}
      />
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeModuleId, setActiveModuleId]   = useState(MODULES[0].id)
  const [moduleScores,   setModuleScores]     = useState({})  // { moduleId: score }
  const [completedIds,   setCompletedIds]     = useState(new Set())
  const [showResult,     setShowResult]       = useState(false)
  const [quizKey,        setQuizKey]          = useState(0)   // forces remount on reset

  const handleScore = useCallback((moduleId, delta) => {
    setModuleScores(prev => ({
      ...prev,
      [moduleId]: (prev[moduleId] ?? 0) + delta,
    }))
  }, [])

  const handleFinish = useCallback((moduleId) => {
    setCompletedIds(prev => new Set([...prev, moduleId]))
  }, [])

  const handleReset = () => {
    setModuleScores({})
    setCompletedIds(new Set())
    setShowResult(false)
    setActiveModuleId(MODULES[0].id)
    setQuizKey(k => k + 1)
  }

  // Total scoring
  const totalScore    = Object.values(moduleScores).reduce((a, b) => a + b, 0)
  const totalPossible = MODULES.reduce((a, m) => a + m.questions.length, 0)
  const allDone       = completedIds.size === MODULES.length

  const activeModule = MODULES.find(m => m.id === activeModuleId)

  return (
    <div className="nb-root">
      <Header
        onReset={handleReset}
        totalScore={totalScore}
        totalPossible={Object.keys(moduleScores).length > 0 ? totalPossible : 0}
      />

      {showResult ? (
        <div className="nb-body nb-body-result">
          <ResultPanel
            modules={MODULES}
            moduleScores={moduleScores}
            completedIds={completedIds}
            onReset={handleReset}
          />
        </div>
      ) : (
        <div className="nb-body">
          <aside className="nb-sidebar">
            <ModuleNav
              modules={MODULES}
              activeId={activeModuleId}
              completedIds={completedIds}
              moduleScores={moduleScores}
              onSelect={setActiveModuleId}
            />

            {allDone && (
              <button
                className="nb-btn-primary nb-evaluate-btn"
                onClick={() => setShowResult(true)}
              >
                ◈ Final Evaluation
              </button>
            )}
          </aside>

          <main className="nb-main">
            <div className="nb-module-header">
              <div className="nb-module-eyebrow">
                MODULE {String(activeModule.id).padStart(2, '0')}  ·  {activeModule.tag}
              </div>
              <h1 className="nb-module-title">{activeModule.title}</h1>
              <p className="nb-module-desc">{activeModule.description}</p>
            </div>

            <QuizEngine
              key={`${activeModuleId}-${quizKey}`}
              module={activeModule}
              moduleScores={moduleScores}
              onScore={handleScore}
              onFinish={handleFinish}
            />
          </main>
        </div>
      )}
    </div>
  )
}
