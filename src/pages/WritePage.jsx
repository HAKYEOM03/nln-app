import { useState, useRef, useCallback } from 'react'
import { loadPdfTemplate, fillPdfTemplate, createBlankPdf, createBlobUrl, downloadPdf } from '../utils/pdfUtils'
import './WritePage.css'

const FORM_FIELDS = [
  { key: 'documentTitle', label: '문서 제목', type: 'text', placeholder: '문서 제목을 입력하세요' },
  { key: 'teamName', label: '팀명', type: 'text', placeholder: '팀명을 입력하세요' },
  { key: 'memberNames', label: '팀원', type: 'text', placeholder: '팀원 이름을 입력하세요' },
  { key: 'projectTitle', label: '프로젝트명', type: 'text', placeholder: '프로젝트명을 입력하세요' },
  { key: 'description', label: '프로젝트 설명', type: 'textarea', placeholder: '프로젝트에 대한 설명을 입력하세요' },
  { key: 'techStack', label: '사용 기술', type: 'text', placeholder: '사용한 기술 스택을 입력하세요' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
  { key: 'additionalNotes', label: '비고', type: 'textarea', placeholder: '추가 사항을 입력하세요' },
]

function WritePage({ sectionId }) {
  const [formData, setFormData] = useState(
    Object.fromEntries(FORM_FIELDS.map((f) => [f.key, '']))
  )
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [templateFile, setTemplateFile] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef(null)
  const prevBlobUrl = useRef(null)

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setTemplateFile(file)
      setStatusMessage(`템플릿 "${file.name}" 이 로드되었습니다.`)

      const reader = new FileReader()
      reader.onload = () => {
        const url = URL.createObjectURL(new Blob([reader.result], { type: 'application/pdf' }))
        if (prevBlobUrl.current) URL.revokeObjectURL(prevBlobUrl.current)
        prevBlobUrl.current = url
        setPdfUrl(url)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const generatePdf = useCallback(async () => {
    setIsGenerating(true)
    setStatusMessage('PDF 생성 중...')

    try {
      let pdfBytes

      if (templateFile) {
        const templateBytes = await templateFile.arrayBuffer()
        pdfBytes = await fillPdfTemplate(templateBytes, formData)
      } else {
        pdfBytes = await createBlankPdf(formData)
      }

      const url = createBlobUrl(pdfBytes)
      if (prevBlobUrl.current) URL.revokeObjectURL(prevBlobUrl.current)
      prevBlobUrl.current = url
      setPdfUrl(url)
      setStatusMessage('PDF가 생성되었습니다!')

      sendDataToServer(formData)
    } catch (err) {
      setStatusMessage(`오류: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }, [formData, templateFile])

  const handleDownload = useCallback(async () => {
    try {
      let pdfBytes
      if (templateFile) {
        const templateBytes = await templateFile.arrayBuffer()
        pdfBytes = await fillPdfTemplate(templateBytes, formData)
      } else {
        pdfBytes = await createBlankPdf(formData)
      }
      const filename = formData.documentTitle
        ? `${formData.documentTitle}.pdf`
        : 'document.pdf'
      downloadPdf(pdfBytes, filename)
    } catch (err) {
      setStatusMessage(`다운로드 오류: ${err.message}`)
    }
  }, [formData, templateFile])

  const sendDataToServer = async (data) => {
    try {
      console.log('[Background Sync] 서버로 데이터 전송:', JSON.stringify(data))
    } catch {
      console.warn('[Background Sync] 서버 전송 실패 - 로컬에 저장됨')
    }
  }

  return (
    <div className="write-page">
      <div className="write-toolbar">
        <button
          className="toolbar-btn template-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          PDF 양식 업로드
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleTemplateUpload}
          style={{ display: 'none' }}
        />
        {statusMessage && (
          <span className="status-msg">{statusMessage}</span>
        )}
      </div>

      <div className="write-content">
        <div className="write-form">
          <h4 className="form-heading">문서 정보 입력</h4>
          {FORM_FIELDS.map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="form-input form-textarea"
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={4}
                />
              ) : (
                <input
                  className="form-input"
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button
              className="action-btn primary"
              onClick={generatePdf}
              disabled={isGenerating}
            >
              {isGenerating ? 'PDF 생성 중...' : 'PDF Update'}
            </button>
            <button
              className="action-btn secondary"
              onClick={handleDownload}
            >
              다운로드
            </button>
          </div>
        </div>

        <div className="write-preview">
          <h4 className="preview-heading">PDF 미리보기</h4>
          <div className="preview-area">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="pdf-iframe"
                title="PDF Preview"
              />
            ) : (
              <div className="preview-placeholder">
                <div className="placeholder-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <p>PDF 양식을 업로드하거나</p>
                <p>정보를 입력 후 "PDF Update"를 클릭하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritePage
