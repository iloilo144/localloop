import { useState } from 'react'
import { photo, CATEGORIES } from '../data/items'

/** Renders a listing photo from an Unsplash id or a user-supplied URL, with a typographic fallback. */
export default function ItemImage({ item, width = 700, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  const src = item.photo ? photo(item.photo, width) : item.photoUrl
  const category = CATEGORIES.find((c) => c.id === item.category)?.label ?? 'Item'

  if (!src || failed) {
    return (
      <div className={`item-image item-image--empty ${className}`} role="img" aria-label={item.title}>
        <span>{category}</span>
        <strong>{item.title.split(' ').slice(0, 3).join(' ')}</strong>
      </div>
    )
  }

  return (
    <img
      className={`item-image ${className}`}
      src={src}
      alt={item.title}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  )
}
