import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCodeFiles, saveCodeFile, getUserSubmissions, getFeedbacks, addFeedback, addNotification, updateSubmission } from '../utils/db'
import CodeViewer from '../components/CodeViewer'
import JSZip from 'jszip'
import './Personal.css'

function Personal() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState('files')
  const [selectedSub, setSelectedSub] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [replyText, setReplyText] = useState('')
  const fileInputRef = useRef(null)
  const reuploadRef = useRef(null)

  useEffect(() => {
    getCodeFiles(user.id).then(setFiles)
    getUserSubmissions(user.id).then(setSubmissions)
  }, [user.id])

  const loadFeedbacks = async (subId) => {
    const fb = await getFeedbacks(subId)
    setFeedbacks(fb)
  }

  const openSubmission = async (sub) => {
    setSelectedSub(sub)
    await loadFeedbacks(sub.id)
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selectedSub) return
    await addFeedback({
      submissionId: selectedSub.id,
      userId: user.id,
      userName: user.name,
      type: 'resolution',
      message: replyText,
    })
    await addNotification({
      toUserId: 'admin',
      fromUserName: user.name,
      message: `${user.name}님이 "${selectedSub.title}" 프로젝트에 해결 방법을 작성했습니다.`,
      submissionId: selectedSub.id,
    })
    setReplyText('')
    await loadFeedbacks(selectedSub.id)
  }

  const handleReupload = async (e) => {
    const file = e.target.files[0]
    if (!file || !selectedSub) return
    const reader = new FileReader()
    reader.onload = async () => {
      await updateSubmission(selectedSub.id, {
        codeContent: reader.result,
        codeFileName: file.name,
        reuploadedAt: new Date().toISOString(),
      })
      await addFeedback({
        submissionId: selectedSub.id,
        userId: user.id,
        userName: user.name,
        type: 'reupload',
        message: `코드를 재업로드했습니다: ${file.name}`,
      })
      await addNotification({
        toUserId: 'admin',
        fromUserName: user.name,
        message: `${user.name}님이 "${selectedSub.title}" 프로젝트 코드를 재업로드했습니다.`,
        submissionId: selectedSub.id,
      })
      const updated = await getUserSubmissions(user.id)
      setSubmissions(updated)
      setSelectedSub(updated.find(s => s.id === selectedSub.id))
      await loadFeedbacks(selectedSub.id)
    }
    reader.readAsText(file)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file)
      const entries = Object.entries(zip.files).filter(([name, f]) => !f.dir && !name.startsWith('__MACOSX') && !name.startsWith('.'))
      let done = 0
      for (const [name, zipFile] of entries) {
        const content = await zipFile.async('string')
        const fileName = name.split('/').pop()
        await saveCodeFile({
          userId: user.id,
          userName: user.name,
          fileName: fileName,
          content: content,
          size: content.length,
          type: 'text/plain',
          zipSource: file.name,
          fullPath: name,
        })
        done++
        setUploadProgress(Math.round((done / entries.length) * 100))
      }
      const updated = await getCodeFiles(user.id)
      setFiles(updated)
      setUploading(false)
    } else {
      const reader = new FileReader()
      reader.onload = async () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 5
          setUploadProgress(Math.min(progress, 95))
        }, 50)

        await saveCodeFile({
          userId: user.id,
          userName: user.name,
          fileName: file.name,
          content: reader.result,
          size: file.size,
          type: file.type || 'text/plain',
        })

        clearInterval(interval)
        setUploadProgress(100)
        const updated = await getCodeFiles(user.id)
        setFiles(updated)
        setTimeout(() => setUploading(false), 500)
      }
      reader.readAsText(file)
    }
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
        <h2>개인 페이지</h2>
        <Link to="/personal/submit" className="submit-link">프로젝트 제출 &rarr;</Link>
      </div>

      <div className="personal-tabs">
        <button className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>코드 파일</button>
        <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>내 프로젝트</button>
      </div>

      {activeTab === 'files' && (
        <>
          <div className="upload-section">
            <div className="upload-drop" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css,.json,.md,.txt,.go,.rs,.php,.rb,.swift,.kt,.zip" />
              <div className="drop-icon">+</div>
              <p>코드 파일 또는 ZIP 파일을 클릭하여 업로드</p>
              <span className="drop-hint">ZIP 파일 업로드 시 자동으로 개별 파일로 분리됩니다</span>
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
              <h3>업로드된 파일 ({files.length})</h3>
              {files.length === 0 ? (
                <p className="empty-msg">아직 업로드된 파일이 없습니다.</p>
              ) : (
                files.map((f) => (
                  <div key={f.id} className={`file-item ${selectedFile?.id === f.id ? 'active' : ''}`} onClick={() => setSelectedFile(f)}>
                    <div className="file-icon">&#x1f4c4;</div>
                    <div className="file-info">
                      <span className="file-name">{f.fileName}</span>
                      <span className="file-meta">{formatSize(f.size)} {f.fullPath ? `· ${f.fullPath}` : ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="code-viewer-wrapper">
              {selectedFile ? (
                <CodeViewer fileName={selectedFile.fileName} content={selectedFile.content} size={selectedFile.size} history={selectedFile.history} />
              ) : (
                <div className="viewer-empty"><p>파일을 선택하면 코드가 여기에 표시됩니다</p></div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'projects' && (
        <div className="my-projects">
          {submissions.length === 0 ? (
            <div className="viewer-empty"><p>제출한 프로젝트가 없습니다.</p></div>
          ) : (
            <div className="project-list">
              {submissions.map(sub => (
                <div key={sub.id} className="my-project-card" onClick={() => openSubmission(sub)}>
                  <div className="my-project-top">
                    <span className="cat-tag">{sub.category}</span>
                    <span className="my-project-date">{formatDate(sub.createdAt)}</span>
                  </div>
                  <h4>{sub.title}</h4>
                  <p className="my-project-desc">{sub.description || '설명 없음'}</p>
                  {sub.reuploadedAt && <span className="reupload-badge">재업로드됨</span>}
                </div>
              ))}
            </div>
          )}

          {selectedSub && (
            <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
              <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedSub(null)}>&times;</button>
                <h3 className="modal-title">{selectedSub.title}</h3>

                <div className="modal-body">
                  <div className="modal-field">
                    <span className="modal-label">카테고리</span>
                    <span className="modal-value">{selectedSub.category}</span>
                  </div>
                  {selectedSub.deployUrl && (
                    <div className="modal-field">
                      <span className="modal-label">배포 링크</span>
                      <span className="modal-value"><a href={selectedSub.deployUrl} target="_blank" rel="noopener noreferrer">{selectedSub.deployUrl}</a></span>
                    </div>
                  )}

                  <div className="feedback-section">
                    <h4 className="feedback-title">피드백</h4>
                    {feedbacks.length === 0 ? (
                      <p className="feedback-empty">아직 피드백이 없습니다.</p>
                    ) : (
                      <div className="feedback-list">
                        {feedbacks.map(fb => (
                          <div key={fb.id} className={`feedback-item ${fb.type}`}>
                            <div className="feedback-header">
                              <span className="feedback-author">{fb.userName}</span>
                              <span className="feedback-type-badge">{fb.type === 'feedback' ? '교직원 피드백' : fb.type === 'reupload' ? '재업로드' : '해결 방법'}</span>
                              <span className="feedback-date">{formatDate(fb.createdAt)}</span>
                            </div>
                            <p className="feedback-msg">{fb.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="feedback-reply">
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="해결 방법을 작성하세요..." rows={3} />
                      <div className="feedback-actions">
                        <button className="admin-btn save" onClick={handleReply}>해결 방법 작성</button>
                        <button className="admin-btn edit" onClick={() => reuploadRef.current?.click()}>코드 재업로드</button>
                        <input ref={reuploadRef} type="file" onChange={handleReupload} style={{ display: 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Personal
