import { useState } from 'react'
import './CodeViewer.css'

const LANG_MAP = {
  js: 'JavaScript', jsx: 'React JSX', ts: 'TypeScript', tsx: 'React TSX',
  py: 'Python', java: 'Java', c: 'C', cpp: 'C++', html: 'HTML', css: 'CSS',
  json: 'JSON', md: 'Markdown', go: 'Go', rs: 'Rust', php: 'PHP',
  rb: 'Ruby', swift: 'Swift', kt: 'Kotlin', txt: 'Text',
}

function CodeViewer({ fileName, content, size, history, showLineNumbers = true }) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const ext = fileName?.split('.').pop()?.toLowerCase() || ''
  const lang = LANG_MAP[ext] || ext.toUpperCase() || 'Code'
  const lines = content?.split('\n') || []
  const lineCount = lines.length

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="cv-container">
      <div className="cv-header">
        <div className="cv-header-left">
          <span className="cv-lang-badge">{lang}</span>
          <span className="cv-filename">{fileName}</span>
          <span className="cv-meta">{lineCount}줄 {formatSize(size) && `· ${formatSize(size)}`}</span>
        </div>
        <div className="cv-header-right">
          <button className="cv-btn" onClick={handleCopy}>
            {copied ? '복사됨!' : '복사'}
          </button>
          <button className="cv-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '펼치기' : '접기'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="cv-code-area">
          {showLineNumbers && (
            <div className="cv-line-numbers">
              {lines.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          )}
          <pre className="cv-code"><code>{content}</code></pre>
        </div>
      )}

      {history && history.length > 0 && (
        <div className="cv-footer">
          {history.map((h, i) => (
            <span key={i} className="cv-history-tag">
              {h.action} · {formatDate(h.date)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default CodeViewer
