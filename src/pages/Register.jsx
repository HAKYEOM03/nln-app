import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/db'
import './Auth.css'

function Register() {
  const [form, setForm] = useState({
    name: '', birthDate: '', phone: '', studentId: '',
    username: '', password: '', passwordConfirm: '', email: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.')
      return
    }
    try {
      const { passwordConfirm, ...userData } = form
      await registerUser(userData)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title" style={{ color: '#4ade80' }}>회원가입 완료!</h2>
          <p className="auth-desc">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  const fields = [
    { key: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
    { key: 'birthDate', label: '생년월일', type: 'date', placeholder: '' },
    { key: 'phone', label: '전화번호', type: 'tel', placeholder: '010-0000-0000' },
    { key: 'studentId', label: '학번', type: 'text', placeholder: '20240001' },
    { key: 'username', label: '아이디', type: 'text', placeholder: '아이디를 입력하세요' },
    { key: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력하세요' },
    { key: 'passwordConfirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
    { key: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
  ]

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <h2 className="auth-title">회원가입</h2>
        <p className="auth-desc">MakePro 계정을 생성하세요</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            {fields.map((f) => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="auth-submit">회원가입</button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
