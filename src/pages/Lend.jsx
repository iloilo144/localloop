import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoop } from '../context/LoopContext'
import { CATEGORIES, CONDITIONS } from '../data/items'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import ItemImage from '../components/ItemImage'
import TiltCard from '../components/TiltCard'
import Page from '../components/Page'
import { formatDeposit } from '../utils/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './Lend.css'

const EMPTY = {
  title: '',
  category: '',
  condition: 'Good',
  description: '',
  deposit: '10',
  maxDays: '5',
  includes: '',
  photoUrl: '',
}

function validate(v) {
  const errors = {}
  if (v.title.trim().length < 4) errors.title = 'Give it a name people would search for (at least 4 characters).'
  if (!v.category) errors.category = 'Pick the shelf it belongs on.'
  if (v.description.trim().length < 30)
    errors.description = `A few more words, please: condition, quirks, how to use it. (${v.description.trim().length}/30)`
  const deposit = Number(v.deposit)
  if (v.deposit === '' || Number.isNaN(deposit) || deposit < 0 || deposit > 500)
    errors.deposit = 'Enter a deposit between £0 and £500.'
  const days = Number(v.maxDays)
  if (!Number.isInteger(days) || days < 1 || days > 30) errors.maxDays = 'Choose between 1 and 30 days.'
  if (v.photoUrl && !/^https?:\/\/\S+$/i.test(v.photoUrl.trim())) errors.photoUrl = 'That doesn’t look like a web address.'
  return errors
}

export default function Lend() {
  useDocumentTitle('Lend something')
  const { addListing, notify } = useLoop()
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const change = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    const item = addListing({
      title: values.title.trim(),
      category: values.category,
      condition: values.condition,
      description: values.description.trim(),
      deposit: Number(values.deposit),
      maxDays: Number(values.maxDays),
      includes: values.includes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      photoUrl: values.photoUrl.trim() || null,
    })
    notify('Your listing is live on Elm Park')
    navigate(`/item/${item.id}`)
  }

  const preview = {
    title: values.title.trim() || 'Your item',
    category: values.category || 'tools',
    photoUrl: /^https?:\/\//i.test(values.photoUrl.trim()) ? values.photoUrl.trim() : null,
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: change,
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  const errorFor = (name) =>
    errors[name] ? (
      <p className="error" id={`${name}-error`}>
        {errors[name]}
      </p>
    ) : null

  const steps = [
    Boolean(values.title.trim() && values.category),
    values.description.trim().length >= 30,
    values.deposit !== '' && values.maxDays !== '',
  ]

  const legend = (n, text) => (
    <legend>
      <motion.span
        className={`lend__step ${steps[n - 1] ? 'is-done' : ''}`}
        animate={{ scale: steps[n - 1] ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.4 }}
      >
        {steps[n - 1] ? <Check size={14} strokeWidth={3} /> : n}
      </motion.span>
      {text}
    </legend>
  )

  return (
    <Page className="lend wrap">
      <header className="lend__head">
        <p className="kicker">Lend something</p>
        <h1>
          Put it on the <span className="accent">shared shelf.</span>
        </h1>
        <p>You stay in charge. You approve every request and set the deposit and how long it can go out for.</p>
      </header>

      <div className="lend__grid">
        <form className="lend__form" onSubmit={submit} noValidate>
          <fieldset>
            {legend(1, 'What is it?')}
            <div className="field">
              <label htmlFor="title">Item name</label>
              <input className="input" placeholder="e.g. Folding ladder, 6 steps" {...fieldProps('title')} />
              {errorFor('title')}
            </div>
            <div className="field">
              <label htmlFor="category">Shelf</label>
              <select className="input" {...fieldProps('category')}>
                <option value="">Choose a category</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errorFor('category')}
            </div>
            <fieldset className="field">
              <legend>Condition</legend>
              <div className="segmented">
                {CONDITIONS.map((c) => (
                  <label key={c}>
                    <input type="radio" name="condition" value={c} checked={values.condition === c} onChange={change} />
                    {values.condition === c && (
                      <motion.span layoutId="cond-pill" className="segmented__pill" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />
                    )}
                    <span className="segmented__label">{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </fieldset>

          <fieldset>
            {legend(2, 'Describe it')}
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                className="input"
                rows={4}
                placeholder="What is it good for, what condition is it in, anything people should know?"
                {...fieldProps('description')}
              />
              <div className="lend__meter" aria-hidden="true">
                <motion.span animate={{ scaleX: Math.min(1, values.description.trim().length / 30) }} />
              </div>
              {errorFor('description')}
            </div>
            <div className="field">
              <label htmlFor="includes">What’s included</label>
              <input className="input" placeholder="Separate with commas: charger, case, manual" {...fieldProps('includes')} />
            </div>
            <div className="field">
              <label htmlFor="photoUrl">Photo URL (optional)</label>
              <input className="input" type="url" placeholder="https://…" {...fieldProps('photoUrl')} />
              <p className="hint">No photo? We will make a simple label card for you.</p>
              {errorFor('photoUrl')}
            </div>
          </fieldset>

          <fieldset>
            {legend(3, 'Your terms')}
            <div className="lend__terms">
              <div className="field">
                <label htmlFor="deposit">Deposit (£)</label>
                <input className="input" type="number" min="0" max="500" inputMode="numeric" {...fieldProps('deposit')} />
                {errorFor('deposit')}
              </div>
              <div className="field">
                <label htmlFor="maxDays">Max. days</label>
                <input className="input" type="number" min="1" max="30" inputMode="numeric" {...fieldProps('maxDays')} />
                {errorFor('maxDays')}
              </div>
            </div>
          </fieldset>

          <div className="lend__submit">
            <motion.button className="btn btn--green" whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
              Publish listing
            </motion.button>
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => {
                setValues(EMPTY)
                setErrors({})
              }}
            >
              Start over
            </button>
          </div>
        </form>

        <aside className="lend__preview" aria-label="Listing preview">
          <p className="lend__preview-label">Live preview · move your mouse over it</p>
          <TiltCard className="lend__card">
            <div className="lend__img">
              <ItemImage key={preview.photoUrl} item={preview} />
            </div>
            <motion.h2 key={preview.title} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
              {preview.title}
            </motion.h2>
            <p>
              You · {values.condition} · {formatDeposit(values.deposit)}
            </p>
          </TiltCard>
        </aside>
      </div>
    </Page>
  )
}
