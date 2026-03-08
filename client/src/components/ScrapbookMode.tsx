import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Plus, Trash2 } from 'lucide-react'

interface ScrapbookItem {
  id: string
  date: string
  title: string
  imageUrl: string
  tags: string[]
  description: string
}

export default function ScrapbookMode() {
  const [items, setItems] = useState<ScrapbookItem[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ScrapbookItem | null>(null)
  const [newItem, setNewItem] = useState({
    title: '',
    imageUrl: '',
    tags: '',
    description: '',
  })

  const handleAddItem = () => {
    if (!newItem.imageUrl) return

    const item: ScrapbookItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newItem.title || 'Untitled Memory',
      imageUrl: newItem.imageUrl,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: newItem.description,
    }
    setItems([item, ...items])
    setNewItem({ title: '', imageUrl: '', tags: '', description: '' })
    setShowUpload(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    if (selectedItem?.id === id) setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">SCRAPBOOK & MEMORIES</h2>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-primary text-black hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </Button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <Card className="glass-panel p-6 border-primary/30">
          <h3 className="text-lg font-bold text-primary mb-4">ADD NEW MEMORY</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="Memory title..."
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Image URL</label>
              <input
                type="text"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="achievement, milestone, evidence"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="What does this memory represent?"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowUpload(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                className="bg-primary text-black hover:bg-primary/90"
              >
                Save Memory
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Selected Item Detail */}
      {selectedItem && (
        <Card className="glass-panel p-6 border-secondary/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-muted-foreground">{selectedItem.date}</p>
              <h3 className="text-2xl font-bold text-secondary">{selectedItem.title}</h3>
            </div>
            <Button
              onClick={() => setSelectedItem(null)}
              variant="outline"
              className="text-xs"
            >
              Close
            </Button>
          </div>

          <div className="space-y-4">
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />

            {selectedItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {selectedItem.description && (
              <p className="text-sm text-foreground">{selectedItem.description}</p>
            )}
          </div>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary uppercase">MEMORIES ({items.length})</h3>
        {items.length === 0 ? (
          <Card className="glass-panel p-12 text-center border-muted/20">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No memories yet. Add your first one!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="glass-panel overflow-hidden rounded-lg aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                  <p className="text-sm font-bold text-white text-center px-2">{item.title}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteItem(item.id)
                    }}
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>

                {/* Date Badge */}
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-primary">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
