import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSubmissions } from '../utils/db'
import Pagination from '../components/Pagination'
import CodeViewer from '../components/CodeViewer'
import './ProjectBoard.css'

const PER_PAGE = 10
const CATEGORIES = ['전체', '총장배', 'AI 경진대회', 'AI SW 경진대회']

function ProjectBoard() {
  const { user, isAdmin, isSubAdmin } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [viewingCode, setViewingCode] = useState(null)

  const allSubs = getSubmissions()
  const filtered = selectedCategory === '전체' ? allSubs : allSubs.filter(s => s.category === selectedCategory)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const canViewCode = isAdmin || isSubAdmin

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
            <div key={sub.id} className="board-card">
              <div className="board-card-top">
                <span className="board-cat">{sub.category}</span>
                <span className="board-date">{formatDate(sub.createdAt)}</span>
              </div>
              <h4 className="board-title">{sub.title}</h4>
              <p className="board-author">{sub.userName} ({sub.studentId})</p>
              {sub.description && <p className="board-desc">{sub.description}</p>}
              <div className="board-links">
                {sub.deployUrl && (
                  <a href={sub.deployUrl} target="_blank" rel="noopener noreferrer" className="board-link-btn deploy">배포 링크</a>
                )}
                {sub.githubUrl && (
                  <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className="board-link-btn github">GitHub</a>
                )}
                {canViewCode && sub.codeContent && (
                  <button className="board-link-btn code" onClick={() => setViewingCode(viewingCode === sub.id ? null : sub.id)}>
                    {viewingCode === sub.id ? '코드 닫기' : '코드 보기'}
                  </button>
                )}
              </div>
              {viewingCode === sub.id && canViewCode && (
                <div style={{ marginTop: 12 }}>
                  <CodeViewer fileName={sub.codeFileName} content={sub.codeContent} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

export default ProjectBoard
