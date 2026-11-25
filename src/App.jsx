import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'motion/react'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ItemDetail from './pages/ItemDetail'
import Saved from './pages/Saved'
import Lend from './pages/Lend'
import NotFound from './pages/NotFound'

function useScrollOnNavigate(location) {
  useEffect(() => {
    if (location.hash) {
      // wait for the page-enter animation to mount the target
      const t = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 350)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
}

export default function App() {
  const location = useLocation()
  useScrollOnNavigate(location)

  return (
    // calm mode (see index.html) turns movement into simple fades; full mode keeps every spring
    <MotionConfig reducedMotion={document.documentElement.dataset.motion === 'calm' ? 'always' : 'never'} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/lend" element={<Lend />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Toast />
    </MotionConfig>
  )
}
