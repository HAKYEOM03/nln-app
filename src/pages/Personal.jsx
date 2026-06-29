import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCodeFiles, saveCodeFile } from '../utils/db'
import CodeViewer from '../components/CodeViewer'
import './Personal.css'

function Personal() {
  const { user } = useAuth()
  const [files, setFiles] = useState(() => getCodeFiles(user.id))
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    const reader = new FileReader()
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
      }
    }
    reader.onload = () => {
      const interval = setInterval(() => {
        setUploadProgress((p) => {
          if (p >= 100) {
            clearInterval(interval)
            const saved = saveCodeFile({
              userId: user.id,
              userName: user.name,
              fileName: file.name,
              content: reader.result,
              size: file.size,
              type: file.type || 'text/plain',
            })
            setFiles(getCodeFiles(user.id))
            setSelectedFile(saved)
            setUploading(false)
            return 100
          }
          return p + 5
        })
      }, 50)
    }
    reader.readAsText(file)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div className="personal-page">
      <div className="personal-header">
        <h2>개인 코드 관리</h2>
        <Link to="/personal/submit" className="submit-link">프로젝트 제출 &rarr;</Link>
      </div>

      <div className="upload-section">
        <div
          className="upload-drop"
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css,.json,.md,.txt,.go,.rs,.php,.rb,.swift,.kt" />
          <div className="drop-icon">+</div>
          <p>코드 파일을 클릭하여 업로드</p>
          <span className="drop-hint">지원: .js, .py, .java, .html, .css, .json 등</span>
        </div>

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}
      </div>

      <div className="files-section">
        <div className="files-list">
          <h3>업로드된 파일</h3>
          {files.length === 0 ? (
            <p className="empty-msg">아직 업로드된 파일이 없습니다.</p>
          ) : (
            files.map((f) => (
              <div
                key={f.id}
                className={`file-item ${selectedFile?.id === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFile(f)}
              >
                <div className="file-icon">&#x1f4c4;</div>
                <div className="file-info">
                  <span className="file-name">{f.fileName}</span>
                  <span className="file-meta">{formatSize(f.size)}</span>
                </div>
                <div className="file-dates">
                  {f.history?.map((h, i) => (
                    <span key={i} className="file-history">
                      {h.action}: {formatDate(h.date)}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="code-viewer-wrapper">
          {selectedFile ? (
            <CodeViewer
              fileName={selectedFile.fileName}
              content={selectedFile.content}
              size={selectedFile.size}
              history={selectedFile.history}
            />
          ) : (
            <div className="viewer-empty">
              <p>파일을 선택하면 코드가 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Personal
