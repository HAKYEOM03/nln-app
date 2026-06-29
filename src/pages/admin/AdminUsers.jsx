import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers, deleteUser } from '../../utils/db'
import './Admin.css'

function AdminUsers() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getUsers().then(u => setUsers(u.filter(x => x.role !== 'admin')))
  }, [])

  if (!hasPermission('users')) return <div className="admin-page"><p>접근 권한이 없습니다.</p></div>

  const filtered = users.filter(u =>
    u.name?.includes(search) || u.username?.includes(search) || u.studentId?.includes(search)
  )

  const handleDelete = async (userId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await deleteUser(userId)
    const updated = await getUsers()
    setUsers(updated.filter(u => u.role !== 'admin'))
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: 20, color: '#667eea', fontSize: 13 }}>&larr; 대시보드</Link>
      <h2 className="admin-title">회원 관리</h2>
      <p className="admin-welcome">총 {users.length}명의 회원</p>

      <div className="form-group" style={{ maxWidth: 300, marginBottom: 20 }}>
        <input
          type="text" placeholder="이름, 아이디, 학번으로 검색"
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e0e0e0', fontSize: 14, width: '100%' }}
        />
      </div>

      <div className="admin-table">
        <div className="admin-row header">
          <span className="at-name">이름</span>
          <span className="at-title">아이디</span>
          <span className="at-cat">학번</span>
          <span className="at-date">역할</span>
          <span style={{ width: 80 }}>관리</span>
        </div>
        {filtered.map(u => (
          <div key={u.id}>
            <div className="admin-row" style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}>
              <span className="at-name">{u.name}</span>
              <span className="at-title">{u.username}</span>
              <span className="at-cat">{u.studentId}</span>
              <span className="at-date"><span className="cat-tag">{u.role === 'subadmin' ? '부관리자' : '일반'}</span></span>
              <span style={{ width: 80 }}>
                <button className="admin-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(u.id) }}>삭제</button>
              </span>
            </div>
            {expandedId === u.id && (
              <div className="user-detail">
                <div className="user-detail-grid">
                  <div className="user-detail-item"><span className="label">이름</span><span className="value">{u.name}</span></div>
                  <div className="user-detail-item"><span className="label">아이디</span><span className="value">{u.username}</span></div>
                  <div className="user-detail-item"><span className="label">이메일</span><span className="value">{u.email}</span></div>
                  <div className="user-detail-item"><span className="label">전화번호</span><span className="value">{u.phone}</span></div>
                  <div className="user-detail-item"><span className="label">생년월일</span><span className="value">{u.birthDate}</span></div>
                  <div className="user-detail-item"><span className="label">학번</span><span className="value">{u.studentId}</span></div>
                  <div className="user-detail-item"><span className="label">가입일</span><span className="value">{new Date(u.createdAt).toLocaleString()}</span></div>
                  <div className="user-detail-item"><span className="label">역할</span><span className="value">{u.role}</span></div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-text">회원이 없습니다.</p>}
      </div>
    </div>
  )
}

export default AdminUsers
