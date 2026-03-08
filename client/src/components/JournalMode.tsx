import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Plus, Download } from 'lucide-react'

interface JournalEntry {
  date: string
  title: string
  content: string
  evidence: string[]
  pmReport: string
  closingLog: string
}

export default function JournalMode() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    pmReport: '',
    closingLog: '',
  })

  const handleCreateEntry = () => {
    const entry: JournalEntry = {
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title || `Entry - ${new Date().toLocaleDateString()}`,
      content: newEntry.content,
      evidence: [],
      pmReport: newEntry.pmReport,
      closingLog: newEntry.closingLog,
    }
    setEntries([entry, ...entries])
    setNewEntry({ title: '', content: '', pmReport: '', closingLog: '' })
    setShowNewEntry(false)
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `journal-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">JOURNAL & LOGS</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="bg-primary text-black hover:bg-primary/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="glass-panel p-6 border-primary/30">
          <h3 className="text-lg font-bold text-primary mb-4">CREATE NEW ENTRY</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="Entry title..."
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Daily Log</label>
              <Textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="What happened today? What did you learn?"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">PM Report</label>
              <Textarea
                value={newEntry.pmReport}
                onChange={(e) => setNewEntry({ ...newEntry, pmReport: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="End of day summary and reflections..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Closing Log</label>
              <Textarea
                value={newEntry.closingLog}
                onChange={(e) => setNewEntry({ ...newEntry, closingLog: e.target.value })}
                className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-1"
                placeholder="Final thoughts for AI grounding..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowNewEntry(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEntry}
                className="bg-primary text-black hover:bg-primary/90"
              >
                Save Entry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Selected Entry Detail */}
      {selectedEntry && (
        <Card className="glass-panel p-6 border-secondary/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-muted-foreground">{selectedEntry.date}</p>
              <h3 className="text-2xl font-bold text-secondary">{selectedEntry.title}</h3>
            </div>
            <Button
              onClick={() => setSelectedEntry(null)}
              variant="outline"
              className="text-xs"
            >
              Close
            </Button>
          </div>

          <div className="space-y-4">
            {selectedEntry.content && (
              <div>
                <h4 className="text-sm font-bold text-primary mb-2">DAILY LOG</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>
            )}

            {selectedEntry.pmReport && (
              <div>
                <h4 className="text-sm font-bold text-secondary mb-2">PM REPORT</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">{selectedEntry.pmReport}</p>
              </div>
            )}

            {selectedEntry.closingLog && (
              <div>
                <h4 className="text-sm font-bold text-accent mb-2">CLOSING LOG</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">{selectedEntry.closingLog}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary uppercase">RECENT ENTRIES ({entries.length})</h3>
        {entries.length === 0 ? (
          <Card className="glass-panel p-6 text-center border-muted/20">
            <p className="text-muted-foreground">No entries yet. Create your first entry!</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {entries.map((entry, idx) => (
              <Card
                key={idx}
                onClick={() => setSelectedEntry(entry)}
                className="glass-panel p-4 border-muted/20 cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    <p className="font-bold text-foreground">{entry.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{entry.content}</p>
                  </div>
                  <div className="text-right">
                    {entry.evidence.length > 0 && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {entry.evidence.length} evidence
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
