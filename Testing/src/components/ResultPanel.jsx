import { useEffect, useState } from 'react'

// ─── Skill level config ───────────────────────────────────────────────────────
const SKILL_LEVELS = [
  { min: 90, level: 'Expert',       color: '#BF5FFF', glyph: '◈', desc: 'You reason at the architecture level. You understand not just what these systems do but why they are designed the way they are. You are ready for original security research.' },
  { min: 75, level: 'Advanced',     color: '#00FFFF', glyph: '◆', desc: 'Strong command of systems internals and defensive design. You can analyze binaries, reason about protection mechanisms, and conduct structured vulnerability research.' },
  { min: 50, level: 'Intermediate', color: '#00FF88', glyph: '◇', desc: 'Solid foundation in CPU architecture and memory layout. You understand the concepts but need more depth in protection mechanisms and reverse engineering methodology.' },
  { min: 0,  level: 'Beginner',     color: '#FFB800', glyph: '○', desc: 'You have started the journey. Focus on Module 1 and 2 first — execution internals and memory architecture are the foundation everything else builds on.' },
]

const getSkill = (pct) => SKILL_LEVELS.find(s => pct >= s.min) ?? SKILL_LEVELS[3]

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{display}</>
}

// ─── Skill badge ──────────────────────────────────────────────────────────────
function SkillBadge({ skill, pct }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t) }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
      padding: '40px 32px',
      background: `radial-gradient(ellipse at center, ${skill.color}11 0%, transparent 70%)`,
      border: `1px solid ${skill.color}44`,
      borderRadius: '12px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.9)',
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {/* Glyph */}
      <div style={{
        fontSize: '72px', color: skill.color,
        textShadow: `0 0 30px ${skill.color}, 0 0 60px ${skill.color}44`,
        lineHeight: 1,
        animation: 'glowPulse 3s ease infinite',
      }}>
        {skill.glyph}
      </div>

      {/* Level */}
      <div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px', color: skill.color,
          letterSpacing: '0.25em', textAlign: 'center',
          marginBottom: '6px', opacity: 0.7,
        }}>
          SKILL LEVEL
        </div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '42px', fontWeight: 700,
          color: '#FFFFFF', textAlign: 'center',
          letterSpacing: '-0.01em',
          textShadow: `0 0 20px ${skill.color}44`,
        }}>
          {skill.level}
        </div>
      </div>

      {/* Score */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '28px', color: skill.color,
        background: `${skill.color}11`,
        border: `1px solid ${skill.color}33`,
        borderRadius: '8px',
        padding: '8px 24px',
        letterSpacing: '0.05em',
      }}>
        <AnimatedNumber target={pct} />%
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px', lineHeight: '1.75',
        color: '#C8D4E8', textAlign: 'center',
        maxWidth: '420px', margin: 0,
      }}>
        {skill.desc}
      </p>
    </div>
  )
}

// ─── Module score row ─────────────────────────────────────────────────────────
function ModuleScoreRow({ mod, score, index }) {
  const max   = mod.questions.length
  const pct   = max > 0 ? Math.round((score / max) * 100) : 0
  const color = pct >= 80 ? '#00FF88' : pct >= 50 ? '#00FFFF' : pct >= 30 ? '#FFB800' : '#FF4466'
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const delay = setTimeout(() => {
      let start = null
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / 800, 1)
        setAnimated(Math.round(p * pct))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, index * 120)
    return () => clearTimeout(delay)
  }, [pct, index])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '12px 16px',
      background: '#0D0020',
      border: '1px solid #1A0040',
      borderRadius: '6px',
      animation: `fadeUp 0.3s ease ${index * 0.08}s both`,
    }}>
      {/* Module number */}
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px', color: '#4A20A0',
        width: '24px', flexShrink: 0, textAlign: 'center',
      }}>
        {String(mod.id).padStart(2, '0')}
      </span>

      {/* Title */}
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px', color: '#C8D4E8',
        flex: 1, minWidth: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {mod.title}
      </span>

      {/* Bar */}
      <div style={{
        width: '120px', height: '4px',
        background: '#1A0040', borderRadius: '2px',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{
          height: '100%', width: `${animated}%`,
          background: color, borderRadius: '2px',
          transition: 'width 0.1s linear',
          boxShadow: `0 0 6px ${color}`,
        }} />
      </div>

      {/* Score */}
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px', color: color,
        width: '60px', textAlign: 'right', flexShrink: 0,
      }}>
        {score}/{max}
      </span>

      {/* Pct */}
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px', color: '#4A20A0',
        width: '36px', textAlign: 'right', flexShrink: 0,
      }}>
        {pct}%
      </span>
    </div>
  )
}

// ─── Strengths / Gaps analysis ────────────────────────────────────────────────
function Analysis({ modules, moduleScores }) {
  const rows = modules.map(mod => {
    const score = moduleScores[mod.id] ?? 0
    const pct   = Math.round((score / mod.questions.length) * 100)
    return { ...mod, score, pct }
  })

  const strengths = rows.filter(r => r.pct >= 75).sort((a, b) => b.pct - a.pct)
  const gaps      = rows.filter(r => r.pct <  75).sort((a, b) => a.pct - b.pct)

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {/* Strengths */}
      <div style={{
        flex: 1, minWidth: '200px',
        background: '#001A0D', border: '1px solid #00FF8833',
        borderLeft: '3px solid #00FF88', borderRadius: '6px', padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '9px', color: '#00FF88',
          letterSpacing: '0.18em', marginBottom: '12px',
        }}>
          ✓  STRENGTHS
        </div>
        {strengths.length === 0 ? (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#4A20A0', fontStyle: 'italic' }}>
            Keep going — complete more modules to identify your strengths.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {strengths.map(s => (
              <li key={s.id} style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#C8D4E8' }}>
                <span style={{ color: '#00FF88', marginRight: '8px' }}>◆</span>
                {s.title}
                <span style={{ color: '#00FF88', marginLeft: '8px', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px' }}>
                  {s.pct}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gaps */}
      <div style={{
        flex: 1, minWidth: '200px',
        background: '#1A0010', border: '1px solid #FF446633',
        borderLeft: '3px solid #FF4466', borderRadius: '6px', padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '9px', color: '#FF4466',
          letterSpacing: '0.18em', marginBottom: '12px',
        }}>
          ↑  AREAS TO REVIEW
        </div>
        {gaps.length === 0 ? (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#4A20A0', fontStyle: 'italic' }}>
            No significant gaps — outstanding performance.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {gaps.map(g => (
              <li key={g.id} style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#C8D4E8' }}>
                <span style={{ color: '#FF4466', marginRight: '8px' }}>◇</span>
                {g.title}
                <span style={{ color: '#FF4466', marginLeft: '8px', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px' }}>
                  {g.pct}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Main ResultPanel ─────────────────────────────────────────────────────────
export default function ResultPanel({ modules, moduleScores, completedIds, onReset }) {
  const totalScore    = Object.values(moduleScores).reduce((a, b) => a + b, 0)
  const totalPossible = modules.reduce((a, m) => a + m.questions.length, 0)
  const pct           = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
  const skill         = getSkill(pct)

  return (
    <div style={{
      width: '100%', maxWidth: '800px',
      display: 'flex', flexDirection: 'column', gap: '28px',
      animation: 'fadeUp 0.4s ease',
      padding: '2rem 0',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px', color: '#4A20A0',
            letterSpacing: '0.25em', marginBottom: '4px',
          }}>
            NULLBYTE ACADEMY  ·  FINAL EVALUATION
          </div>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '28px', fontWeight: 700, color: '#FFFFFF',
          }}>
            Curriculum Complete
          </h2>
        </div>
        <button onClick={onReset} className="nb-btn-ghost">
          ↺ Restart
        </button>
      </div>

      {/* Skill badge */}
      <SkillBadge skill={skill} pct={pct} />

      {/* Per-module breakdown */}
      <div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '9px', color: '#4A20A0',
          letterSpacing: '0.2em', marginBottom: '12px',
        }}>
          MODULE BREAKDOWN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {modules.map((mod, i) => (
            <ModuleScoreRow
              key={mod.id}
              mod={mod}
              score={moduleScores[mod.id] ?? 0}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Strengths / gaps */}
      <div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '9px', color: '#4A20A0',
          letterSpacing: '0.2em', marginBottom: '12px',
        }}>
          SKILL ANALYSIS
        </div>
        <Analysis modules={modules} moduleScores={moduleScores} />
      </div>

      {/* Footer note */}
      <div style={{
        textAlign: 'center',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px', color: '#2A1060',
        letterSpacing: '0.12em', paddingTop: '8px',
        borderTop: '1px solid #1A0040',
      }}>
        mrwhite4939@gmail.com  ·  FOR EDUCATIONAL &amp; RESEARCH USE ONLY
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px currentColor; }
          50%       { text-shadow: 0 0 40px currentColor, 0 0 80px currentColor; }
        }
      `}</style>
    </div>
  )
}
