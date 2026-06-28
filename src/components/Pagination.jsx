import './Pagination.css'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`dot-${idx}`} className="page-dots">...</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rsaquo;
      </button>
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </div>
  )
}

export default Pagination
