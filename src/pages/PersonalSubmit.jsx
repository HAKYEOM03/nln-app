import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addSubmission } from '../utils/db'
import './PersonalSubmit.css'

const CATEGORIES = ['총장배', 'AI 경진대회', 'AI SW 경진대회']

function PersonalSubmit() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ title: '', githubUrl: '', deployUrl: '', category: '', description: '' })
  const [codeFile, setCodeFile] = useState(null)
  const [codeContent, setCodeContent] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCodeFile(file)
    const reader = new FileReader()
    reader.onload = () => setCodeContent(reader.result)
    reader.readAsText(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category) { alert('카테고리를 선택해주세요.'); return }
    await addSubmission({
      ...form,
      userId: user.id,
      userName: user.name,
      studentId: user.studentId,
      codeFileName: codeFile?.name || '',
      codeContent: codeContent,
    })
    setSuccess(true)
    setTimeout(() => navigate('/project/board'), 1500)
  }

  if (success) {
    return (
      <div className="submit-page"><div className="submit-card">
        <h2 style={{ color: '#4ade80' }}>제출 완료!</h2>
        <p style={{ color: '#888', marginTop: 8 }}>프로젝트 게시판으로 이동합니다...</p>
      </div></div>
    )
  }

  return (
    <div className="submit-page">
      <div className="submit-card">
        <Link to="/personal" className="back-link">&larr; 개인 페이지로</Link>
        <h2>프로젝트 제출</h2>
        <p className="submit-desc">프로젝트를 공지사항 게시판에 제출합니다</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>카테고리</label>
            <select value={form.category} onChange={(e) => setForm(p => ({...p, category: e.target.value}))} required>
              <option value="">카테고리를 선택하세요</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>프로젝트 제목</label>
            <input type="text" value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} placeholder="프로젝트 제목" required />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input type="url" value={form.githubUrl} onChange={(e) => setForm(p => ({...p, githubUrl: e.target.value}))} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label>배포 링크</label>
            <input type="url" value={form.deployUrl} onChange={(e) => setForm(p => ({...p, deployUrl: e.target.value}))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>설명</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} placeholder="프로젝트에 대한 간단한 설명" rows={3} />
          </div>
          <div className="form-group">
            <label>코드 파일 첨부</label>
            <div className="file-attach" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
              {codeFile ? <span className="attached-name">{codeFile.name}</span> : <span>클릭하여 파일 선택</span>}
            </div>
          </div>
          <button type="submit" className="auth-submit">제출하기</button>
        </form>
      </div>
    </div>
  )
}

export default PersonalSubmit
