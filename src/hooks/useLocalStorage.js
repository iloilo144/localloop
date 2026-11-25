import { useEffect, useState } from 'react'

/** useState that survives page reloads. Falls back gracefully if storage is blocked. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — keep working in memory */
    }
  }, [key, value])

  return [value, setValue]
}
