import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubmissions } from '../utils/db'
import Pagination from '../components/Pagination'
import './ProjectBoard.css'

const PER_PAGE = 10
const CATEGORIES = ['전체', '총장배', 'AI 경진대회', 'AI SW 경진대회']

function ProjectBoard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [allSubs, setAllSubs] = useState([])
  const [modal, setModal] = useState(null)

  useEffect(() => {
    getSubmissions().then(setAllSubs)
  }, [])

  const filtered = selectedCategory === '전체' ? allSubs : allSubs.filter(s => s.category === selectedCategory)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <h2>프로젝트 게시판</h2>
        <Link to="/project" className="back-link">&larr; 공지사항</Link>
      </div>

      <div className="category-filter">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`cat-btn ${selectedCategory === c ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(c); setCurrentPage(1) }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="board-container">
        {current.length === 0 ? (
          <div className="empty-notice">
            <p>등록된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          current.map(sub => (
            <div key={sub.id} className="board-card" style={{ cursor: 'pointer' }} onClick={() => setModal(sub)}>
              <div className="board-card-top">
                <span className="board-cat">{sub.category}</span>
                <span className="board-date">{formatDate(sub.createdAt)}</span>
              </div>
              <h4 className="board-title">{sub.title}</h4>
              <p className="board-author">{sub.userName} ({sub.studentId})</p>
              {sub.description && <p className="board-desc">{sub.description}</p>}
              <div className="board-links">
                {sub.deployUrl && (
                  <a href={sub.deployUrl} target="_blank" rel="noopener noreferrer" className="board-link-btn deploy" onClick={e => e.stopPropagation()}>배포 링크</a>
                )}
                {sub.githubUrl && (
                  <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className="board-link-btn github" onClick={e => e.stopPropagation()}>GitHub</a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            <h3 className="modal-title">{modal.title}</h3>
            <div className="modal-body">
              <div className="modal-field">
                <span className="modal-label">개발자</span>
                <span className="modal-value">{modal.userName} ({modal.studentId})</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">카테고리</span>
                <span className="modal-value">{modal.category}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">배포 링크</span>
                <span className="modal-value">
                  {modal.deployUrl ? <a href={modal.deployUrl} target="_blank" rel="noopener noreferrer">{modal.deployUrl}</a> : '없음'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-label">설명</span>
                <span className="modal-value">{modal.description || '없음'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectBoard
