import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useInView } from 'motion/react'
import { ArrowRight, HandHeart, MessageCircle, PackageCheck, Search } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import { CATEGORIES } from '../data/items'
import ItemCard from '../components/ItemCard'
import ItemImage from '../components/ItemImage'
import CategoryIcon from '../components/CategoryIcon'
import Page from '../components/Page'
import { firstName, formatDistance } from '../utils/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Home.css'

const WORDS = ['drill', 'tent', 'camera', 'mixer', 'bike']
const HERO_ITEMS = ['cordless-drill', 'bell-tent', 'polaroid-now', 'stand-mixer']
const SUGGESTIONS = ['drill', 'tent', 'camera', 'mixer']

const STEPS = [
  { icon: Search, title: 'Find it nearby', text: 'Everything is a short walk away. Filter by what you need and when.' },
  { icon: MessageCircle, title: 'Ask to borrow', text: 'Pick dates and send a quick note. Most neighbours reply the same day.' },
  { icon: PackageCheck, title: 'Bring it back', text: 'Return it clean and on time and your deposit comes straight back.' },
]

const spring = { type: 'spring', stiffness: 260, damping: 24 }

/** Counts up to `to` the first time it scrolls into view. */
function Counter({ to, prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-GB')}
    </span>
  )
}

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="rotator">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          className="rotator__word"
          initial={{ y: '90%', opacity: 0, rotateX: -60 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '-90%', opacity: 0, rotateX: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Home() {
  useDocumentTitle()
  const { items, getItem } = useLoop()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const board = useRef(null)

  const heroItems = HERO_ITEMS.map(getItem).filter(Boolean)
  const fresh = [...items].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).slice(0, 4)
  const categories = CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
    ...c,
    count: items.filter((i) => i.category === c.id).length,
  }))

  const search = (event) => {
    event.preventDefault()
    navigate(query.trim() ? `/browse?q=${encodeURIComponent(query.trim())}` : '/browse')
  }

  return (
    <Page>
      <section className="hero wrap">
        <div className="hero__copy">
          <motion.p className="kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="hero__dot" aria-hidden="true" /> Elm Park · 64 neighbours lending
          </motion.p>
          <h1 className="hero__title">
            <span className="visually-hidden">Borrow a drill, tent or camera from next door.</span>
            <span aria-hidden="true">
              Borrow a <RotatingWord />
              <br />
              from <span className="accent">next door.</span>
            </span>
          </h1>
          <p className="hero__lede">
            Why buy something you’ll use twice a year? Borrow everyday things from people on your street, and lend
            yours back.
          </p>

          <motion.form
            className="hero__search"
            role="search"
            onSubmit={search}
            whileFocus={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.15 } }}
          >
            <label htmlFor="hero-q" className="visually-hidden">
              Search items near you
            </label>
            <Search size={20} aria-hidden="true" />
            <input id="hero-q" type="search" placeholder="What do you need?" value={query} onChange={(e) => setQuery(e.target.value)} />
            <motion.button className="btn btn--green" whileTap={{ scale: 0.94 }}>
              Search
            </motion.button>
          </motion.form>
          <div className="hero__suggest">
            <span>Popular:</span>
            {SUGGESTIONS.map((s) => (
              <motion.div key={s} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/browse?q=${s}`}>{s}</Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* draggable stack: throw a card and it springs back */}
        <div className="hero__board" ref={board} aria-label="Recently shared on Elm Park">
          {heroItems.map((item, i) => (
            <motion.div
              key={item.id}
              className={`stack-card stack-card--${i + 1}`}
              drag
              dragConstraints={board}
              dragSnapToOrigin
              dragElastic={0.35}
              whileDrag={{ scale: 1.06, rotate: 0, zIndex: 10, cursor: 'grabbing' }}
              whileHover={{ y: -8, rotate: 0 }}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: [-6, 4, -3, 5][i], transition: { ...spring, delay: 0.1 + i * 0.08 } }}
            >
              <div className="stack-card__img">
                <ItemImage item={item} width={600} eager />
              </div>
              <Link to={`/item/${item.id}`} className="stack-card__label" draggable="false">
                <strong>{firstName(item.lender.name)}</strong>
                <span>{formatDistance(item.lender.distance)}</span>
              </Link>
            </motion.div>
          ))}
          <p className="hero__drag-hint" aria-hidden="true">
            Drag us around
          </p>
        </div>
      </section>

      <section className="stats wrap" aria-label="This month on Elm Park">
        {[
          { n: 23, label: 'loans this month' },
          { n: 1840, label: 'not spent on things used once', prefix: '£' },
          { n: 64, label: 'neighbours lending' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ ...spring, delay: i * 0.08 }}
          >
            <strong>
              <Counter to={s.n} prefix={s.prefix} />
            </strong>
            <span>{s.label}</span>
          </motion.div>
        ))}
      </section>

      <section className="section wrap" id="how">
        <div className="section__head">
          <h2>
            How borrowing <span className="accent">works</span>
          </h2>
          <p>No fees and no algorithm. Just neighbours and a few simple rules.</p>
        </div>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              className="step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ ...spring, delay: i * 0.1 }}
            >
              <span className="step__icon" aria-hidden="true">
                <step.icon size={22} />
              </span>
              <span className="step__num">Step {i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <div className="section__head section__head--row">
          <h2>
            Browse by <span className="accent">shelf</span>
          </h2>
          <Link to="/browse" className="text-link">
            See everything
          </Link>
        </div>
        <ul className="shelves">
          {categories.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.05 }}
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }}>
                <Link to={`/browse?cat=${c.id}`} className="shelf">
                  <span className="shelf__icon">
                    <CategoryIcon id={c.id} size={22} />
                  </span>
                  <span className="shelf__name">{c.label}</span>
                  <span className="shelf__count">{c.count} items</span>
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="section wrap">
        <div className="section__head section__head--row">
          <h2>
            New on the <span className="accent">street</span>
          </h2>
          <Link to="/browse?sort=newest" className="text-link">
            All new listings
          </Link>
        </div>
        <div className="grid">
          {fresh.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      <section className="wrap">
        <motion.div
          className="lend-band"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={spring}
        >
          <span className="lend-band__icon" aria-hidden="true">
            <HandHeart size={28} />
          </span>
          <div>
            <h2>
              Got a ladder doing nothing? <span className="accent">Lend it to someone three doors down.</span>
            </h2>
            <p>Listing takes two minutes. You choose the deposit, how long they can borrow it, and who.</p>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/lend" className="btn lend-band__btn">
              List an item <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </Page>
  )
}
