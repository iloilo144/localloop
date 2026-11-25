import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, MapPin } from 'lucide-react'
import { useLoop } from '../context/LoopContext'
import ItemImage from './ItemImage'
import AvailabilityTag from './AvailabilityTag'
import { formatDistance, formatDeposit } from '../utils/format'
import './ItemCard.css'

/** forwardRef so the card can take part in AnimatePresence "popLayout" reflows. */
const ItemCard = forwardRef(function ItemCard({ item, index = 0 }, ref) {
  const { favorites, toggleFavorite } = useLoop()
  const saved = favorites.includes(item.id)

  return (
    <motion.article
      ref={ref}
      layout
      className="card"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24, delay: Math.min(index, 8) * 0.04 } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover="hover"
    >
      <motion.div className="card__media" variants={{ hover: { y: -6 } }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
        <motion.div className="card__img" variants={{ hover: { scale: 1.06 } }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
          <ItemImage item={item} />
        </motion.div>
        <AvailabilityTag item={item} />
        <motion.button
          className={`card__fav ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleFavorite(item.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          whileTap={{ scale: 0.75 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.span
            key={String(saved)}
            initial={saved ? { scale: 0.2, rotate: -25 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 700, damping: 12 }}
            style={{ display: 'grid' }}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </motion.span>
          <AnimatePresence>
            {saved && (
              <motion.span
                className="card__burst"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
      <div className="card__body">
        <h3 className="card__title">
          <Link to={`/item/${item.id}`}>{item.title}</Link>
        </h3>
        <p className="card__meta">
          <MapPin size={14} aria-hidden="true" />
          {item.mine ? 'Your listing' : item.lender.name} · {formatDistance(item.lender.distance)}
        </p>
        <p className="card__deposit">{formatDeposit(item.deposit)}</p>
      </div>
    </motion.article>
  )
})

export default ItemCard
