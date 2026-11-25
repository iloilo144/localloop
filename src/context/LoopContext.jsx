import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { ITEMS } from '../data/items'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LoopContext = createContext(null)

export function LoopProvider({ children }) {
  const [myListings, setMyListings] = useLocalStorage('localloop:listings', [])
  const [favorites, setFavorites] = useLocalStorage('localloop:favorites', [])
  const [requests, setRequests] = useLocalStorage('localloop:requests', [])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  const items = useMemo(() => [...myListings, ...ITEMS], [myListings])

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ message, key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const getItem = useCallback((id) => items.find((item) => item.id === id), [items])

  const toggleFavorite = useCallback(
    (id) => {
      const isSaved = favorites.includes(id)
      setFavorites((prev) => (isSaved ? prev.filter((f) => f !== id) : [id, ...prev]))
      notify(isSaved ? 'Removed from your saved list' : 'Saved — find it under “Saved”')
    },
    [favorites, setFavorites, notify],
  )

  const addListing = useCallback(
    (listing) => {
      const item = {
        ...listing,
        id: `mine-${Date.now()}`,
        mine: true,
        status: 'available',
        addedDaysAgo: 0,
        timesLent: 0,
        lender: { name: 'You', street: 'Your street', distance: 0 },
      }
      setMyListings((prev) => [item, ...prev])
      return item
    },
    [setMyListings],
  )

  const removeListing = useCallback(
    (id) => {
      setMyListings((prev) => prev.filter((item) => item.id !== id))
      setFavorites((prev) => prev.filter((f) => f !== id))
      setRequests((prev) => prev.filter((r) => r.itemId !== id))
      notify('Listing removed')
    },
    [setMyListings, setFavorites, setRequests, notify],
  )

  const sendRequest = useCallback(
    (request) => {
      setRequests((prev) => [
        { ...request, id: `req-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() },
        ...prev.filter((r) => r.itemId !== request.itemId),
      ])
    },
    [setRequests],
  )

  const cancelRequest = useCallback(
    (itemId) => {
      setRequests((prev) => prev.filter((r) => r.itemId !== itemId))
      notify('Request withdrawn')
    },
    [setRequests, notify],
  )

  const value = {
    items,
    myListings,
    favorites,
    requests,
    toast,
    getItem,
    toggleFavorite,
    addListing,
    removeListing,
    sendRequest,
    cancelRequest,
    notify,
  }

  return <LoopContext.Provider value={value}>{children}</LoopContext.Provider>
}

export function useLoop() {
  const ctx = useContext(LoopContext)
  if (!ctx) throw new Error('useLoop must be used inside <LoopProvider>')
  return ctx
}
