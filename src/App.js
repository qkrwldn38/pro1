import { useState } from 'react'
import './App.css'
import './Navbar.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import Log from './pages/Log'
//import LogChart from './components/LogChart'

function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-bar-item">
        <span className="nav-label">홈</span>
      </Link>
      <Link to="/log" className="nav-bar-item">
        <span className="nav-label">로그 안내</span>
      </Link>
      <Link to="/result" className="nav-bar-item">
        <span className="nav-label">분석결과</span>
      </Link>
    </nav>
  )
}

function App() {
  const handleAuthClick = () => {
    alert('로그인/회원가입 클릭!')
  }

  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <span className="logo">LogX</span>
          <NavBar />
          <button className="auth" onClick={handleAuthClick}>
            로그인/회원가입
          </button>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Log" element={<Log />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
