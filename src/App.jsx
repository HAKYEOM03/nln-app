import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Section from './pages/Section'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/hackathon/*" element={<Section sectionId="hackathon" sectionName="AI 해커톤" />} />
          <Route path="/president/*" element={<Section sectionId="president" sectionName="총장배" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
