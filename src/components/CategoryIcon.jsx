import { BookOpen, Camera, CookingPot, Headphones, LayoutGrid, Tent, Wrench } from 'lucide-react'

const ICONS = {
  all: LayoutGrid,
  tools: Wrench,
  electronics: Headphones,
  books: BookOpen,
  outdoor: Tent,
  photography: Camera,
  home: CookingPot,
}

export default function CategoryIcon({ id, size = 18 }) {
  const Icon = ICONS[id] ?? LayoutGrid
  return <Icon size={size} aria-hidden="true" />
}
