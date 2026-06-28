import { useParams, Link } from 'react-router-dom'
import './WorkDetail.css'

function WorkDetail({ sectionId }) {
  const { workId } = useParams()

  return (
    <div className="work-detail">
      <Link to={`/${sectionId}/works`} className="back-link">
        &larr; 작품 목록으로
      </Link>

      <div className="detail-header">
        <h3 className="detail-title">프로젝트 {workId} - AI 기반 솔루션</h3>
        <div className="detail-meta">
          <span className="detail-team">팀 {workId}</span>
          <span className="detail-date">2024-06-15</span>
        </div>
      </div>

      <div className="detail-sections">
        <div className="detail-section">
          <h4 className="detail-section-title">1. 깃허브 링크</h4>
          <div className="detail-section-content">
            <a
              href={`https://github.com/team${workId}/project`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              https://github.com/team{workId}/project
            </a>
          </div>
        </div>

        <div className="detail-section">
          <h4 className="detail-section-title">2. 실행 결과</h4>
          <div className="detail-section-content result-area">
            <p>실행 결과가 여기에 표시됩니다.</p>
            <p>프로젝트의 스크린샷이나 데모 영상을 확인할 수 있습니다.</p>
          </div>
        </div>

        <div className="detail-section">
          <h4 className="detail-section-title">3. 멀티모달 사용 흔적</h4>
          <div className="detail-section-content">
            <p>AI 멀티모달 기능의 사용 흔적 및 관련 링크를 여기서 확인할 수 있습니다.</p>
          </div>
        </div>

        <div className="detail-section">
          <h4 className="detail-section-title">4. 관련 링크</h4>
          <div className="detail-section-content">
            <p>해당 프로젝트와 관련된 추가 링크가 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkDetail
