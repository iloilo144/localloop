import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Inbox, PackagePlus } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import ItemCard from '../components/ItemCard'
import ItemImage from '../components/ItemImage'
import Page from '../components/Page'
import { formatDate } from '../utils/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Saved.css'

const TABS = [
  { id: 'saved', label: 'Saved items' },
  { id: 'requests', label: 'My requests' },
  { id: 'listings', label: 'My listings' },
]

export default function Saved() {
  useDocumentTitle('Saved')
  const { favorites, requests, myListings, getItem, cancelRequest } = useLoop()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'saved'

  const savedItems = favorites.map(getItem).filter(Boolean)
  const requestRows = requests.map((r) => ({ ...r, item: getItem(r.itemId) })).filter((r) => r.item)
  const counts = { saved: savedItems.length, requests: requestRows.length, listings: myListings.length }

  return (
    <Page className="saved wrap">
      <header className="saved__head">
        <p className="kicker">Your shelf</p>
        <h1>
          Things you’re keeping <span className="accent">an eye on</span>
        </h1>
      </header>

      <div className="seg" role="tablist" aria-label="Saved sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="saved-panel"
            className="seg__btn"
            onClick={() => setParams({ tab: t.id }, { replace: true })}
          >
            {tab === t.id && <motion.span layoutId="seg-pill" className="seg__pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span className="seg__label">
              {t.label} <span className="seg__count">{counts[t.id]}</span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          id="saved-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="saved__panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
        >
          {tab === 'saved' &&
            (savedItems.length ? (
              <motion.div layout className="grid">
                <AnimatePresence mode="popLayout">
                  {savedItems.map((item, i) => (
                    <ItemCard key={item.id} item={item} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Empty icon={Heart} title="Nothing saved yet." text="Tap the heart on anything you might need later." />
            ))}

          {tab === 'requests' &&
            (requestRows.length ? (
              <ul className="requests">
                <AnimatePresence initial={false}>
                  {requestRows.map((r) => (
                    <motion.li
                      key={r.id}
                      layout
                      className="request"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                    >
                      <Link to={`/item/${r.item.id}`} className="request__img">
                        <ItemImage item={r.item} width={300} />
                      </Link>
                      <div className="request__body">
                        <h2>
                          <Link to={`/item/${r.item.id}`}>{r.item.title}</Link>
                        </h2>
                        <p>
                          From {r.item.lender.name} · {formatDate(r.from)} – {formatDate(r.to)}
                        </p>
                        <blockquote>“{r.message}”</blockquote>
                      </div>
                      <div className="request__side">
                        <span className="tag tag--busy">Awaiting reply</span>
                        <button className="text-link request__cancel" onClick={() => cancelRequest(r.itemId)}>
                          Withdraw
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <Empty icon={Inbox} title="No borrow requests." text="When you ask to borrow something, you can follow it here." />
            ))}

          {tab === 'listings' &&
            (myListings.length ? (
              <div className="grid">
                {myListings.map((item, i) => (
                  <ItemCard key={item.id} item={item} index={i} />
                ))}
              </div>
            ) : (
              <Empty
                icon={PackagePlus}
                title="You haven’t listed anything yet."
                text="A ladder, a tent, a pasta machine. Whatever sits unused is useful to someone nearby."
                action={
                  <Link to="/lend" className="btn btn--green">
                    List your first item
                  </Link>
                }
              />
            ))}
        </motion.section>
      </AnimatePresence>
    </Page>
  )
}

function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <motion.span
        className="empty__emoji"
        aria-hidden="true"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      >
        <Icon size={26} />
      </motion.span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action ?? (
        <Link to="/browse" className="btn btn--soft">
          Browse the neighbourhood
        </Link>
      )}
    </div>
  )
}
