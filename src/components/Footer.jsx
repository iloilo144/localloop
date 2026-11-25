import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__card">
          <div className="footer__brand">
            <Logo />
            <p>A shared shelf for Elm Park. Borrow what you need, lend what you can.</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="footer__title">Use LocalLoop</h2>
            <Link to="/browse">Browse items</Link>
            <Link to="/lend">Lend something</Link>
            <Link to="/saved">Saved & requests</Link>
          </nav>
          <div>
            <h2 className="footer__title">House rules</h2>
            <ul className="footer__rules">
              <li>Return things clean and on time.</li>
              <li>Deposits come back to you on return.</li>
              <li>If something breaks, say so. We sort it out together.</li>
            </ul>
          </div>
        </div>
        <p className="footer__note">
          LocalLoop is a portfolio concept. Listings and people are fictional, and your activity is stored only in this
          browser.
        </p>
      </div>
    </footer>
  )
}
