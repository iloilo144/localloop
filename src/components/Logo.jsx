import { motion } from 'motion/react'

/** Two linked loops; they slide together a little when the logo is hovered. */
export default function Logo() {
  return (
    <motion.span className="logo" initial="rest" whileHover="hover" animate="rest">
      <svg viewBox="0 0 44 26" aria-hidden="true" width="38" height="22">
        <motion.circle
          cx="13"
          cy="13"
          r="9.5"
          fill="none"
          stroke="var(--green)"
          strokeWidth="3.4"
          variants={{ rest: { x: 0 }, hover: { x: 2.5 } }}
        />
        <motion.circle
          cx="31"
          cy="13"
          r="9.5"
          fill="none"
          stroke="var(--sun)"
          strokeWidth="3.4"
          variants={{ rest: { x: 0 }, hover: { x: -2.5 } }}
        />
      </svg>
      <span>LocalLoop</span>
    </motion.span>
  )
}
