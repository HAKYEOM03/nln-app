import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSubmissions, getFeedbacks, addFeedback, addNotification } from '../../utils/db'
import CodeViewer from '../../components/CodeViewer'
import './Admin.css'

function AdminSubmissions() {
  const { user, hasPermission } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [selectedSub, setSelectedSub] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [feedbackText, setFeedbackText] = useState('')
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    getSubmissions().then(setSubmissions)
  }, [])

  if (!hasPermission('submissions')) return <div className="admin-page"><p>접근 권한이 없습니다.</p></div>

  const openProject = async (sub) => {
    setSelectedSub(sub)
    setShowCode(false)
    const fb = await getFeedbacks(sub.id)
    setFeedbacks(fb)
  }

  const handleFeedback = async () => {
    if (!feedbackText.trim() || !selectedSub) return
    await addFeedback({
      submissionId: selectedSub.id,
      userId: user.id,
      userName: user.name,
      type: 'feedback',
      message: feedbackText,
    })
    await addNotification({
      toUserId: selectedSub.userId,
      fromUserName: user.name,
      message: `교직원이 "${selectedSub.title}" 프로젝트에 피드백을 남겼습니다.`,
      submissionId: selectedSub.id,
    })
    setFeedbackText('')
    const fb = await getFeedbacks(selectedSub.id)
    setFeedbacks(fb)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: 20, color: '#667eea', fontSize: 13 }}>&larr; 대시보드</Link>
      <h2 className="admin-title">제출 프로젝트 관리</h2>
      <p className="admin-welcome">총 {submissions.length}개의 제출</p>

      <div className="admin-table">
        <div className="admin-row header">
          <span className="at-name">제출자</span>
          <span className="at-title">제목</span>
          <span className="at-cat">카테고리</span>
          <span className="at-date">날짜</span>
        </div>
        {submissions.map(s => (
          <div key={s.id} className="admin-row" style={{ cursor: 'pointer' }} onClick={() => openProject(s)}>
            <span className="at-name">{s.userName}</span>
            <span className="at-title" style={{ color: '#667eea' }}>
              {s.title}
              {s.reuploadedAt && <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: 4 }}>재업로드</span>}
            </span>
            <span className="at-cat"><span className="cat-tag">{s.category}</span></span>
            <span className="at-date">{new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {submissions.length === 0 && <p className="empty-text">제출된 프로젝트가 없습니다.</p>}
      </div>

      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div className="modal-content" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSub(null)}>&times;</button>
            <h3 className="modal-title">{selectedSub.title}</h3>

            <div className="modal-body">
              <div className="modal-field">
                <span className="modal-label">개발자</span>
                <span className="modal-value">{selectedSub.userName} ({selectedSub.studentId})</span>
              </div>
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
              {selectedSub.githubUrl && (
                <div className="modal-field">
                  <span className="modal-label">GitHub</span>
                  <span className="modal-value"><a href={selectedSub.githubUrl} target="_blank" rel="noopener noreferrer">{selectedSub.githubUrl}</a></span>
                </div>
              )}
              {selectedSub.description && (
                <div className="modal-field">
                  <span className="modal-label">설명</span>
                  <span className="modal-value">{selectedSub.description}</span>
                </div>
              )}

              {selectedSub.codeContent && (
                <div style={{ marginTop: 12 }}>
                  <button className="admin-btn edit" onClick={() => setShowCode(!showCode)} style={{ marginBottom: 8 }}>
                    {showCode ? '코드 닫기' : '코드 확인'}
                  </button>
                  {showCode && <CodeViewer fileName={selectedSub.codeFileName} content={selectedSub.codeContent} />}
                </div>
              )}

              <div className="feedback-section" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e0', marginBottom: 12 }}>피드백</h4>
                {feedbacks.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>아직 피드백이 없습니다.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
                    {feedbacks.map(fb => (
                      <div key={fb.id} style={{
                        padding: 12, borderRadius: 10,
                        background: fb.type === 'feedback' ? 'rgba(102,126,234,0.06)' : fb.type === 'reupload' ? 'rgba(240,147,251,0.06)' : 'rgba(74,222,128,0.06)',
                        borderLeft: `3px solid ${fb.type === 'feedback' ? '#667eea' : fb.type === 'reupload' ? '#f093fb' : '#4ade80'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>{fb.userName}</span>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#999' }}>
                            {fb.type === 'feedback' ? '교직원 피드백' : fb.type === 'reupload' ? '재업로드' : '해결 방법'}
                          </span>
                          <span style={{ fontSize: 11, color: '#555', marginLeft: 'auto' }}>{formatDate(fb.createdAt)}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{fb.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="학생에게 피드백을 작성하세요..."
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e0e0e0', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <button className="admin-btn save" style={{ padding: '10px 20px', fontSize: 14, alignSelf: 'flex-start' }} onClick={handleFeedback}>피드백 전송</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSubmissions
