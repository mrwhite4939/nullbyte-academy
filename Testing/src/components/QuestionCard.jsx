import { useState, useRef, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const LETTERS = ['A', 'B', 'C', 'D', 'E']

const TYPE_LABELS = {
  mcq:           { label: 'MCQ',           color: '#00FFFF' },
  true_false:    { label: 'TRUE / FALSE',  color: '#BF5FFF' },
  short_answer:  { label: 'SHORT ANSWER',  color: '#FFB800' },
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const t = TYPE_LABELS[type] ?? { label: type.toUpperCase(), color: '#6070A0' }
  return (
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.15em',
      color: t.color,
      border: `1px solid ${t.color}44`,
      background: `${t.color}11`,
      borderRadius: '3px',
      padding: '3px 8px',
    }}>
      {t.label}
    </span>
  )
}

// ─── Difficulty Pip ───────────────────────────────────────────────────────────
function DifficultyPips({ level }) {
  // level: 1 = easy, 2 = medium, 3 = hard
  const colors = ['#00FF88', '#FFB800', '#FF4466']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          backgroundColor: i <= level ? colors[level - 1] : '#2A1060',
          boxShadow: i <= level ? `0 0 5px ${colors[level - 1]}` : 'none',
          transition: 'all 0.2s ease',
        }} />
      ))}
    </div>
  )
}

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ code }) {
  return (
    <pre style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '12px',
      lineHeight: '1.7',
      color: '#00FF88',
      background: '#050010',
      border: '1px solid #2A1060',
      borderLeft: '3px solid #00FF88',
      borderRadius: '4px',
      padding: '14px 16px',
      margin: '14px 0 6px',
      overflowX: 'auto',
      whiteSpace: 'pre',
    }}>
      {code}
    </pre>
  )
}

// ─── MCQ Option ───────────────────────────────────────────────────────────────
function MCQOption({ letter, text, state, onClick, disabled }) {
  const styles = {
    idle:     { bg: '#0D0020', border: '#2A1060', text: '#C8D4E8', letter: '#4A20A0' },
    selected: { bg: '#0A0030', border: '#00AACC', text: '#FFFFFF',  letter: '#00FFFF' },
    correct:  { bg: '#001A0D', border: '#00FF88', text: '#FFFFFF',  letter: '#00FF88' },
    wrong:    { bg: '#1A0015', border: '#FF4466', text: '#FFFFFF',  letter: '#FF4466' },
    missed:   { bg: '#001A0D', border: '#00FF8866', text: '#C8D4E8', letter: '#00FF8866' },
  }
  const c = styles[state] ?? styles.idle

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '6px',
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        outline: 'none',
        boxShadow: state === 'correct' ? '0 0 10px #00FF8833'
                 : state === 'wrong'   ? '0 0 10px #FF446633'
                 : state === 'selected'? '0 0 10px #00FFFF22'
                 : 'none',
      }}
    >
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        fontWeight: 700,
        color: c.letter,
        border: `1px solid ${c.border}`,
        borderRadius: '3px',
        padding: '2px 7px',
        flexShrink: 0,
        marginTop: '1px',
        transition: 'all 0.18s ease',
      }}>
        {letter}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        lineHeight: '1.65',
        color: c.text,
        transition: 'color 0.18s ease',
      }}>
        {text}
      </span>
      {(state === 'correct' || state === 'missed') && (
        <span style={{
          marginLeft: 'auto',
          color: '#00FF88',
          fontSize: '14px',
          flexShrink: 0,
          alignSelf: 'center',
        }}>✓</span>
      )}
      {state === 'wrong' && (
        <span style={{
          marginLeft: 'auto',
          color: '#FF4466',
          fontSize: '14px',
          flexShrink: 0,
          alignSelf: 'center',
        }}>✗</span>
      )}
    </button>
  )
}

// ─── True/False Option ────────────────────────────────────────────────────────
function TrueFalseOptions({ selected, onSelect, disabled, correctAnswer, submitted }) {
  const opts = ['True', 'False']
  const getState = (val) => {
    if (!submitted) return selected === val ? 'selected' : 'idle'
    const isCorrect = val === correctAnswer
    if (isCorrect) return 'correct'
    if (val === selected) return 'wrong'
    return 'idle'
  }

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {opts.map(val => {
        const state = getState(val)
        const colors = {
          idle:     { bg: '#0D0020', border: '#2A1060', text: '#C8D4E8' },
          selected: { bg: '#0A0030', border: '#BF5FFF', text: '#FFFFFF' },
          correct:  { bg: '#001A0D', border: '#00FF88', text: '#00FF88' },
          wrong:    { bg: '#1A0015', border: '#FF4466', text: '#FF4466' },
        }
        const c = colors[state] ?? colors.idle
        return (
          <button
            key={val}
            onClick={() => onSelect(val)}
            disabled={disabled}
            style={{
              flex: 1,
              padding: '16px',
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: '6px',
              color: c.text,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: disabled ? 'default' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: state !== 'idle' ? `0 0 12px ${c.border}44` : 'none',
            }}
          >
            {val.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

// ─── Short Answer Input ───────────────────────────────────────────────────────
function ShortAnswerInput({ onSubmit, submitted, isCorrect, keywords }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!submitted) inputRef.current?.focus()
  }, [submitted])

  const handleSubmit = () => {
    if (value.trim().length > 0) onSubmit(value.trim())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={submitted}
          placeholder="Type your answer and press Enter…"
          style={{
            width: '100%',
            padding: '13px 16px',
            background: '#050010',
            border: `1px solid ${submitted
              ? isCorrect ? '#00FF88' : '#FF4466'
              : value.length > 0 ? '#BF5FFF' : '#2A1060'
            }`,
            borderRadius: '6px',
            color: '#FFFFFF',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.18s ease',
            boxShadow: submitted && isCorrect ? '0 0 10px #00FF8833'
                     : submitted             ? '0 0 10px #FF446633'
                     : value.length > 0      ? '0 0 10px #BF5FFF22'
                     : 'none',
          }}
        />
        {!submitted && (
          <span style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: '#4A20A0',
          }}>
            ENTER ↵
          </span>
        )}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={value.trim().length === 0}
          className="nb-btn-primary"
          style={{
            alignSelf: 'flex-start',
            opacity: value.trim().length === 0 ? 0.4 : 1,
            cursor: value.trim().length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          color: '#6070A0',
        }}>
          KEY TERMS: {keywords.map((k, i) => (
            <span key={i} style={{ color: '#BF5FFF', marginRight: '8px' }}>{k}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Explanation Panel ────────────────────────────────────────────────────────
function ExplanationPanel({ explanation, isCorrect, reference }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: isCorrect ? '#001A0D' : '#1A0015',
      border: `1px solid ${isCorrect ? '#00FF8866' : '#FF446666'}`,
      borderLeft: `3px solid ${isCorrect ? '#00FF88' : '#FF4466'}`,
      borderRadius: '6px',
      animation: 'fadeUp 0.2s ease',
    }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        fontWeight: 700,
        color: isCorrect ? '#00FF88' : '#FF4466',
        letterSpacing: '0.15em',
        marginBottom: '8px',
      }}>
        {isCorrect ? '✓  CORRECT' : '✗  INCORRECT'}
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        lineHeight: '1.75',
        color: '#C8D4E8',
        margin: 0,
      }}>
        {explanation}
      </p>
      {reference && (
        <div style={{
          marginTop: '10px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: '#4A20A0',
        }}>
          REF: <span style={{ color: '#6040C0' }}>{reference}</span>
        </div>
      )}
    </div>
  )
}

// ─── Main QuestionCard Component ──────────────────────────────────────────────
export default function QuestionCard({
  question,
  answered,   // undefined | true | false (from parent)
  onAnswer,   // (questionId, isCorrect) => void
  onNext,     // () => void
  isLast,     // bool
}) {
  const [selected,  setSelected]  = useState(null)
  const [submitted, setSubmitted] = useState(answered !== undefined)
  const [isCorrect, setIsCorrect] = useState(answered ?? false)

  // ── MCQ helpers ──
  const getMCQState = (index) => {
    if (!submitted) return selected === index ? 'selected' : 'idle'
    if (index === question.correct) return 'correct'
    if (index === selected)         return 'wrong'
    if (index === question.correct) return 'missed'
    return 'idle'
  }

  const handleMCQSelect = (index) => {
    if (!submitted) setSelected(index)
  }

  const handleMCQSubmit = () => {
    if (selected === null) return
    const correct = selected === question.correct
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(question.id, correct)
  }

  // ── True/False helpers ──
  const handleTFSelect = (val) => {
    if (submitted) return
    setSelected(val)
  }

  const handleTFSubmit = () => {
    if (selected === null) return
    const correct = selected === question.correctAnswer
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(question.id, correct)
  }

  // ── Short answer helpers ──
  const handleShortSubmit = (value) => {
    const lower = value.toLowerCase()
    const correct = question.keywords.some(k =>
      lower.includes(k.toLowerCase())
    )
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(question.id, correct)
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      animation: 'fadeUp 0.25s ease',
      boxShadow: '0 4px 40px #00000060',
    }}>

      {/* ── Card Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TypeBadge type={question.type} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px',
            color: '#4A20A0',
            letterSpacing: '0.15em',
          }}>
            {question.tag}
          </span>
        </div>
        <DifficultyPips level={question.difficulty} />
      </div>

      {/* ── Question Text ── */}
      <div>
        {submitted && (
          <span style={{
            fontSize: '22px',
            color: isCorrect ? '#00FF88' : '#FF4466',
            marginRight: '10px',
            animation: 'fadeIn 0.2s ease',
            textShadow: `0 0 10px ${isCorrect ? '#00FF88' : '#FF4466'}`,
          }}>
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '1.65',
          color: '#FFFFFF',
        }}>
          {question.question}
        </span>
      </div>

      {/* ── Code snippet if present ── */}
      {question.code && <CodeBlock code={question.code} />}

      {/* ── Answer Input ── */}
      {question.type === 'mcq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {question.options.map((opt, i) => (
            <MCQOption
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={getMCQState(i)}
              onClick={() => handleMCQSelect(i)}
              disabled={submitted}
            />
          ))}
        </div>
      )}

      {question.type === 'true_false' && (
        <TrueFalseOptions
          selected={selected}
          onSelect={handleTFSelect}
          disabled={submitted}
          correctAnswer={question.correctAnswer}
          submitted={submitted}
        />
      )}

      {question.type === 'short_answer' && (
        <ShortAnswerInput
          onSubmit={handleShortSubmit}
          submitted={submitted}
          isCorrect={isCorrect}
          keywords={question.keywords ?? []}
        />
      )}

      {/* ── Explanation ── */}
      {submitted && (
        <ExplanationPanel
          explanation={question.explanation}
          isCorrect={isCorrect}
          reference={question.reference}
        />
      )}

      {/* ── Action Row ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        {/* Submit (MCQ + T/F only) */}
        {!submitted && question.type !== 'short_answer' && (
          <button
            onClick={question.type === 'mcq' ? handleMCQSubmit : handleTFSubmit}
            disabled={selected === null}
            className="nb-btn-primary"
            style={{
              opacity: selected === null ? 0.4 : 1,
              cursor: selected === null ? 'not-allowed' : 'pointer',
            }}
          >
            Check Answer
          </button>
        )}

        {/* Next */}
        {submitted && (
          <button
            onClick={onNext}
            className={isLast ? 'nb-btn-primary' : 'nb-btn-cyan'}
          >
            {isLast ? '◈ Finish Module' : 'Next Question →'}
          </button>
        )}

        {/* Hint */}
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: '#4A20A0',
          letterSpacing: '0.08em',
        }}>
          {!submitted && selected === null && 'Select an answer'}
          {!submitted && selected !== null && question.type !== 'short_answer' && 'Press Check to confirm'}
          {submitted && !isCorrect && `Correct: ${
            question.type === 'mcq'        ? LETTERS[question.correct]
            : question.type === 'true_false' ? question.correctAnswer
            : question.keywords?.[0]
          }`}
          {submitted && isCorrect && 'Well reasoned.'}
        </span>
      </div>
    </div>
  )
}
