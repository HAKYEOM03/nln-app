import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotices } from '../utils/db'
import Pagination from '../components/Pagination'
import './Project.css'

const PER_PAGE = 10

function Project() {
  const [currentPage, setCurrentPage] = useState(1)
  const notices = getNotices()
  const totalPages = Math.max(1, Math.ceil(notices.length / PER_PAGE))
  const current = notices.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  return (
    <div className="project-page">
      <div className="project-header">
        <h2>프로젝트 공지사항</h2>
        <Link to="/project/board" className="board-link">게시판 보기 &rarr;</Link>
      </div>

      <div className="project-container">
        {notices.length === 0 ? (
          <div className="empty-notice">
            <p>등록된 공지사항이 없습니다.</p>
            <span>관리자가 공지사항을 등록하면 여기에 표시됩니다.</span>
          </div>
        ) : (
          <>
            <div className="notice-list">
              <div className="notice-row header">
                <span className="n-num">번호</span>
                <span className="n-title">제목</span>
                <span className="n-author">작성자</span>
                <span className="n-date">날짜</span>
              </div>
              {current.map((n, idx) => (
                <div key={n.id} className="notice-row">
                  <span className="n-num">{(currentPage - 1) * PER_PAGE + idx + 1}</span>
                  <span className="n-title">{n.title}</span>
                  <span className="n-author">{n.authorName}</span>
                  <span className="n-date">{formatDate(n.createdAt)}</span>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
    </div>
  )
}

export default Project
