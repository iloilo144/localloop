import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import { CATEGORIES } from '../data/items'
import ItemCard from '../components/ItemCard'
import CategoryIcon from '../components/CategoryIcon'
import Page from '../components/Page'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Browse.css'

const SORTS = {
  nearest: { label: 'Nearest first', fn: (a, b) => a.lender.distance - b.lender.distance },
  newest: { label: 'Newest first', fn: (a, b) => a.addedDaysAgo - b.addedDaysAgo },
  popular: { label: 'Most borrowed', fn: (a, b) => b.timesLent - a.timesLent },
}

export default function Browse() {
  useDocumentTitle('Browse')
  const { items } = useLoop()
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)

  const query = params.get('q') ?? ''
  const category = params.get('cat') ?? 'all'
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'nearest'
  const onlyAvailable = params.get('available') === '1'

  // Simulates the short wait of a real network request so the loading state is visible.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(timer)
  }, [])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === '' || value === null || value === 'all' || value === false) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => !onlyAvailable || item.status === 'available')
      .filter(
        (item) =>
          !q ||
          [item.title, item.description, item.lender.name, item.lender.street, item.category].join(' ').toLowerCase().includes(q),
      )
      .sort(SORTS[sort].fn)
  }, [items, query, category, onlyAvailable, sort])

  const countFor = (id) => items.filter((i) => id === 'all' || i.category === id).length
  const hasFilters = query || category !== 'all' || onlyAvailable
  const shelfLabel = CATEGORIES.find((c) => c.id === category)?.label.toLowerCase()

  return (
    <Page className="browse wrap">
      <header className="browse__head">
        <div>
          <p className="kicker">Within a 15-minute walk</p>
          <h1>
            Everything you can borrow on <span className="accent">Elm Park</span>
          </h1>
        </div>
        <form className="browse__search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="browse-q" className="visually-hidden">
            Search listings
          </label>
          <Search size={19} aria-hidden="true" />
          <input
            id="browse-q"
            type="search"
            placeholder="Search by item, person or street"
            value={query}
            onChange={(e) => update('q', e.target.value)}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                className="browse__clear"
                onClick={() => update('q', '')}
                aria-label="Clear search"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <X size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </header>

      <div className="chips" role="tablist" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button key={c.id} role="tab" aria-selected={category === c.id} className="chip" onClick={() => update('cat', c.id)}>
            {category === c.id && (
              <motion.span layoutId="chip-bg" className="chip__bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />
            )}
            <span className="chip__content">
              <CategoryIcon id={c.id} size={16} />
              {c.label}
              <span className="chip__count">{countFor(c.id)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <p aria-live="polite">
          {loading ? (
            'Looking around the neighbourhood…'
          ) : (
            <>
              <motion.strong key={results.length} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {results.length}
              </motion.strong>{' '}
              {results.length === 1 ? 'thing' : 'things'} to borrow
            </>
          )}
        </p>
        <div className="toolbar__controls">
          <label className={`switch ${onlyAvailable ? 'is-on' : ''}`}>
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => update('available', e.target.checked ? '1' : false)} />
            <span className="switch__track" aria-hidden="true">
              <motion.span layout className="switch__knob" transition={{ type: 'spring', stiffness: 700, damping: 30 }} />
            </span>
            Available now
          </label>
          <label>
            <span className="visually-hidden">Sort by</span>
            <select className="input toolbar__sort" value={sort} onChange={(e) => update('sort', e.target.value)}>
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton">
              <div className="skeleton__img" />
              <div className="skeleton__line" />
              <div className="skeleton__line skeleton__line--short" />
            </div>
          ))}
        </div>
      ) : results.length ? (
        <motion.div layout className="grid">
          <AnimatePresence mode="popLayout">
            {results.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <span className="empty__emoji" aria-hidden="true">
            <Search size={28} />
          </span>
          <h2>
            {category !== 'all' && query
              ? `No “${query}” on the ${shelfLabel} shelf.`
              : `Nobody has listed ${query ? `“${query}”` : 'anything like that'} yet.`}
          </h2>
          <p>Try a broader word, another shelf, or include items that are currently on loan.</p>
          {hasFilters && (
            <motion.button className="btn btn--soft" onClick={() => setParams({}, { replace: true })} whileTap={{ scale: 0.95 }}>
              <X size={16} aria-hidden="true" /> Clear all filters
            </motion.button>
          )}
        </motion.div>
      )}
    </Page>
  )
}
