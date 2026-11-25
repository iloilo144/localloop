export function availabilityText(item) {
  if (item.status === 'available') return 'Available now'
  if (item.backInDays === 1) return 'Back tomorrow'
  return `Back in ${item.backInDays} days`
}

export default function AvailabilityTag({ item }) {
  const available = item.status === 'available'
  return <span className={`tag ${available ? 'tag--free' : 'tag--busy'}`}>{availabilityText(item)}</span>
}
