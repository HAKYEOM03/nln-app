import { useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import './Works.css'

const SAMPLE_WORKS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `프로젝트 ${i + 1} - AI 기반 솔루션`,
  team: `팀 ${i + 1}`,
  githubUrl: `https://github.com/team${i + 1}/project`,
  date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  tags: ['React', 'AI', 'pdf-lib'].slice(0, Math.floor(Math.random() * 3) + 1),
}))

const PER_PAGE = 10

function Works({ sectionId }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(SAMPLE_WORKS.length / PER_PAGE)
  const startIdx = (currentPage - 1) * PER_PAGE
  const currentWorks = SAMPLE_WORKS.slice(startIdx, startIdx + PER_PAGE)

  return (
    <div className="works">
      <div className="works-list">
        {currentWorks.map((work) => (
          <Link
            key={work.id}
            to={`/${sectionId}/works/${work.id}`}
            className="work-card"
          >
            <div className="work-card-left">
              <span className="work-num">#{work.id}</span>
              <div className="work-info">
                <h4 className="work-title">{work.title}</h4>
                <div className="work-meta">
                  <span className="work-team">{work.team}</span>
                  <span className="work-date">{work.date}</span>
                </div>
              </div>
            </div>
            <div className="work-card-right">
              <div className="work-tags">
                {work.tags.map((tag) => (
                  <span key={tag} className="work-tag">{tag}</span>
                ))}
              </div>
              <span className="work-github-badge">GitHub</span>
            </div>
          </Link>
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

export default Works
