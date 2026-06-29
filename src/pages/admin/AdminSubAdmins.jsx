import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers, updateUser } from '../../utils/db'
import './Admin.css'

const PERMISSION_GROUPS = [
  {
    group: '회원 관리',
    perms: [
      { key: 'users_view', label: '회원 열람' },
      { key: 'users_edit', label: '회원 수정' },
      { key: 'users_delete', label: '회원 삭제' },
    ],
  },
  {
    group: '공지사항',
    perms: [
      { key: 'notices_view', label: '공지 열람' },
      { key: 'notices_create', label: '공지 작성' },
      { key: 'notices_delete', label: '공지 삭제' },
    ],
  },
  {
    group: '제출 프로젝트',
    perms: [
      { key: 'submissions_view', label: '제출 열람' },
      { key: 'submissions_code', label: '코드 열람' },
      { key: 'submissions_delete', label: '제출 삭제' },
    ],
  },
]

const ALL_PERM_KEYS = PERMISSION_GROUPS.flatMap(g => g.perms.map(p => p.key))

function AdminSubAdmins() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState(() => getUsers().filter(u => u.role !== 'admin'))
  const [editingId, setEditingId] = useState(null)
  const [editPerms, setEditPerms] = useState([])

  if (!isAdmin) return <div className="admin-page"><p>최고관리자만 접근 가능합니다.</p></div>

  const subAdmins = users.filter(u => u.role === 'subadmin')
  const regularUsers = users.filter(u => u.role === 'user')

  const refreshUsers = () => setUsers(getUsers().filter(u => u.role !== 'admin'))

  const handlePromote = (userId) => {
    updateUser(userId, { role: 'subadmin', permissions: [] })
    refreshUsers()
  }

  const handleDemote = (userId) => {
    if (!confirm('부관리자 권한을 해제하시겠습니까?')) return
    updateUser(userId, { role: 'user', permissions: [] })
    refreshUsers()
    setEditingId(null)
  }

  const startEditPerms = (u) => {
    setEditingId(u.id)
    setEditPerms([...(u.permissions || [])])
  }

  const togglePerm = (key) => {
    setEditPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key])
  }

  const toggleGroup = (group) => {
    const keys = group.perms.map(p => p.key)
    const allSelected = keys.every(k => editPerms.includes(k))
    if (allSelected) {
      setEditPerms(prev => prev.filter(p => !keys.includes(p)))
    } else {
      setEditPerms(prev => [...new Set([...prev, ...keys])])
    }
  }

  const selectAll = () => {
    const allSelected = ALL_PERM_KEYS.every(k => editPerms.includes(k))
    setEditPerms(allSelected ? [] : [...ALL_PERM_KEYS])
  }

  const savePerms = (userId) => {
    updateUser(userId, { permissions: editPerms })
    refreshUsers()
    setEditingId(null)
  }

  const getPermLabel = (key) => {
    for (const g of PERMISSION_GROUPS) {
      const found = g.perms.find(p => p.key === key)
      if (found) return found.label
    }
    return key
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: 20, color: '#667eea', fontSize: 13 }}>&larr; 대시보드</Link>
      <h2 className="admin-title">부관리자 관리</h2>
      <p className="admin-welcome">부관리자를 선택하고 세부 권한을 부여/회수할 수 있습니다</p>

      <div className="admin-section">
        <h3>현재 부관리자 ({subAdmins.length}명)</h3>
        {subAdmins.length === 0 ? (
          <div className="admin-table"><p className="empty-text">부관리자가 없습니다. 아래 일반 회원에서 승격하세요.</p></div>
        ) : (
          <div className="subadmin-list">
            {subAdmins.map(u => (
              <div key={u.id} className="subadmin-card">
                <div className="subadmin-card-header">
                  <div className="subadmin-info">
                    <span className="subadmin-name">{u.name}</span>
                    <span className="subadmin-id">@{u.username} · {u.studentId}</span>
                  </div>
                  <div className="admin-actions">
                    <button className="admin-btn edit" onClick={() => startEditPerms(u)}>
                      {editingId === u.id ? '취소' : '권한 설정'}
                    </button>
                    <button className="admin-btn delete" onClick={() => handleDemote(u.id)}>해제</button>
                  </div>
                </div>

                <div className="subadmin-perms-display">
                  {(u.permissions || []).length === 0 ? (
                    <span className="perm-empty">권한이 부여되지 않았습니다</span>
                  ) : (
                    (u.permissions || []).map(p => (
                      <span key={p} className="perm-badge">{getPermLabel(p)}</span>
                    ))
                  )}
                </div>

                {editingId === u.id && (
                  <div className="perm-editor">
                    <div className="perm-editor-top">
                      <span className="perm-editor-title">{u.name}님의 권한 설정</span>
                      <button className="admin-btn edit" onClick={selectAll}>
                        {ALL_PERM_KEYS.every(k => editPerms.includes(k)) ? '전체 해제' : '전체 선택'}
                      </button>
                    </div>

                    {PERMISSION_GROUPS.map(group => {
                      const groupKeys = group.perms.map(p => p.key)
                      const allGroupSelected = groupKeys.every(k => editPerms.includes(k))
                      return (
                        <div key={group.group} className="perm-group">
                          <div className="perm-group-header" onClick={() => toggleGroup(group)}>
                            <span className={`perm-group-check ${allGroupSelected ? 'checked' : ''}`}>
                              {allGroupSelected ? '✓' : ''}
                            </span>
                            <span className="perm-group-name">{group.group}</span>
                          </div>
                          <div className="perm-group-items">
                            {group.perms.map(p => (
                              <div
                                key={p.key}
                                className={`perm-item ${editPerms.includes(p.key) ? 'active' : ''}`}
                                onClick={() => togglePerm(p.key)}
                              >
                                <span className="perm-check">{editPerms.includes(p.key) ? '✓' : ''}</span>
                                {p.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    <div className="perm-editor-actions">
                      <button className="admin-btn save" style={{ padding: '10px 24px', fontSize: 14 }} onClick={() => savePerms(u.id)}>
                        권한 저장
                      </button>
                      <button className="admin-btn edit" style={{ padding: '10px 24px', fontSize: 14 }} onClick={() => setEditingId(null)}>
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h3>일반 회원 (부관리자로 승격 가능)</h3>
        <div className="admin-table">
          <div className="admin-row header">
            <span className="at-name">이름</span>
            <span className="at-title">아이디</span>
            <span className="at-cat">학번</span>
            <span className="at-date">가입일</span>
            <span style={{ width: 80 }}>관리</span>
          </div>
          {regularUsers.map(u => (
            <div key={u.id} className="admin-row">
              <span className="at-name">{u.name}</span>
              <span className="at-title">{u.username}</span>
              <span className="at-cat">{u.studentId}</span>
              <span className="at-date">{new Date(u.createdAt).toLocaleDateString()}</span>
              <span style={{ width: 80 }}>
                <button className="admin-btn save" onClick={() => handlePromote(u.id)}>승격</button>
              </span>
            </div>
          ))}
          {regularUsers.length === 0 && <p className="empty-text">일반 회원이 없습니다.</p>}
        </div>
      </div>
    </div>
  )
}

export default AdminSubAdmins
