import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNotifications, markAllNotificationsRead } from '../utils/db'
import './Navbar.css'

function Navbar() {
  const { user, logout, isAdmin, isSubAdmin } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [showNoti, setShowNoti] = useState(false)
  const [notis, setNotis] = useState([])

  useEffect(() => {
    if (!user) return
    const loadNotis = async () => {
      const targetId = isAdmin ? 'admin' : user.id
      const n = await getNotifications(targetId)
      setNotis(n)
      setUnread(n.filter(x => !x.read).length)
    }
    loadNotis()
    const interval = setInterval(loadNotis, 15000)
    return () => clearInterval(interval)
  }, [user, isAdmin])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNotiClick = async () => {
    setShowNoti(!showNoti)
    if (!showNoti && unread > 0) {
      const targetId = isAdmin ? 'admin' : user.id
      await markAllNotificationsRead(targetId)
      setUnread(0)
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">MakePro</span>
          <span className="logo-sub">프로로 만들어주는 Project</span>
        </Link>
        <div className="navbar-center">
          {user && (
            <>
              <NavLink to="/personal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                개인
              </NavLink>
              <NavLink to="/project" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                프로젝트
              </NavLink>
            </>
          )}
          {(isAdmin || isSubAdmin) && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}>
              관리자
            </NavLink>
          )}
        </div>
        <div className="navbar-auth">
          {user && (
            <div className="noti-wrapper">
              <button className="noti-btn" onClick={handleNotiClick}>
                &#x1f514;
                {unread > 0 && <span className="noti-badge">{unread}</span>}
              </button>
              {showNoti && (
                <div className="noti-dropdown">
                  <div className="noti-header">알림</div>
                  {notis.length === 0 ? (
                    <p className="noti-empty">알림이 없습니다.</p>
                  ) : (
                    notis.slice(0, 10).map(n => (
                      <div key={n.id} className={`noti-item ${n.read ? '' : 'unread'}`}>
                        <p className="noti-msg">{n.message}</p>
                        <span className="noti-date">{formatDate(n.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button className="auth-btn logout-btn" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-btn login-btn">로그인</Link>
              <Link to="/register" className="auth-btn register-btn">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
