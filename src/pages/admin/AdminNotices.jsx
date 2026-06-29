import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNotices, addNotice, deleteNotice } from '../../utils/db'
import './Admin.css'

function AdminNotices() {
  const { user, hasPermission } = useAuth()
  const [notices, setNotices] = useState(getNotices)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (!hasPermission('notices')) return <div className="admin-page"><p>접근 권한이 없습니다.</p></div>

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addNotice({ title, content, authorName: user.name, authorId: user.id })
    setNotices(getNotices())
    setTitle('')
    setContent('')
  }

  const handleDelete = (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    deleteNotice(id)
    setNotices(getNotices())
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: 20, color: '#667eea', fontSize: 13 }}>&larr; 대시보드</Link>
      <h2 className="admin-title">공지사항 관리</h2>

      <form className="admin-form" onSubmit={handleAdd}>
        <h3>새 공지사항 작성</h3>
        <div className="form-group">
          <label>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공지사항 제목" required />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="공지사항 내용을 입력하세요" rows={4} />
        </div>
        <button type="submit" className="admin-btn save" style={{ padding: '10px 20px', fontSize: 14 }}>등록</button>
      </form>

      <div className="admin-table">
        <div className="admin-row header">
          <span className="at-name">작성자</span>
          <span className="at-title">제목</span>
          <span className="at-date">날짜</span>
          <span style={{ width: 60 }}>관리</span>
        </div>
        {notices.map(n => (
          <div key={n.id} className="admin-row">
            <span className="at-name">{n.authorName}</span>
            <span className="at-title">{n.title}</span>
            <span className="at-date">{new Date(n.createdAt).toLocaleDateString()}</span>
            <span style={{ width: 60 }}>
              <button className="admin-btn delete" onClick={() => handleDelete(n.id)}>삭제</button>
            </span>
          </div>
        ))}
        {notices.length === 0 && <p className="empty-text">공지사항이 없습니다.</p>}
      </div>
    </div>
  )
}

export default AdminNotices
