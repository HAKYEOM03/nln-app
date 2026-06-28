import { Routes, Route, Navigate } from 'react-router-dom'
import TabNav from '../components/TabNav'
import Notices from './Notices'
import Works from './Works'
import WorkDetail from './WorkDetail'
import WritePage from './WritePage'
import './Section.css'

function Section({ sectionId, sectionName }) {
  const basePath = `/${sectionId}`

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{sectionName}</h2>
      </div>
      <div className="section-container">
        <TabNav basePath={basePath} />
        <Routes>
          <Route index element={<Navigate to="notices" replace />} />
          <Route path="notices" element={<Notices sectionId={sectionId} />} />
          <Route path="works" element={<Works sectionId={sectionId} />} />
          <Route path="works/:workId" element={<WorkDetail sectionId={sectionId} />} />
          <Route path="write" element={<WritePage sectionId={sectionId} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Section
