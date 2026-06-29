import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout, isAdmin, isSubAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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
