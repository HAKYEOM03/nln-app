import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="landing-content">
        <div className="landing-badge">Next Level Nova</div>

        <h1 className="landing-title">
          <span className="title-line">Next</span>
          <span className="title-line indent-1">Level</span>
          <span className="title-line indent-2">Nova</span>
        </h1>

        <p className="landing-quote">
          "하나님의 부르심 안에서 더 높은 믿음의 단계로 나아가
          <br />
          세상을 밝히는 새로운 빛이 되다"
        </p>

        <div className="landing-cards">
          <Link to="/hackathon/notices" className="landing-card">
            <div className="card-icon">&#x1f4bb;</div>
            <h3>AI 해커톤</h3>
            <p>AI 해커톤 프로젝트 공지사항, 작품 제출 및 문서 작성</p>
            <span className="card-arrow">&rarr;</span>
          </Link>
          <Link to="/president/notices" className="landing-card">
            <div className="card-icon">&#x1f3c6;</div>
            <h3>총장배</h3>
            <p>총장배 대회 공지사항, 작품 제출 및 문서 작성</p>
            <span className="card-arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
