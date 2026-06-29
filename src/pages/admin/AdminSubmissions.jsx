import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSubmissions } from '../../utils/db'
import CodeViewer from '../../components/CodeViewer'
import './Admin.css'

function AdminSubmissions() {
  const { hasPermission } = useAuth()
  const [viewingCode, setViewingCode] = useState(null)
  const submissions = getSubmissions()

  if (!hasPermission('submissions')) return <div className="admin-page"><p>접근 권한이 없습니다.</p></div>

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
          <span style={{ width: 80 }}>코드</span>
        </div>
        {submissions.map(s => (
          <div key={s.id}>
            <div className="admin-row">
              <span className="at-name">{s.userName}</span>
              <span className="at-title">
                {s.title}
                {s.deployUrl && <a href={s.deployUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: 11, color: '#4ade80' }}>[배포]</a>}
                {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 4, fontSize: 11, color: '#888' }}>[GitHub]</a>}
              </span>
              <span className="at-cat"><span className="cat-tag">{s.category}</span></span>
              <span className="at-date">{new Date(s.createdAt).toLocaleDateString()}</span>
              <span style={{ width: 80 }}>
                {s.codeContent && (
                  <button className="admin-btn edit" onClick={() => setViewingCode(viewingCode === s.id ? null : s.id)}>
                    {viewingCode === s.id ? '닫기' : '보기'}
                  </button>
                )}
              </span>
            </div>
            {viewingCode === s.id && s.codeContent && (
              <div style={{ padding: '0 16px 16px' }}>
                <CodeViewer fileName={s.codeFileName} content={s.codeContent} />
              </div>
            )}
          </div>
        ))}
        {submissions.length === 0 && <p className="empty-text">제출된 프로젝트가 없습니다.</p>}
      </div>
    </div>
  )
}

export default AdminSubmissions
