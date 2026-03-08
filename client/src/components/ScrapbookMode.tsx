import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Trash2, FileText } from 'lucide-react'

interface ScrapbookItem {
  id: string
  name: string
  category: 'memories' | 'important' | 'finances'
  type: 'image' | 'document' | 'video'
  url: string
  uploadedAt: Date
  description?: string
}

export default function ScrapbookMode() {
  const [items, setItems] = useState<ScrapbookItem[]>([])
  const [activeCategory, setActiveCategory] = useState<'memories' | 'important' | 'finances'>('memories')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFiles(files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = (e) => {
        const newItem: ScrapbookItem = {
          id: Date.now().toString() + i,
          name: file.name,
          category: activeCategory,
          type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
          url: e.target?.result as string,
          uploadedAt: new Date(),
          description: '',
        }
        setItems((prev) => [newItem, ...prev])
      }

      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => item.category === activeCategory)

  const categoryIcons = {
    memories: '📸',
    important: '⭐',
    finances: '💰',
  }

  const categoryBorders = {
    memories: 'border-pink-500/50',
    important: 'border-cyan-500/50',
    finances: 'border-green-500/50',
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category selector */}
      <div className="flex gap-2 flex-wrap">
        {(['memories', 'important', 'finances'] as const).map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm sm:text-base ${
              activeCategory === cat
                ? `bg-${cat === 'memories' ? 'pink' : cat === 'important' ? 'cyan' : 'green'}-600/30 border-${cat === 'memories' ? 'pink' : cat === 'important' ? 'cyan' : 'green'}-500 text-${cat === 'memories' ? 'pink' : cat === 'important' ? 'cyan' : 'green'}-400`
                : 'bg-black/50 border-gray-600 text-gray-400'
            } border rounded-lg py-2 px-3 sm:px-4 transition-all`}
          >
            {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Upload area */}
      <Card
        className={`glass-panel p-6 sm:p-8 border-2 border-dashed transition-all cursor-pointer ${
          dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 mb-2 sm:mb-4" />
          <p className="text-cyan-400 font-bold text-sm sm:text-base text-center">
            Drag files here or click to upload
          </p>
          <p className="text-cyan-600/50 text-xs sm:text-sm text-center mt-1">
            Images, videos, documents - anything you want to save
          </p>
          <input
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </label>
      </Card>

      {/* Items grid */}
      <div>
        <h3 className="text-sm font-bold text-cyan-400 uppercase mb-3 sm:mb-4">
          {categoryIcons[activeCategory]} {activeCategory} ({filteredItems.length})
        </h3>

        {filteredItems.length === 0 ? (
          <Card className="glass-panel p-6 sm:p-8 text-center border-cyan-500/30">
            <p className="text-gray-400 text-sm sm:text-base">No items in this category yet. Upload something!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`glass-panel p-2 sm:p-3 border ${categoryBorders[activeCategory]} overflow-hidden group`}
              >
                {/* Thumbnail */}
                <div className="relative mb-2 sm:mb-3 bg-black/50 rounded aspect-square flex items-center justify-center overflow-hidden">
                  {item.type === 'image' && (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  )}
                  {item.type === 'video' && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-1" />
                      <p className="text-xs text-cyan-400">VIDEO</p>
                    </div>
                  )}
                  {item.type === 'document' && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-1" />
                      <p className="text-xs text-cyan-400">DOC</p>
                    </div>
                  )}

                  {/* Delete button */}
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/30 border border-red-500/50 text-red-400 hover:bg-red-600/50 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Info */}
                <p className="text-xs sm:text-sm font-bold truncate">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.uploadedAt.toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
