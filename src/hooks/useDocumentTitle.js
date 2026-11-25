import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — LocalLoop` : 'LocalLoop — Borrow from your neighbours'
  }, [title])
}
