import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSubmissions } from '../../utils/db'
import './Admin.css'

function AdminSubmissions() {
  const { hasPermission } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [modal, setModal] = useState(null)

  useEffect(() => {
    getSubmissions().then(setSubmissions)
  }, [])

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
        </div>
        {submissions.map(s => (
          <div key={s.id} className="admin-row" style={{ cursor: 'pointer' }} onClick={() => setModal(s)}>
            <span className="at-name">{s.userName}</span>
            <span className="at-title" style={{ color: '#667eea' }}>{s.title}</span>
            <span className="at-cat"><span className="cat-tag">{s.category}</span></span>
            <span className="at-date">{new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {submissions.length === 0 && <p className="empty-text">제출된 프로젝트가 없습니다.</p>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            <h3 className="modal-title">{modal.title}</h3>
            <div className="modal-body">
              <div className="modal-field">
                <span className="modal-label">개발자</span>
                <span className="modal-value">{modal.userName} ({modal.studentId})</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">카테고리</span>
                <span className="modal-value">{modal.category}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">배포 링크</span>
                <span className="modal-value">
                  {modal.deployUrl ? <a href={modal.deployUrl} target="_blank" rel="noopener noreferrer">{modal.deployUrl}</a> : '없음'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-label">GitHub</span>
                <span className="modal-value">
                  {modal.githubUrl ? <a href={modal.githubUrl} target="_blank" rel="noopener noreferrer">{modal.githubUrl}</a> : '없음'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-label">설명</span>
                <span className="modal-value">{modal.description || '없음'}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">제출일</span>
                <span className="modal-value">{new Date(modal.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSubmissions
