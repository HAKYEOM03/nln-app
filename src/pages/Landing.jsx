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

        <div className="landing-cards">
          <Link to={user ? '/personal' : '/login'} className="landing-card">
            <div className="card-icon">&#x1f4bb;</div>
            <h3>개인</h3>
            <p>코드 파일 업로드, 리뉴얼 관리 및 프로젝트 제출</p>
            <span className="card-arrow">&rarr;</span>
          </Link>
          <Link to="/project" className="landing-card">
            <div className="card-icon">&#x1f4c1;</div>
            <h3>프로젝트</h3>
            <p>공지사항 확인 및 공유된 프로젝트 게시판 열람</p>
            <span className="card-arrow">&rarr;</span>
          </Link>
        </div>

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
