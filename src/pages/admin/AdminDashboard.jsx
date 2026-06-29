import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers, getNotices, getSubmissions } from '../../utils/db'
import './Admin.css'

function AdminDashboard() {
  const { user, isAdmin, hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [notices, setNotices] = useState([])
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    getUsers().then(u => setUsers(u.filter(x => x.role !== 'admin')))
    getNotices().then(setNotices)
    getSubmissions().then(setSubmissions)
  }, [])

  const cards = [
    { label: '등록 회원', count: users.length, path: '/admin/users', perm: 'users', color: '#667eea' },
    { label: '공지사항', count: notices.length, path: '/admin/notices', perm: 'notices', color: '#4ade80' },
    { label: '제출 프로젝트', count: submissions.length, path: '/admin/submissions', perm: 'submissions', color: '#f093fb' },
  ]

  if (isAdmin) {
    cards.push({ label: '부관리자 관리', count: users.filter(u => u.role === 'subadmin').length, path: '/admin/sub-admins', perm: 'subadmins', color: '#e8a838' })
  }

  return (
    <div className="admin-page">
      <h2 className="admin-title">관리자 대시보드</h2>
      <p className="admin-welcome">{user.name}님 환영합니다 ({isAdmin ? '최고관리자' : '부관리자'})</p>

      <div className="admin-cards">
        {cards.map(c => (
          hasPermission(c.perm) && (
            <Link key={c.perm} to={c.path} className="admin-card" style={{ borderColor: `${c.color}33` }}>
              <span className="admin-card-count" style={{ color: c.color }}>{c.count}</span>
              <span className="admin-card-label">{c.label}</span>
            </Link>
          )
        ))}
      </div>

      {hasPermission('submissions') && (
        <div className="admin-section">
          <h3>최근 제출 프로젝트</h3>
          <div className="admin-table">
            <div className="admin-row header">
              <span className="at-name">제출자</span>
              <span className="at-title">제목</span>
              <span className="at-cat">카테고리</span>
              <span className="at-date">날짜</span>
            </div>
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} className="admin-row">
                <span className="at-name">{s.userName}</span>
                <span className="at-title">{s.title}</span>
                <span className="at-cat"><span className="cat-tag">{s.category}</span></span>
                <span className="at-date">{new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {submissions.length === 0 && <p className="empty-text">아직 제출된 프로젝트가 없습니다.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
