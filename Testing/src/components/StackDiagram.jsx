import { useState, useEffect, useRef } from 'react'

// ─── Initial stack state per module ───────────────────────────────────────────
const MODULE_STACKS = {
  1: {
    title: 'Stack Frame — Function Call Mechanics',
    subtitle: 'x86-64 · System V AMD64 ABI',
    scenario: 'Observe how a function call constructs and tears down a stack frame.',
    frames: [
      {
        id: 'kernel',
        label: 'Kernel Space',
        address: '0xFFFF800000000000',
        value: '[ INACCESSIBLE ]',
        type: 'kernel',
        note: 'Ring 0 only. User-space access → immediate segfault.',
      },
      {
        id: 'env',
        label: 'Environment / Args',
        address: '0x7FFFFFFFE800',
        value: 'argc, argv, envp',
        type: 'meta',
        note: 'Program arguments and environment variables live at the very top of the user stack.',
      },
      {
        id: 'ret_addr',
        label: 'Return Address',
        address: '0x7FFFFFFFE4A8',
        value: '0x00007ffff7a3c4b0',
        type: 'critical',
        note: 'Saved RIP. Loaded into RIP by RET. The primary control-flow target in stack attacks. Protected by stack canaries and CET shadow stack.',
      },
      {
        id: 'saved_rbp',
        label: 'Saved RBP',
        address: '0x7FFFFFFFE4A0',
        value: '0x00007FFFFFFFE4C0',
        type: 'frame',
        note: 'Caller\'s frame pointer saved by PUSH RBP in the prologue. Restoring this re-links the frame chain.',
      },
      {
        id: 'canary',
        label: 'Stack Canary ★',
        address: '0x7FFFFFFFE498',
        value: '0x9f3c00a1b7fe2d00',
        type: 'defense',
        note: 'Random value placed by the compiler between locals and saved RBP. Verified before RET. Null-terminated to resist string-based leaks.',
      },
      {
        id: 'local_a',
        label: 'int counter',
        address: '0x7FFFFFFFE490',
        value: '0x0000000000000000',
        type: 'local',
        note: 'Local integer variable. 8 bytes allocated (compiler-aligned). Lives at [RBP-16].',
      },
      {
        id: 'local_b',
        label: 'char* ptr',
        address: '0x7FFFFFFFE488',
        value: '0x0000000000000000',
        type: 'local',
        note: 'Local pointer variable. Uninitialized — contains garbage until explicitly set.',
      },
      {
        id: 'buf',
        label: 'char buf[64]',
        address: '0x7FFFFFFFE448',
        value: '[ 64 bytes ]',
        type: 'buffer',
        note: 'Fixed-size stack buffer. Grows toward LOWER addresses. An unbounded write here can overwrite canary → saved RBP → return address.',
      },
      {
        id: 'rsp',
        label: 'RSP  ← top of stack',
        address: '0x7FFFFFFFE440',
        value: '[ alignment pad ]',
        type: 'rsp',
        note: '16-byte alignment required before CALL (ABI constraint). MOVAPS and other SIMD instructions fault on misaligned stack.',
      },
    ],
  },
  2: {
    title: 'Heap vs Stack — Memory Region Comparison',
    subtitle: 'Virtual Address Space · x86-64 Linux',
    scenario: 'Compare how stack and heap regions are organized and how they grow.',
    frames: [
      {
        id: 'stack_region',
        label: 'STACK (thread 0)',
        address: '0x7FFFFFFF0000',
        value: 'grows ↓ downward',
        type: 'critical',
        note: 'Stack grows toward lower addresses. Each function call decrements RSP.',
      },
      {
        id: 'mmap_region',
        label: 'mmap / Libraries',
        address: '0x7F0000000000',
        value: 'libc.so, ld.so …',
        type: 'defense',
        note: 'Shared libraries loaded here by the dynamic linker. ASLR randomizes base per-run.',
      },
      {
        id: 'heap_region',
        label: 'HEAP',
        address: '0x0000555555780000',
        value: 'grows ↑ upward',
        type: 'buffer',
        note: 'Heap grows toward higher addresses. Managed by ptmalloc (glibc). Chunk headers adjacent to user data.',
      },
      {
        id: 'bss',
        label: '.bss (uninit globals)',
        address: '0x0000555555560000',
        value: '0x00 × N',
        type: 'local',
        note: 'Uninitialized global/static variables. Zero-filled at startup by the OS.',
      },
      {
        id: 'data',
        label: '.data (init globals)',
        address: '0x0000555555558000',
        value: 'initialized values',
        type: 'local',
        note: 'Initialized globals and statics. Read-write. Writable even in const-looking code if accessed via pointer.',
      },
      {
        id: 'rodata',
        label: '.rodata (read-only)',
        address: '0x0000555555556000',
        value: '"hello\\0", const[]',
        type: 'frame',
        note: 'String literals and const arrays. Read-only page — writes cause SIGSEGV. Not as "constant" as programmers assume.',
      },
      {
        id: 'text',
        label: '.text (code)',
        address: '0x0000555555554000',
        value: 'RX: executable code',
        type: 'meta',
        note: 'Executable, non-writable (NX). All machine instructions live here. PIE randomizes load address.',
      },
      {
        id: 'null',
        label: 'NULL guard page',
        address: '0x0000000000000000',
        value: '[ unmapped ]',
        type: 'kernel',
        note: 'Dereferencing a null pointer lands here. OS maps this as inaccessible — catches null dereferences immediately.',
      },
    ],
  },
  3: {
    title: 'Payload Anatomy — Conceptual Regions',
    subtitle: 'Theoretical only · No working exploit code',
    scenario: 'Understand the four structural regions a payload must satisfy. Click each to see the defensive countermeasure.',
    frames: [
      {
        id: 'region4',
        label: 'Region 4: Integrity / Env Setup',
        address: 'offset +N',
        value: 'register state setup',
        type: 'meta',
        note: 'Configures register arguments and stack alignment. Constrained by calling convention (which registers hold args, 16-byte RSP alignment).',
      },
      {
        id: 'region3',
        label: 'Region 3: Redirection Target',
        address: 'offset +24',
        value: '→ gadget / function',
        type: 'defense',
        note: 'Must point to executable code (NX constraint). Must be at a known address (ASLR+PIE constraint). CFI restricts valid targets further.',
      },
      {
        id: 'region2',
        label: 'Region 2: Control Overwrite',
        address: 'offset +16',
        value: '8 bytes (pointer)',
        type: 'critical',
        note: 'Overwrites the saved return address. Must bypass the stack canary. Must contain a valid 8-byte address with no null bytes (if via strcpy).',
      },
      {
        id: 'region1',
        label: 'Region 1: Filler / Alignment',
        address: 'offset +0',
        value: 'N bytes padding',
        type: 'buffer',
        note: 'Fills the buffer up to the canary. Size = exact offset from buffer start to canary. Must not contain null bytes if delivered via string functions.',
      },
      {
        id: 'defense_nx',
        label: 'Defense: NX/DEP',
        address: 'page table bit',
        value: 'XD/NX bit = 1',
        type: 'defense',
        note: 'Non-Executable bit. Hardware-enforced by MMU. Makes Region 3 point to existing code only — eliminates injected shellcode.',
      },
      {
        id: 'defense_aslr',
        label: 'Defense: ASLR + PIE',
        address: 'randomized',
        value: '~28 bits entropy',
        type: 'defense',
        note: 'Randomizes all code addresses per-run. Makes Region 3 require an information leak to compute. Without leak, 1-in-268M chance of correct guess.',
      },
      {
        id: 'defense_canary',
        label: 'Defense: Stack Canary',
        address: '[RBP-8]',
        value: 'random || 0x00',
        type: 'defense',
        note: 'Blocks sequential overwrite path to Region 2. Canary leak (via format string or read primitive) is required to bypass.',
      },
      {
        id: 'defense_cfi',
        label: 'Defense: CFI + Shadow Stack',
        address: 'hardware / compiler',
        value: 'CET / LLVM-CFI',
        type: 'defense',
        note: 'Validates that Region 3 targets a legitimate call site. Shadow stack (CET) maintains hardware-protected return address copy.',
      },
    ],
  },
  4: {
    title: 'Machine Code Decoder — Opcode Anatomy',
    subtitle: 'x86-64 Instruction Encoding',
    scenario: 'Decode a function prologue byte by byte. Each row is one instruction field.',
    frames: [
      {
        id: 'prefix_rex',
        label: 'REX Prefix',
        address: 'byte 0',
        value: '0x48',
        type: 'meta',
        note: '0x48 = 0100 1000b. REX.W=1 → 64-bit operand size. REX.R=0, REX.X=0, REX.B=0. Without this, MOV would operate on 32-bit registers.',
      },
      {
        id: 'opcode',
        label: 'Opcode',
        address: 'byte 1',
        value: '0x89',
        type: 'local',
        note: '0x89 = MOV r/m64, r64. The direction bit is 0: source is reg field, destination is r/m field.',
      },
      {
        id: 'modrm',
        label: 'ModR/M byte',
        address: 'byte 2',
        value: '0xE5',
        type: 'frame',
        note: '0xE5 = 1110 0101b. mod=11 (register-to-register). reg=100 (RSP = source). r/m=101 (RBP = destination). Decoded: MOV RBP, RSP',
      },
      {
        id: 'push_rbp',
        label: 'PUSH RBP',
        address: 'byte 3',
        value: '0x55',
        type: 'critical',
        note: '0x55 = PUSH r64 with register field = 5 (RBP). No REX needed (RBP is in base register set). Decrements RSP by 8, writes RBP to [RSP].',
      },
      {
        id: 'sub_rsp',
        label: 'SUB RSP, 0x40',
        address: 'bytes 4-7',
        value: '48 83 EC 40',
        type: 'buffer',
        note: '48=REX.W, 83=SUB r/m64 imm8, EC=ModR/M(mod=11,grp=5,r/m=4=RSP), 40=64 decimal. Allocates 64 bytes for local variables.',
      },
      {
        id: 'ret',
        label: 'RET',
        address: 'byte N',
        value: '0xC3',
        type: 'rsp',
        note: '0xC3 = near return. Pops 8 bytes from stack into RIP. If the saved return address was corrupted, execution jumps to attacker-controlled address.',
      },
      {
        id: 'call',
        label: 'CALL rel32',
        address: 'bytes K to K+4',
        value: 'E8 XX XX XX XX',
        type: 'local',
        note: 'E8 = CALL rel32. 4-byte signed relative displacement follows. CPU pushes next instruction address then jumps to RIP + displacement.',
      },
      {
        id: 'syscall',
        label: 'SYSCALL',
        address: 'bytes M, M+1',
        value: '0F 05',
        type: 'defense',
        note: 'Two-byte opcode. Transitions to Ring 0. RAX=syscall number, args in RDI/RSI/RDX/R10/R8/R9. Monitored by seccomp-bpf filters.',
      },
    ],
  },
  5: {
    title: 'Protection Stack — Defense-in-Depth',
    subtitle: 'Modern mitigation layers on x86-64 Linux',
    scenario: 'Each row is a protection layer. Click to understand its threat model and what it leaves intact.',
    frames: [
      {
        id: 'shadow_stack',
        label: 'Shadow Stack (CET)',
        address: 'hardware',
        value: 'Intel CET / ARM BTI',
        type: 'defense',
        note: 'Hardware-maintained read-only copy of return addresses. CPU compares on every RET. Mismatch → immediate fault. Defeats all software ROP chains.',
      },
      {
        id: 'pac',
        label: 'PAC (Pointer Auth)',
        address: 'ARM hardware',
        value: 'PACIA / PACIB',
        type: 'defense',
        note: 'Signs code pointers with a cryptographic key stored in hardware. Modification without the key produces an invalid PAC that faults on use.',
      },
      {
        id: 'cfi',
        label: 'CFI (Control Flow Integrity)',
        address: 'compiler pass',
        value: 'LLVM-CFI / KCFI',
        type: 'defense',
        note: 'Validates indirect call/jump targets against compile-time call graph. Forward-edge: type-compatible targets only. Backward-edge: shadow stack.',
      },
      {
        id: 'aslr_pie',
        label: 'ASLR + PIE',
        address: 'OS + compiler',
        value: '~28 bits entropy',
        type: 'frame',
        note: 'ASLR randomizes stack/heap/library bases. PIE extends randomization to the executable itself. Requires an information leak to defeat.',
      },
      {
        id: 'nx',
        label: 'NX / DEP',
        address: 'page table (XD bit)',
        value: 'NX=1 on data pages',
        type: 'frame',
        note: 'Hardware page table bit. Prevents executing code in data regions. Eliminates shellcode injection. Does not prevent code reuse (ROP).',
      },
      {
        id: 'canary',
        label: 'Stack Canary',
        address: '[RBP-8]',
        value: 'random ++ 0x00',
        type: 'critical',
        note: 'Compiler-inserted random value. Checked before every function return. Requires a read primitive to leak canary value before overwrite.',
      },
      {
        id: 'relro',
        label: 'Full RELRO',
        address: 'ELF section',
        value: 'GOT → read-only',
        type: 'local',
        note: 'Resolves all dynamic symbols at startup, then marks GOT read-only. Prevents GOT overwrite attacks. Small startup overhead.',
      },
      {
        id: 'asan',
        label: 'ASAN / HWASAN',
        address: 'shadow memory',
        value: 'byte-granularity tags',
        type: 'buffer',
        note: 'Compiler instrumentation (ASAN) or hardware memory tagging (HWASAN/MTE). Detects out-of-bounds, use-after-free, double-free at runtime.',
      },
    ],
  },
}

// ─── Type color system ────────────────────────────────────────────────────────
const TYPE_STYLES = {
  critical: { bg: '#1A0020', border: '#BF5FFF', text: '#BF5FFF', glow: '#BF5FFF33' },
  frame:    { bg: '#001020', border: '#00AACC', text: '#00FFFF', glow: '#00FFFF22' },
  defense:  { bg: '#001A0D', border: '#00CC66', text: '#00FF88', glow: '#00FF8822' },
  local:    { bg: '#0D0020', border: '#4A20A0', text: '#C8D4E8', glow: 'transparent' },
  buffer:   { bg: '#1A0010', border: '#FF4466', text: '#FF6688', glow: '#FF446622' },
  rsp:      { bg: '#001020', border: '#00AACC', text: '#00FFFF', glow: '#00FFFF22' },
  kernel:   { bg: '#100000', border: '#663333', text: '#AA5555', glow: 'transparent' },
  meta:     { bg: '#0D0020', border: '#4A20A0', text: '#8888CC', glow: 'transparent' },
}

// ─── Stack Row ────────────────────────────────────────────────────────────────
function StackRow({ frame, isActive, isNew, onClick, index, total }) {
  const s = TYPE_STYLES[frame.type] ?? TYPE_STYLES.local
  const isRSP = frame.type === 'rsp'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(frame.id)}
      onKeyDown={e => e.key === 'Enter' && onClick(frame.id)}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        border: `1px solid ${isActive ? s.border : '#2A1060'}`,
        borderRadius: '4px',
        background: isActive ? s.bg : '#0D0020',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        outline: 'none',
        boxShadow: isActive ? `0 0 14px ${s.glow}` : 'none',
        animation: isNew ? 'pushIn 0.35s ease' : 'none',
        borderLeft: `3px solid ${isActive ? s.border : '#2A1060'}`,
        position: 'relative',
      }}
    >
      {/* Address column */}
      <div style={{
        padding: '10px 12px',
        borderRight: '1px solid #1A0040',
        width: '168px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: isActive ? '#6060AA' : '#2A1060',
          letterSpacing: '0.05em',
          transition: 'color 0.18s ease',
        }}>
          {frame.address}
        </span>
      </div>

      {/* Label + value */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        minWidth: 0,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? s.text : '#6070A0',
          transition: 'all 0.18s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {frame.label}
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: isActive ? '#4A4080' : '#1E1040',
          transition: 'color 0.18s ease',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {frame.value}
        </span>
      </div>

      {/* RSP arrow indicator */}
      {isRSP && (
        <div style={{
          position: 'absolute',
          left: '-22px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '12px',
          color: '#00FFFF',
          textShadow: '0 0 8px #00FFFF',
        }}>
          →
        </div>
      )}
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ frame }) {
  const s = TYPE_STYLES[frame.type] ?? TYPE_STYLES.local
  return (
    <div style={{
      padding: '18px 20px',
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderLeft: `3px solid ${s.border}`,
      borderRadius: '6px',
      animation: 'fadeUp 0.18s ease',
      boxShadow: `0 0 16px ${s.glow}`,
    }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '9px',
        color: s.border,
        letterSpacing: '0.18em',
        marginBottom: '6px',
        opacity: 0.8,
      }}>
        {frame.address}  ·  {frame.type.toUpperCase()}
      </div>
      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: s.text,
        marginBottom: '10px',
      }}>
        {frame.label}
      </div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        color: '#4A4080',
        marginBottom: '12px',
        letterSpacing: '0.04em',
      }}>
        {frame.value}
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        lineHeight: '1.75',
        color: '#C8D4E8',
        margin: 0,
      }}>
        {frame.note}
      </p>
    </div>
  )
}

// ─── Stack Controls ───────────────────────────────────────────────────────────
function StackControls({ onPush, onPop, canPop, isAnimating }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginTop: '14px',
      paddingTop: '14px',
      borderTop: '1px solid #1A0040',
      flexWrap: 'wrap',
    }}>
      <button
        onClick={onPush}
        disabled={isAnimating}
        className="nb-btn-cyan"
        style={{
          fontSize: '12px',
          padding: '8px 16px',
          opacity: isAnimating ? 0.5 : 1,
        }}
      >
        ↓ PUSH (simulate call)
      </button>
      <button
        onClick={onPop}
        disabled={!canPop || isAnimating}
        className="nb-btn-ghost"
        style={{
          fontSize: '12px',
          padding: '8px 16px',
          opacity: !canPop || isAnimating ? 0.4 : 1,
        }}
      >
        ↑ POP (simulate return)
      </button>
    </div>
  )
}

// ─── Register Display ─────────────────────────────────────────────────────────
function RegisterDisplay({ rsp, rbp, rip }) {
  const regs = [
    { name: 'RIP', value: rip,  color: '#BF5FFF' },
    { name: 'RSP', value: rsp,  color: '#00FFFF' },
    { name: 'RBP', value: rbp,  color: '#00AACC' },
  ]
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '12px 14px',
      background: '#050010',
      border: '1px solid #1A0040',
      borderRadius: '6px',
      marginBottom: '14px',
    }}>
      {regs.map(r => (
        <div key={r.name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
        }}>
          <span style={{ color: '#4A20A0', letterSpacing: '0.1em' }}>{r.name}</span>
          <span style={{
            color: r.color,
            background: '#0D0020',
            border: `1px solid ${r.color}44`,
            borderRadius: '3px',
            padding: '2px 8px',
            fontSize: '10px',
            textShadow: `0 0 6px ${r.color}66`,
          }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { type: 'critical', label: 'Control Flow Critical' },
    { type: 'defense',  label: 'Defense Mechanism' },
    { type: 'buffer',   label: 'Vulnerable Buffer' },
    { type: 'frame',    label: 'Frame / Address Data' },
    { type: 'local',    label: 'Local Variables' },
    { type: 'kernel',   label: 'Kernel / Inaccessible' },
  ]
  return (
    <div style={{
      padding: '14px',
      background: '#050010',
      border: '1px solid #1A0040',
      borderRadius: '6px',
    }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '9px',
        color: '#4A20A0',
        letterSpacing: '0.18em',
        marginBottom: '10px',
      }}>
        LEGEND
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => {
          const s = TYPE_STYLES[item.type]
          return (
            <div key={item.type} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                width: '10px', height: '10px',
                borderRadius: '2px',
                background: s.border,
                boxShadow: `0 0 4px ${s.border}`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                color: s.text,
              }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Pushed frame templates ───────────────────────────────────────────────────
const PUSH_TEMPLATES = [
  { id: 'pushed_ret', label: 'Return Address (nested call)', address: 'RSP-8',  value: '0x00007fff…', type: 'critical' },
  { id: 'pushed_rbp', label: 'Saved RBP',                   address: 'RSP-16', value: 'prev RBP',    type: 'frame'    },
  { id: 'pushed_loc', label: 'Local var (new frame)',        address: 'RSP-24', value: '0x00000000',  type: 'local'    },
]

// ─── Main StackDiagram Component ──────────────────────────────────────────────
export default function StackDiagram({ moduleId = 1 }) {
  const config     = MODULE_STACKS[moduleId] ?? MODULE_STACKS[1]
  const baseFrames = config.frames

  const [activeId,    setActiveId]    = useState(baseFrames[0].id)
  const [pushed,      setPushed]      = useState([])
  const [pushCount,   setPushCount]   = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [rsp,         setRsp]         = useState('0x7FFFFFFFE440')
  const [rbp,         setRbp]         = useState('0x7FFFFFFFE4A0')
  const [rip,         setRip]         = useState('0x555555554A20')
  const stackRef = useRef(null)

  const allFrames  = [...pushed.slice().reverse(), ...baseFrames]
  const activeFrame = allFrames.find(f => f.id === activeId) ?? baseFrames[0]

  const handlePush = () => {
    if (isAnimating || pushCount >= PUSH_TEMPLATES.length) return
    setIsAnimating(true)
    const template = { ...PUSH_TEMPLATES[pushCount], isNew: true }
    setPushed(prev => [...prev, template])
    setPushCount(c => c + 1)
    setRsp(r => {
      const base = parseInt(r, 16)
      return '0x' + (base - 8).toString(16).toUpperCase()
    })
    setRip('0x' + (Math.floor(Math.random() * 0x00FFFFFF) + 0x555555400000).toString(16).toUpperCase())
    setActiveId(template.id)
    setTimeout(() => {
      setIsAnimating(false)
      setPushed(prev => prev.map(f => ({ ...f, isNew: false })))
    }, 380)
    if (stackRef.current) {
      stackRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePop = () => {
    if (isAnimating || pushed.length === 0) return
    setIsAnimating(true)
    const removed = pushed[pushed.length - 1]
    setPushed(prev => prev.slice(0, -1))
    setPushCount(c => c - 1)
    setRsp(r => {
      const base = parseInt(r, 16)
      return '0x' + (base + 8).toString(16).toUpperCase()
    })
    setActiveId(baseFrames[0].id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div style={{
      background: '#0D0020',
      border: '1px solid #2A1060',
      borderRadius: '10px',
      padding: '24px',
      animation: 'fadeUp 0.25s ease',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '9px',
          color: '#4A20A0',
          letterSpacing: '0.2em',
          marginBottom: '6px',
        }}>
          PRACTICAL LAB  ·  INTERACTIVE STACK DIAGRAM
        </div>
        <h3 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '20px',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '4px',
        }}>
          {config.title}
        </h3>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: '#6040C0',
        }}>
          {config.subtitle}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#6070A0',
          marginTop: '8px',
          lineHeight: 1.6,
        }}>
          {config.scenario}
        </p>
      </div>

      {/* Register display */}
      <RegisterDisplay rsp={rsp} rbp={rbp} rip={rip} />

      {/* Two-column layout */}
      <div style={{
        display: 'flex',
        gap: '18px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Left — Stack rows */}
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          {/* HIGH address label */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '4px',
          }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px',
              color: '#2A1060',
              letterSpacing: '0.12em',
            }}>
              HIGH ADDRESS ↑
            </span>
          </div>

          {/* Stack rows */}
          <div
            ref={stackRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              maxHeight: '420px',
              overflowY: 'auto',
              paddingLeft: '24px',
            }}
          >
            {allFrames.map((frame, i) => (
              <StackRow
                key={frame.id}
                frame={frame}
                isActive={activeId === frame.id}
                isNew={frame.isNew ?? false}
                onClick={setActiveId}
                index={i}
                total={allFrames.length}
              />
            ))}
          </div>

          {/* LOW address label */}
          <div style={{ marginTop: '4px' }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px',
              color: '#2A1060',
              letterSpacing: '0.12em',
            }}>
              LOW ADDRESS ↓  (RSP grows this way)
            </span>
          </div>

          {/* Controls */}
          {moduleId === 1 && (
            <StackControls
              onPush={handlePush}
              onPop={handlePop}
              canPop={pushed.length > 0}
              isAnimating={isAnimating}
            />
          )}
        </div>

        {/* Right — Detail + Legend */}
        <div style={{
          width: '260px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <DetailPanel frame={activeFrame} />
          <Legend />
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pushIn {
          from { opacity: 0; transform: translateY(-12px) scaleY(0.85); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
