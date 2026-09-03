import { useEffect, useState } from 'react'

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav>
      <div className="nav-brand">
        <span className="nav-name">Meysya's Portfolio</span>
      </div>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}><a href={l.href} className={l.href === '#hero' ? 'active' : ''}>{l.label}</a></li>
        ))}
      </ul>

      <div className="nav-right">
        <a href="#contact" className="nav-cta">Let's Talk</a>

        <button
          className={`nav-menu-btn ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`nav-mobile-panel ${open ? 'is-open' : ''}`}>
        <ul>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta nav-mobile-cta" onClick={() => setOpen(false)}>Let's Talk</a>
      </div>

      {open && <div className="nav-mobile-backdrop" onClick={() => setOpen(false)}></div>}
    </nav>
  )
}