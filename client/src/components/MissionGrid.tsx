import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

// ─── MISSION DATA ─────────────────────────────────────────────────────────────
const MISSIONS = [
  // HUSTLE
  {
    id: 'm1', category: 'HUSTLE', icon: '💰', difficulty: 2,
    name: 'First Dollar Online',
    desc: 'Generate your first dollar of online income through any legitimate means.',
    xp: 500, pp: 50, empire: false,
  },
  {
    id: 'm2', category: 'HUSTLE', icon: '📊', difficulty: 3,
    name: 'Income Stream Activated',
    desc: 'Build a recurring income source that generates revenue without your direct time.',
    xp: 1200, pp: 120, empire: false,
  },
  {
    id: 'm3', category: 'HUSTLE', icon: '🏢', difficulty: 5,
    name: 'Empire Foundation',
    desc: 'Register your business entity and open a dedicated business bank account.',
    xp: 2000, pp: 200, empire: true,
  },
  // LEGACY
  {
    id: 'm4', category: 'LEGACY', icon: '📚', difficulty: 1,
    name: 'Knowledge Seeker',
    desc: 'Complete 30 consecutive days of reading or learning something new.',
    xp: 300, pp: 30, empire: false,
  },
  {
    id: 'm5', category: 'LEGACY', icon: '🎯', difficulty: 3,
    name: 'Vision Board Activated',
    desc: 'Create and document your 5-year vision with specific measurable goals.',
    xp: 800, pp: 80, empire: false,
  },
  {
    id: 'm6', category: 'LEGACY', icon: '👑', difficulty: 4,
    name: 'Generational Wealth Move',
    desc: 'Make your first investment in assets that will outlast you — stocks, real estate, or business equity.',
    xp: 1500, pp: 150, empire: true,
  },
  // BEAST
  {
    id: 'm7', category: 'BEAST', icon: '💪', difficulty: 2,
    name: '30-Day Physical Trial',
    desc: 'Complete 30 days of consistent physical training without missing a single session.',
    xp: 600, pp: 60, empire: false,
  },
  {
    id: 'm8', category: 'BEAST', icon: '🧠', difficulty: 3,
    name: 'Mental Fortress',
    desc: 'Establish a daily meditation or mindfulness practice for 21 consecutive days.',
    xp: 700, pp: 70, empire: false,
  },
  {
    id: 'm9', category: 'BEAST', icon: '🔥', difficulty: 5,
    name: 'Beast Mode Unlocked',
    desc: 'Complete a 90-day physical, mental, and spiritual transformation challenge simultaneously.',
    xp: 3000, pp: 300, empire: true,
  },
  // FAITH
  {
    id: 'm10', category: 'FAITH', icon: '🙏', difficulty: 1,
    name: 'Daily Connection',
    desc: 'Establish a daily prayer or spiritual practice for 21 consecutive days.',
    xp: 400, pp: 40, empire: false,
  },
  {
    id: 'm11', category: 'FAITH', icon: '✨', difficulty: 2,
    name: 'Gratitude Practice',
    desc: 'Write 3 genuine gratitude entries every day for 30 days.',
    xp: 500, pp: 50, empire: false,
  },
  {
    id: 'm12', category: 'FAITH', icon: '🌟', difficulty: 4,
    name: 'Purpose Alignment',
    desc: 'Identify your divine purpose and align your daily actions with it for 60 days.',
    xp: 1800, pp: 180, empire: true,
  },
]

const CATEGORIES = ['ALL', 'HUSTLE', 'LEGACY', 'BEAST', 'FAITH', 'EMPIRE']

const catColors: Record<string, string> = {
  HUSTLE: '#ffd600',
  LEGACY: '#00e5a0',
  BEAST: '#ff3d00',
  FAITH: '#dd00ff',
  EMPIRE: '#ffd600',
}

// ─── EVIDENCE MODAL ───────────────────────────────────────────────────────────
function EvidenceModal({
  mission,
  onClose,
  onSubmit,
}: {
  mission: typeof MISSIONS[0]
  onClose: () => void
  onSubmit: (id: string, note: string) => void
}) {
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(8,0,25,0.98), rgba(2,0,15,0.98))',
          border: '1px solid rgba(0,229,160,0.3)',
          borderRadius: 24,
          padding: 30,
          maxWidth: 520,
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 80px rgba(0,229,160,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Cinzel Decorative', cursive", fontSize: '0.95em', letterSpacing: 2, color: '#00e5a0', marginBottom: 4 }}>
              SUBMIT EVIDENCE
            </div>
            <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.5)', fontFamily: "'Share Tech Mono', monospace" }}>
              {mission.name}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#00e5a0' : 'rgba(0,229,160,0.3)'}`,
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            background: dragging ? 'rgba(0,229,160,0.05)' : 'rgba(0,229,160,0.02)',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: '3em', marginBottom: 10 }}>
            <ImageIcon size={48} style={{ margin: '0 auto', color: '#00e5a0', opacity: 0.6 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9em' }}>
            Drop your proof here or click to upload
          </p>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75em', marginTop: 6, color: 'rgba(255,255,255,0.3)' }}>
            JPG, PNG, GIF up to 16MB
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* Preview */}
        {preview && (
          <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 250, objectFit: 'contain', background: '#000' }} />
          </div>
        )}

        {/* Note */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe your achievement... what did you do, how did it feel, what did you learn?"
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(0,229,160,0.2)',
            borderRadius: 10,
            padding: 12,
            color: 'rgba(255,255,255,0.92)',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.95em',
            resize: 'vertical',
            minHeight: 80,
            outline: 'none',
            marginBottom: 16,
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onSubmit(mission.id, note)}
            style={{
              flex: 1,
              padding: 14,
              background: 'linear-gradient(135deg, #00e5a0, #0077ff)',
              border: 'none',
              borderRadius: 12,
              color: '#000',
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '0.8em',
              letterSpacing: 2,
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'all 0.3s',
            }}
          >
            COMPLETE MISSION
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Rajdhani', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MISSION CARD ─────────────────────────────────────────────────────────────
function MissionCard({
  mission,
  done,
  onClick,
}: {
  mission: typeof MISSIONS[0]
  done: boolean
  onClick: () => void
}) {
  const catColor = catColors[mission.category] || '#00e5a0'

  return (
    <div
      onClick={done ? undefined : onClick}
      style={{
        background: done ? 'rgba(255,214,0,0.04)' : 'rgba(5,0,20,0.75)',
        border: `1px solid ${done ? 'rgba(255,214,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        padding: 20,
        cursor: done ? 'default' : 'pointer',
        transition: 'all 0.25s',
        position: 'relative',
        overflow: 'hidden',
        opacity: done ? 0.7 : 1,
      }}
      onMouseEnter={e => {
        if (!done) {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(0,229,160,0.4)'
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,160,0.1)'
        }
      }}
      onMouseLeave={e => {
        if (!done) {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }
      }}
    >
      {/* Complete badge */}
      {done && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7em',
            color: '#ffd600',
            background: 'rgba(255,214,0,0.1)',
            border: '1px solid rgba(255,214,0,0.4)',
            borderRadius: 20,
            padding: '2px 10px',
          }}
        >
          ✓ COMPLETE
        </div>
      )}

      {/* Empire badge */}
      {mission.empire && (
        <div
          style={{
            display: 'inline-block',
            marginBottom: 8,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.68em',
            letterSpacing: 2,
            color: '#ffd600',
            background: 'rgba(255,214,0,0.08)',
            border: '1px solid rgba(255,214,0,0.25)',
            borderRadius: 20,
            padding: '2px 10px',
          }}
        >
          EMPIRE MOVE
        </div>
      )}

      {/* Category */}
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7em', letterSpacing: 2, color: catColor, marginBottom: 8 }}>
        {mission.category}
      </div>

      {/* Icon */}
      <div style={{ fontSize: '2em', marginBottom: 8 }}>{mission.icon}</div>

      {/* Name */}
      <div style={{ fontFamily: "'Cinzel Decorative', cursive", fontSize: '0.8em', letterSpacing: 1, color: 'rgba(255,255,255,0.92)', marginBottom: 8 }}>
        {mission.name}
      </div>

      {/* Desc */}
      <div style={{ fontSize: '0.88em', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 14 }}>
        {mission.desc}
      </div>

      {/* Rewards */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75em', padding: '3px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,229,160,0.3)', color: '#00e5a0' }}>
          +{mission.xp} XP
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75em', padding: '3px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,214,0,0.3)', color: '#ffd600' }}>
          +{mission.pp} PP
        </span>
      </div>

      {/* Difficulty dots */}
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(d => (
          <div
            key={d}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: d <= mission.difficulty ? '#ff3d00' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── MISSION GRID ─────────────────────────────────────────────────────────────
export default function MissionGrid() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [evidenceMission, setEvidenceMission] = useState<typeof MISSIONS[0] | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = MISSIONS.filter(m => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'EMPIRE') return m.empire
    return m.category === activeFilter
  })

  const handleSubmit = (id: string, note: string) => {
    setCompletedIds(prev => { const next = new Set(prev); next.add(id); return next; })
    setEvidenceMission(null)
    showToast('Mission complete! XP and Power Points awarded.')
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,229,160,0.15)',
            border: '1px solid rgba(0,229,160,0.4)',
            borderRadius: 12,
            padding: '12px 24px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.9em',
            color: '#00e5a0',
            zIndex: 200,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 30px rgba(0,229,160,0.2)',
          }}
        >
          ✓ {toast}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(cat => {
          const isActive = activeFilter === cat
          const isEmpire = cat === 'EMPIRE'
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '6px 14px',
                background: isActive
                  ? isEmpire ? 'rgba(255,214,0,0.08)' : 'rgba(0,229,160,0.1)'
                  : 'rgba(0,0,0,0.5)',
                border: `1px solid ${isActive
                  ? isEmpire ? '#ffd600' : '#00e5a0'
                  : isEmpire ? 'rgba(255,214,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                color: isActive
                  ? isEmpire ? '#ffd600' : '#00e5a0'
                  : isEmpire ? 'rgba(255,214,0,0.7)' : 'rgba(255,255,255,0.5)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.85em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Mission grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            done={completedIds.has(mission.id)}
            onClick={() => setEvidenceMission(mission)}
          />
        ))}
      </div>

      {/* Evidence modal */}
      {evidenceMission && (
        <EvidenceModal
          mission={evidenceMission}
          onClose={() => setEvidenceMission(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
