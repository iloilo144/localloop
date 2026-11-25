import { motion } from 'motion/react'

/** Every route fades and floats in on a soft spring, and steps aside quickly on exit. */
export default function Page({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 28 } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.16 } }}
    >
      {children}
    </motion.div>
  )
}
