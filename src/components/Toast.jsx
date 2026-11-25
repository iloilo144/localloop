import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useLoop } from '../context/LoopContext'

export default function Toast() {
  const { toast } = useLoop()
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.key}
            className="toast"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.15 } }}
          >
            <span className="toast__icon" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
            {toast.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
