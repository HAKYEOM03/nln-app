import { useState } from 'react'
import Pagination from '../components/Pagination'
import './Notices.css'

const SAMPLE_NOTICES = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `공지사항 제목 ${i + 1}`,
  author: '관리자',
  date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  views: Math.floor(Math.random() * 500) + 10,
}))

const PER_PAGE = 10

function Notices({ sectionId }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)

  const totalPages = Math.ceil(SAMPLE_NOTICES.length / PER_PAGE)
  const startIdx = (currentPage - 1) * PER_PAGE
  const currentNotices = SAMPLE_NOTICES.slice(startIdx, startIdx + PER_PAGE)

  return (
    <div className="notices">
      <div className="notices-list">
        <div className="notices-header-row">
          <span className="col-num">번호</span>
          <span className="col-title">제목</span>
          <span className="col-author">작성자</span>
          <span className="col-date">날짜</span>
          <span className="col-views">조회</span>
        </div>

        {currentNotices.map((notice) => (
          <div key={notice.id} className="notice-item-wrapper">
            <div
              className={`notice-item ${expandedId === notice.id ? 'expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
            >
              <span className="col-num">{notice.id}</span>
              <span className="col-title">{notice.title}</span>
              <span className="col-author">{notice.author}</span>
              <span className="col-date">{notice.date}</span>
              <span className="col-views">{notice.views}</span>
            </div>
            {expandedId === notice.id && (
              <div className="notice-detail">
                <p>이 공지사항의 상세 내용이 여기에 표시됩니다.</p>
                <p>공지사항 #{notice.id}에 대한 추가 정보를 확인하세요.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Notices
