import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLoop } from '../context/LoopContext'
import { addDays, firstName, formatDate, toInputDate } from '../utils/format'
import './BorrowForm.css'

function validate({ from, to, message }, item, earliest) {
  const errors = {}
  if (!from) errors.from = 'Choose a start date.'
  else if (new Date(from) < earliest)
    errors.from =
      item.status === 'available' ? 'The start date can’t be in the past.' : `It’s back on ${formatDate(earliest)}. Pick that day or later.`
  if (!to) errors.to = 'Choose a return date.'
  else if (from && new Date(to) < new Date(from)) errors.to = 'The return date must be after the start date.'
  else if (from) {
    const days = Math.round((new Date(to) - new Date(from)) / 86400000) + 1
    if (days > item.maxDays) errors.to = `${firstName(item.lender.name)} lends this for up to ${item.maxDays} days.`
  }
  if (message.trim().length < 10) errors.message = 'Add a short note (at least 10 characters) so they know what it’s for.'
  return errors
}

export default function BorrowForm({ item }) {
  const { requests, sendRequest, cancelRequest } = useLoop()
  const existing = requests.find((r) => r.itemId === item.id)
  const earliest = addDays(item.status === 'available' ? 0 : item.backInDays)
  const name = firstName(item.lender.name)

  const [values, setValues] = useState({
    from: toInputDate(earliest),
    to: toInputDate(addDays(Math.min(2, item.maxDays - 1), earliest)),
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const change = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values, item, earliest)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setSubmitting(true)
    // A real app would POST here; the request is stored locally instead.
    setTimeout(() => {
      sendRequest({ itemId: item.id, ...values, message: values.message.trim() })
      setSubmitting(false)
    }, 600)
  }

  if (existing) {
    return (
      <motion.div
        className="borrow borrow--sent"
        role="status"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        {/* the tick draws itself in */}
        <motion.span
          className="borrow__check"
          aria-hidden="true"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
            />
          </svg>
        </motion.span>
        <div>
          <h2>Request sent to {name}</h2>
          <p>
            {formatDate(existing.from)} – {formatDate(existing.to)}. Neighbours usually reply within a few hours. You
            can follow it under <Link to="/saved?tab=requests">Saved → Requests</Link>.
          </p>
          <button className="text-link borrow__cancel" onClick={() => cancelRequest(item.id)}>
            Withdraw request
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form className="borrow" onSubmit={submit} noValidate>
      <h2>Ask {name} to borrow it</h2>
      <div className="borrow__dates">
        <div className="field">
          <label htmlFor="from">From</label>
          <input
            id="from"
            name="from"
            type="date"
            className="input"
            min={toInputDate(earliest)}
            value={values.from}
            onChange={change}
            aria-invalid={!!errors.from}
            aria-describedby={errors.from ? 'from-error' : undefined}
          />
          {errors.from && (
            <p className="error" id="from-error">
              {errors.from}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="to">Until</label>
          <input
            id="to"
            name="to"
            type="date"
            className="input"
            min={values.from}
            value={values.to}
            onChange={change}
            aria-invalid={!!errors.to}
            aria-describedby={errors.to ? 'to-error' : undefined}
          />
          {errors.to && (
            <p className="error" id="to-error">
              {errors.to}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">A note for {name}</label>
        <textarea
          id="message"
          name="message"
          className="input"
          rows={3}
          placeholder="Hi! I’m putting up shelves on Saturday. Could I pick it up Friday evening?"
          value={values.message}
          onChange={change}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p className="error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <motion.button className="btn btn--green borrow__submit" disabled={submitting} whileTap={{ scale: 0.96 }}>
        {submitting ? 'Sending…' : 'Send borrow request'}
      </motion.button>
    </form>
  )
}
