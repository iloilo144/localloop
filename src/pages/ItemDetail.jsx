import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Heart, ShieldCheck, Trash2 } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import { CATEGORIES } from '../data/items'
import ItemImage from '../components/ItemImage'
import ItemCard from '../components/ItemCard'
import AvailabilityTag from '../components/AvailabilityTag'
import BorrowForm from '../components/BorrowForm'
import CategoryIcon from '../components/CategoryIcon'
import Page from '../components/Page'
import { formatDeposit, formatDistance, initials } from '../utils/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NotFound from './NotFound'
import './ItemDetail.css'

const rise = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26, delay } },
})

export default function ItemDetail() {
  const { id } = useParams()
  const { items, getItem, favorites, toggleFavorite, removeListing } = useLoop()
  const item = getItem(id)
  useDocumentTitle(item?.title ?? 'Item not found')

  if (!item) return <NotFound message="That listing has been removed or never existed." />

  const saved = favorites.includes(item.id)
  const category = CATEGORIES.find((c) => c.id === item.category)
  const related = items
    .filter((i) => i.id !== item.id && (i.category === item.category || i.lender.name === item.lender.name))
    .slice(0, 4)

  return (
    <Page className="detail wrap">
      <motion.div whileHover={{ x: -3 }} className="detail__back-wrap">
        <Link to="/browse" className="detail__back">
          <ArrowLeft size={16} aria-hidden="true" /> Back to browsing
        </Link>
      </motion.div>

      <div className="detail__grid">
        <motion.div
          className="detail__media"
          initial={{ opacity: 0, scale: 0.94, borderRadius: 48 }}
          animate={{ opacity: 1, scale: 1, borderRadius: 28 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        >
          <motion.div className="detail__img" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <ItemImage item={item} width={1200} eager />
          </motion.div>
          <AvailabilityTag item={item} />
        </motion.div>

        <div className="detail__info">
          <motion.p className="detail__cat" {...rise(0.05)}>
            <Link to={`/browse?cat=${item.category}`}>
              <CategoryIcon id={item.category} size={15} /> {category?.label}
            </Link>
          </motion.p>
          <motion.h1 {...rise(0.1)}>{item.title}</motion.h1>

          <motion.div className="lender" {...rise(0.15)}>
            <span className="avatar" aria-hidden="true">
              {item.mine ? 'You' : initials(item.lender.name)}
            </span>
            <div>
              <p className="lender__name">{item.mine ? 'Listed by you' : `Lent by ${item.lender.name}`}</p>
              <p className="lender__where">
                {item.lender.street} · {formatDistance(item.lender.distance)}
                {!item.mine && ` · lent ${item.timesLent} times`}
              </p>
            </div>
            {!item.mine && (
              <span className="lender__badge">
                <ShieldCheck size={15} aria-hidden="true" /> Verified neighbour
              </span>
            )}
          </motion.div>

          <motion.dl className="facts" {...rise(0.2)}>
            <div>
              <dt>Condition</dt>
              <dd>{item.condition}</dd>
            </div>
            <div>
              <dt>Deposit</dt>
              <dd>{formatDeposit(item.deposit)}</dd>
            </div>
            <div>
              <dt>Borrow for</dt>
              <dd>Up to {item.maxDays} days</dd>
            </div>
          </motion.dl>

          <motion.p className="detail__desc" {...rise(0.25)}>
            {item.description}
          </motion.p>

          {item.includes?.length > 0 && (
            <motion.div {...rise(0.3)}>
              <h2 className="detail__subhead">What’s included</h2>
              <ul className="detail__includes">
                {item.includes.map((thing) => (
                  <li key={thing}>{thing}</li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div className="detail__actions" {...rise(0.35)}>
            <motion.button
              className={`btn btn--soft ${saved ? 'is-saved' : ''}`}
              onClick={() => toggleFavorite(item.id)}
              aria-pressed={saved}
              whileTap={{ scale: 0.94 }}
            >
              <motion.span key={String(saved)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 12 }} style={{ display: 'grid' }}>
                <Heart size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
              </motion.span>
              {saved ? 'Saved' : 'Save for later'}
            </motion.button>
            {item.mine && (
              <button className="btn btn--soft" onClick={() => removeListing(item.id)}>
                <Trash2 size={17} aria-hidden="true" /> Remove listing
              </button>
            )}
          </motion.div>

          {!item.mine && (
            <motion.div {...rise(0.4)}>
              <BorrowForm key={item.id} item={item} />
            </motion.div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="detail__related">
          <h2>
            Also <span className="accent">nearby</span>
          </h2>
          <div className="grid">
            {related.map((r, i) => (
              <ItemCard key={r.id} item={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </Page>
  )
}
