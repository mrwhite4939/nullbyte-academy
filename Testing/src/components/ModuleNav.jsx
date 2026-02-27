import { useState } from 'react'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_ICON = {
  complete: { glyph: '✓', color: '#00FF88' },
  active:   { glyph: '▶', color: '#00FFFF' },
  locked:   { glyph: '○', color: '#2A1060' },
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div style={{ padding: '0 16px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#4A20A0', letterSpacing: '0.15em' }}>
          PROGRESS
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#00FF88', fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: '3px', background: '#1A0040', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #7B3FCC, #00FFFF)',
          borderRadius: '2px',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 6px #00FFFF66',
        }} />
      </div>
      <div style={{ marginTop: '5px', fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#4A20A0' }}>
        {value} of {total} modules complete
      </div>
    </div>
  )
}

// ─── Module Row ───────────────────────────────────────────────────────────────
function ModuleRow({ mod, status, isSelected, isExpanded, onSelect, onToggle, score }) {
  const icon   = STATUS_ICON[status] ?? STATUS_ICON.locked
  const locked = status === 'locked'

  return (
    <div style={{
      borderLeft: `2px solid ${isSelected ? '#BF5FFF' : status === 'complete' ? '#00FF8844' : '#1A0040'}`,
      background: isSelected ? '#12002A' : 'transparent',
      borderRadius: '0 4px 4px 0',
      transition: 'all 0.15s ease',
      opacity: locked ? 0.4 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => !locked && onSelect(mod.id)}
          disabled={locked}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 10px 10px 12px',
            background: 'none', border: 'none', textAlign: 'left',
            cursor: locked ? 'not-allowed' : 'pointer', outline: 'none',
          }}
        >
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '11px',
            color: icon.color, width: '14px', flexShrink: 0,
            textShadow: status !== 'locked' ? `0 0 6px ${icon.color}` : 'none',
          }}>
            {icon.glyph}
          </span>

          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#2A1060', flexShrink: 0 }}>
            {String(mod.id).padStart(2, '0')}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: '12px',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? '#FFFFFF' : status === 'complete' ? '#C8D4E8' : '#6070A0',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              transition: 'color 0.15s ease',
            }}>
              {mod.title}
            </div>
            {status === 'complete' && (
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#00FF8888', marginTop: '1px' }}>
                {score ?? 0}/{mod.questions.length} correct
              </div>
            )}
          </div>

          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', letterSpacing: '0.08em',
            color: locked ? '#2A1060' : mod.tagColor,
            border: `1px solid ${locked ? '#2A1060' : mod.tagColor + '55'}`,
            borderRadius: '2px', padding: '2px 5px', flexShrink: 0,
          }}>
            {mod.tag}
          </span>
        </button>

        {!locked && (
          <button
            onClick={() => onToggle(mod.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 10px', outline: 'none',
              color: isExpanded ? '#BF5FFF' : '#2A1060',
              fontSize: '16px', lineHeight: 1,
              transition: 'all 0.15s ease',
              transform: isExpanded ? 'rotate(90deg)' : 'none',
            }}
          >
            ›
          </button>
        )}
      </div>

      {isExpanded && !locked && (
        <ul style={{
          listStyle: 'none', margin: 0,
          padding: '4px 10px 10px 34px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          animation: 'fadeIn 0.15s ease',
        }}>
          {mod.topics.map((t, i) => (
            <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#6040A0', lineHeight: 1.5 }}>
              <span style={{ color: '#2A1060', marginRight: '6px' }}>—</span>{t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ModuleNav({ modules, activeId, completedIds, moduleScores, onSelect }) {
  const [expanded, setExpanded] = useState(() => new Set([activeId]))

  const toggle = (id) => setExpanded(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const handleSelect = (id) => {
    setExpanded(prev => new Set([...prev, id]))
    onSelect(id)
  }

  const getStatus = (mod) => {
    if (completedIds.has(mod.id)) return 'complete'
    if (mod.id <= activeId)       return 'active'
    return 'locked'
  }

  return (
    <nav style={{
      background: '#0D0020',
      border: '1px solid #2A1060',
      borderRadius: '10px',
      paddingTop: '18px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#C8D4E8', letterSpacing: '0.2em', fontWeight: 700 }}>
          CURRICULUM
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#4A20A0' }}>
          {modules.length} modules
        </span>
      </div>

      <ProgressBar value={completedIds.size} total={modules.length} />

      <div style={{ height: '1px', background: '#1A0040', marginBottom: '8px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px 14px' }}>
        {modules.map(mod => (
          <ModuleRow
            key={mod.id}
            mod={mod}
            status={getStatus(mod)}
            isSelected={activeId === mod.id}
            isExpanded={expanded.has(mod.id)}
            onSelect={handleSelect}
            onToggle={toggle}
            score={moduleScores[mod.id]}
          />
        ))}
      </div>
    </nav>
  )
}
