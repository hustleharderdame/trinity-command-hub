import { useState, useRef } from 'react'
import { Upload, Trash2, Edit3, Check, X } from 'lucide-react'

interface ScrapbookItem {
  id: string
  name: string
  category: 'memories' | 'important' | 'finances'
  type: 'image' | 'document' | 'video'
  url: string
  uploadedAt: Date
  caption: string
  tag: string
  layout: 'polaroid' | 'stamp' | 'torn' | 'vintage' | 'neon'
}

const LAYOUTS = ['polaroid', 'stamp', 'torn', 'vintage', 'neon'] as const
const TAGS = ['WIN', 'MEMORY', 'PROOF', 'MILESTONE', 'HUSTLE', 'LEGACY', 'GROWTH', 'FAITH']

const CATEGORY_CONFIG = {
  memories: {
    label: 'MEMORIES',
    emoji: '📸',
    color: '#ff6b9d',
    glow: 'rgba(255,107,157,0.4)',
    bg: 'rgba(255,107,157,0.08)',
    border: 'rgba(255,107,157,0.4)',
    description: 'Moments that shaped the journey',
    pageColor: '#1a0a10',
    inkColor: '#ff6b9d',
    stampColor: '#cc3366',
  },
  important: {
    label: 'IMPORTANT',
    emoji: '⭐',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.4)',
    bg: 'rgba(255,215,0,0.08)',
    border: 'rgba(255,215,0,0.4)',
    description: 'Critical documents and records',
    pageColor: '#0f0d00',
    inkColor: '#ffd700',
    stampColor: '#cc9900',
  },
  finances: {
    label: 'FINANCES',
    emoji: '💰',
    color: '#00ff96',
    glow: 'rgba(0,255,150,0.4)',
    bg: 'rgba(0,255,150,0.08)',
    border: 'rgba(0,255,150,0.4)',
    description: 'Money moves and financial proof',
    pageColor: '#001a0a',
    inkColor: '#00ff96',
    stampColor: '#009944',
  },
}

function MemoryPage({ item, config, onDelete, onEdit }: {
  item: ScrapbookItem
  config: typeof CATEGORY_CONFIG['memories']
  onDelete: (id: string) => void
  onEdit: (id: string, caption: string, tag: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editCaption, setEditCaption] = useState(item.caption)
  const [editTag, setEditTag] = useState(item.tag)

  const saveEdit = () => {
    onEdit(item.id, editCaption, editTag)
    setEditing(false)
  }

  const renderLayout = () => {
    switch (item.layout) {
      case 'polaroid':
        return (
          <div
            className="relative p-3 pb-10 shadow-2xl"
            style={{
              background: '#f5f0e8',
              transform: `rotate(${(parseInt(item.id) % 3 - 1) * 2}deg)`,
              boxShadow: `4px 4px 20px rgba(0,0,0,0.5), 0 0 30px ${config.glow}`,
            }}
          >
            {/* Photo area */}
            <div className="w-full aspect-square bg-gray-200 overflow-hidden mb-2">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-4xl">📄</span>
                </div>
              )}
            </div>
            {/* Polaroid caption */}
            <div
              className="text-center text-xs"
              style={{ fontFamily: 'Georgia, serif', color: '#333', fontStyle: 'italic' }}
            >
              {item.caption || item.name}
            </div>
            {/* Date stamp */}
            <div className="absolute bottom-1 right-2 text-xs" style={{ color: '#999', fontFamily: 'Courier New, monospace' }}>
              {item.uploadedAt.toLocaleDateString()}
            </div>
          </div>
        )

      case 'stamp':
        return (
          <div
            className="relative p-2 border-8"
            style={{
              borderColor: config.stampColor,
              borderStyle: 'solid',
              background: '#f8f4e8',
              boxShadow: `0 0 0 2px ${config.stampColor}, 4px 4px 15px rgba(0,0,0,0.4), 0 0 20px ${config.glow}`,
            }}
          >
            {/* Perforated edge effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, transparent 4px, ${config.stampColor} 4px, ${config.stampColor} 5px, transparent 5px)`,
                backgroundSize: '12px 12px',
                backgroundPosition: '-6px -6px',
                opacity: 0.3,
              }}
            />
            <div className="w-full aspect-square overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span className="text-4xl">📄</span>
                </div>
              )}
            </div>
            <div
              className="text-center mt-1 text-xs font-bold uppercase tracking-widest"
              style={{ color: config.stampColor, fontFamily: 'Courier New, monospace' }}
            >
              {item.tag || 'LEGACY'}
            </div>
          </div>
        )

      case 'vintage':
        return (
          <div
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)',
              border: `2px solid ${config.inkColor}40`,
              boxShadow: `0 0 30px ${config.glow}, inset 0 0 30px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Corner ornaments */}
            <div className="absolute top-1 left-1 text-xs" style={{ color: config.inkColor, opacity: 0.6 }}>✦</div>
            <div className="absolute top-1 right-1 text-xs" style={{ color: config.inkColor, opacity: 0.6 }}>✦</div>
            <div className="absolute bottom-1 left-1 text-xs" style={{ color: config.inkColor, opacity: 0.6 }}>✦</div>
            <div className="absolute bottom-1 right-1 text-xs" style={{ color: config.inkColor, opacity: 0.6 }}>✦</div>

            {/* Decorative border */}
            <div
              className="absolute inset-2 border pointer-events-none"
              style={{ borderColor: `${config.inkColor}30` }}
            />

            <div className="p-4">
              <div className="w-full aspect-square overflow-hidden mb-2">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" style={{ filter: 'sepia(30%) contrast(1.1)' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
              </div>
              <div
                className="text-center text-xs italic"
                style={{ color: config.inkColor, fontFamily: 'Georgia, serif' }}
              >
                {item.caption || item.name}
              </div>
            </div>
          </div>
        )

      case 'neon':
        return (
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              background: 'rgba(0,0,0,0.9)',
              border: `2px solid ${config.color}`,
              boxShadow: `0 0 20px ${config.glow}, inset 0 0 20px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Neon corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: config.color }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: config.color }} />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: config.color }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: config.color }} />

            <div className="p-3">
              <div className="w-full aspect-square overflow-hidden mb-2">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
              </div>
              <div
                className="text-center text-xs font-bold uppercase tracking-wider"
                style={{
                  color: config.color,
                  textShadow: `0 0 8px ${config.glow}`,
                  fontFamily: 'Courier New, monospace',
                }}
              >
                {item.tag || 'LEGACY'}
              </div>
            </div>
          </div>
        )

      default: // torn
        return (
          <div
            className="relative"
            style={{
              background: '#f5f0e8',
              clipPath: 'polygon(0 0, 100% 2%, 98% 100%, 2% 98%)',
              boxShadow: `3px 3px 15px rgba(0,0,0,0.4), 0 0 20px ${config.glow}`,
            }}
          >
            <div className="p-3">
              <div className="w-full aspect-square overflow-hidden mb-2">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
              </div>
              <div
                className="text-xs italic text-center"
                style={{ color: '#555', fontFamily: 'Georgia, serif' }}
              >
                {item.caption || item.name}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative group">
      {/* Memory page */}
      {renderLayout()}

      {/* Edit overlay */}
      {editing ? (
        <div
          className="absolute inset-0 flex flex-col p-3 rounded-lg z-10"
          style={{ background: 'rgba(0,0,0,0.95)', border: `1px solid ${config.color}` }}
        >
          <div className="text-xs font-mono text-gray-400 mb-2">EDIT MEMORY</div>
          <input
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Add a caption..."
            className="text-xs p-2 rounded mb-2 outline-none"
            style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${config.border}`, color: '#fff' }}
          />
          <div className="flex flex-wrap gap-1 mb-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setEditTag(tag)}
                className="text-xs px-2 py-0.5 rounded transition-all"
                style={{
                  background: editTag === tag ? config.bg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${editTag === tag ? config.color : 'rgba(255,255,255,0.1)'}`,
                  color: editTag === tag ? config.color : '#888',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-auto">
            <button onClick={saveEdit} className="flex-1 py-1 rounded text-xs font-bold" style={{ background: config.bg, border: `1px solid ${config.color}`, color: config.color }}>
              <Check className="w-3 h-3 inline mr-1" />SAVE
            </button>
            <button onClick={() => setEditing(false)} className="py-1 px-2 rounded text-xs border border-gray-600 text-gray-400">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <button
            onClick={() => setEditing(true)}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.8)', border: `1px solid ${config.color}` }}
          >
            <Edit3 className="w-3 h-3" style={{ color: config.color }} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,50,50,0.5)' }}
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function ScrapbookMode() {
  const [items, setItems] = useState<ScrapbookItem[]>([])
  const [activeCategory, setActiveCategory] = useState<'memories' | 'important' | 'finances'>('memories')
  const [dragActive, setDragActive] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState<ScrapbookItem['layout']>('polaroid')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = CATEGORY_CONFIG[activeCategory]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
  }

  const handleFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        const newItem: ScrapbookItem = {
          id: Date.now().toString() + i,
          name: file.name.replace(/\.[^.]+$/, ''),
          category: activeCategory,
          type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
          url: e.target?.result as string,
          uploadedAt: new Date(),
          caption: '',
          tag: TAGS[Math.floor(Math.random() * TAGS.length)],
          layout: selectedLayout,
        }
        setItems((prev) => [newItem, ...prev])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleEdit = (id: string, caption: string, tag: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, caption, tag } : item))
  }

  const filteredItems = items.filter((item) => item.category === activeCategory)

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(180deg, ${config.pageColor} 0%, #000 100%)` }}
    >
      {/* ─── Header ─── */}
      <div
        className="border-b px-4 py-4"
        style={{ borderColor: `${config.border}`, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-mono tracking-widest mb-0.5" style={{ color: `${config.color}80` }}>
                MEMORY VAULT
              </div>
              <h1
                className="text-xl font-black"
                style={{ color: config.color, textShadow: `0 0 15px ${config.glow}` }}
              >
                THE LEGACY SCRAPBOOK
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-gray-500">ITEMS</div>
              <div className="text-lg font-bold" style={{ color: config.color }}>{filteredItems.length}</div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2">
            {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
              const c = CATEGORY_CONFIG[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-mono transition-all"
                  style={{
                    borderColor: activeCategory === cat ? c.color : 'rgba(100,100,100,0.3)',
                    background: activeCategory === cat ? c.bg : 'transparent',
                    color: activeCategory === cat ? c.color : '#666',
                    boxShadow: activeCategory === cat ? `0 0 10px ${c.glow}` : 'none',
                  }}
                >
                  <span>{c.emoji}</span>
                  <span className="hidden sm:inline">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Layout selector */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs font-mono text-gray-500">PAGE STYLE:</span>
          {LAYOUTS.map((layout) => (
            <button
              key={layout}
              onClick={() => setSelectedLayout(layout)}
              className="text-xs font-mono px-2 py-1 rounded border transition-all capitalize"
              style={{
                borderColor: selectedLayout === layout ? config.color : 'rgba(100,100,100,0.3)',
                background: selectedLayout === layout ? config.bg : 'transparent',
                color: selectedLayout === layout ? config.color : '#666',
              }}
            >
              {layout}
            </button>
          ))}
        </div>

        {/* Upload area */}
        <div
          className="relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer mb-6 transition-all"
          style={{
            borderColor: dragActive ? config.color : `${config.border}`,
            background: dragActive ? config.bg : 'rgba(0,0,0,0.3)',
            boxShadow: dragActive ? `0 0 30px ${config.glow}` : 'none',
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: config.color, opacity: 0.7 }} />
          <p className="font-bold text-sm mb-1" style={{ color: config.color }}>
            Drop files here or click to upload
          </p>
          <p className="text-xs text-gray-500">
            {config.description} · Images, documents, anything
          </p>
          <p className="text-xs mt-2 font-mono" style={{ color: `${config.color}60` }}>
            Will be styled as: <span className="uppercase font-bold">{selectedLayout}</span>
          </p>
        </div>

        {/* Items grid */}
        {filteredItems.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{ borderColor: `${config.border}`, background: 'rgba(0,0,0,0.3)' }}
          >
            <div className="text-4xl mb-3">{config.emoji}</div>
            <p className="text-sm font-bold mb-1" style={{ color: config.color }}>
              No {config.label.toLowerCase()} yet
            </p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        ) : (
          <div>
            {/* HLB Page header */}
            <div
              className="border-b mb-6 pb-3 flex items-center justify-between"
              style={{ borderColor: `${config.border}` }}
            >
              <div>
                <div
                  className="text-lg font-black uppercase tracking-widest"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    color: config.color,
                    textShadow: `0 0 10px ${config.glow}`,
                  }}
                >
                  {config.emoji} {config.label}
                </div>
                <div className="text-xs font-mono text-gray-500">{config.description}</div>
              </div>
              <div
                className="text-xs font-mono px-3 py-1 rounded-full"
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  color: config.color,
                }}
              >
                {filteredItems.length} PAGES
              </div>
            </div>

            {/* Memory pages grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="break-inside-avoid mb-4">
                  <MemoryPage
                    item={item}
                    config={config}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
