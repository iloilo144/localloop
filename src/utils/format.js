export function formatDistance(metres) {
  if (!metres) return 'Your street'
  if (metres < 1000) return `${Math.round(metres / 10) * 10} m away`
  return `${(metres / 1000).toFixed(1)} km away`
}

export function formatDeposit(amount) {
  const value = Number(amount) || 0
  return value === 0 ? 'No deposit' : `£${value} deposit`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** yyyy-mm-dd in local time, for <input type="date"> */
export function toInputDate(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addDays(days, from = new Date()) {
  const d = new Date(from)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d
}

/** "Maya Okafor" -> "Maya", "The Adeyemi family" -> "the Adeyemis" */
export function firstName(name) {
  const family = name.match(/^The (\w+) family$/)
  if (family) return `the ${family[1]}s`
  return name.split(' ')[0]
}

export function initials(name) {
  return name
    .replace(/^The (\w+) family$/, '$1')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}
