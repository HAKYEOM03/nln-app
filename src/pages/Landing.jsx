import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

function Landing() {
  const { user } = useAuth()

  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="landing-content">
        <div className="landing-badge">MakePro Platform</div>

        <h1 className="landing-title">
          <span className="title-main">MakePro</span>
        </h1>
        <p className="landing-subtitle">프로로 만들어 주는 사이트 + Project를 만들어 준다</p>

        {!user && (
          <div className="landing-cta">
            <Link to="/register" className="cta-btn primary">회원가입</Link>
            <Link to="/login" className="cta-btn secondary">로그인</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Landing
