import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Cursor from './components/Cursor'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Strip from './components/Strip'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ProjectDetail from './pages/ProjectDetail'

function Portfolio() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' })

    const cur = document.getElementById('cur')
    const curR = document.getElementById('cur-r')

    const move = (e: MouseEvent) => {
      if (cur) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px' }
      if (curR) {
        setTimeout(() => {
          curR.style.left = e.clientX + 'px'
          curR.style.top = e.clientY + 'px'
        }, 70)
      }
    }

    const onScroll = () => {
      let current = ''
      document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 120) current = s.id
      })
      document.querySelectorAll('.nav-links a, .nav-mobile-panel a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current)
      })
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="page-content page-visible">
      <Navbar />
      <Hero />
      <Strip />
      <About />
      <Projects />
      <Experience />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <>
      <Cursor />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </>
  )
}

export default App