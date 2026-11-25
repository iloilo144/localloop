import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

/** A card that tilts toward the pointer in 3D, on springs, and settles back when it leaves. */
export default function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 220, damping: 18 })
  const springY = useSpring(y, { stiffness: 220, damping: 18 })
  const rotateY = useTransform(springX, [0, 1], [-12, 12])
  const rotateX = useTransform(springY, [0, 1], [10, -10])
  const glareX = useTransform(springX, [0, 1], ['0%', '100%'])

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width)
    y.set((e.clientY - r.top) / r.height)
  }
  const leave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div className="tilt" onPointerMove={move} onPointerLeave={leave}>
      <motion.div className={className} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
        <motion.span className="tilt__glare" style={{ '--gx': glareX }} aria-hidden="true" />
      </motion.div>
    </div>
  )
}
