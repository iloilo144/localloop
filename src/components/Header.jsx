import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, Plus, X } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import Logo from './Logo'
import './Header.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/browse', label: 'Browse' },
  { to: '/#how', label: 'How it works', hash: true },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { favorites, requests } = useLoop()
  const location = useLocation()
  const savedCount = favorites.length + requests.length

  useEffect(() => setOpen(false), [location])

  const isActive = (l) =>
    l.hash ? location.pathname === '/' && location.hash === '#how' : l.end ? location.pathname === '/' && !location.hash : location.pathname.startsWith(l.to)

  return (
    <header className="header">
      <div className="header__inner wrap">
        <Link to="/" className="header__brand" aria-label="LocalLoop home">
          <Logo />
        </Link>

        <nav className="header__nav" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={() => (isActive(l) ? 'is-active' : '')} end={l.end}>
              {isActive(l) && (
                <motion.span layoutId="nav-pill" className="header__pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
              )}
              <span className="header__label">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header__end">
          <Link to="/saved" className="header__saved" aria-label={`Saved and requests, ${savedCount} items`}>
            <Heart size={20} />
            <AnimatePresence>
              {savedCount > 0 && (
                <motion.span
                  key={savedCount}
                  className="header__count"
                  initial={{ scale: 0.3, y: 6 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 14 }}
                >
                  {savedCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <motion.div whileTap={{ scale: 0.94 }} className="header__cta-wrap">
            <Link to="/lend" className="btn btn--green header__cta">
              <Plus size={18} aria-hidden="true" /> Lend something
            </Link>
          </motion.div>
          <button className="header__toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
          >
            {[...LINKS, { to: '/saved', label: `Saved${savedCount ? ` (${savedCount})` : ''}` }, { to: '/lend', label: 'Lend something' }].map(
              (l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.04 * i } }}>
                  <Link to={l.to}>{l.label}</Link>
                </motion.div>
              ),
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
