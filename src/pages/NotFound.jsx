import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Page from '../components/Page'

export default function NotFound({ message = 'That page wandered off. Someone probably borrowed it.' }) {
  return (
    <Page className="wrap" >
      <div className="empty" style={{ marginTop: '4rem' }}>
        <motion.span
          style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}
          animate={{ rotate: [0, -6, 6, -3, 0] }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          404
        </motion.span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{message}</h1>
        <Link to="/browse" className="btn btn--green">
          Browse what’s available
        </Link>
      </div>
    </Page>
  )
}
