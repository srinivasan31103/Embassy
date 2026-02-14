import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FloorPlan from './pages/FloorPlan'
import Features from './pages/Features'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/floor-plan" element={<FloorPlan />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
