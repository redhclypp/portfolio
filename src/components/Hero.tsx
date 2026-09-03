import { useEffect, useRef } from 'react'
import { useSiteContent } from '../hooks/useSiteContent'
import LanyardScene from './LanyardScene'

const defaultWords = [
  'Information Technology Student',
  'at Brawijaya University',
  'Web Development Enthusiast',
  'UI/UX Enthusiast',
  'IoT Project Explorer'
]

export default function Hero() {
  const { content } = useSiteContent()
  const typedRef   = useRef<HTMLSpanElement>(null)

  const words = content.hero_typed
    ? content.hero_typed.split('|').map(w => w.trim()).filter(Boolean)
    : defaultWords

  /* ---------- typing effect ---------- */
  useEffect(() => {
    let wi = 0, ci = 0, del = false
    let t: ReturnType<typeof setTimeout>
    const type = () => {
      if (!typedRef.current) return
      const w = words[wi]
      if (!del) {
        ci++; typedRef.current.textContent = w.slice(0, ci)
        if (ci === w.length) { del = true; t = setTimeout(type, 1400); return }
      } else {
        ci--; typedRef.current.textContent = w.slice(0, ci)
        if (ci === 0) { del = false; wi = (wi + 1) % words.length }
      }
      t = setTimeout(type, del ? 40 : 80)
    }
    t = setTimeout(type, 700)
    return () => clearTimeout(t)
  }, [words.join(',')])

  return (
    <section id="hero">
      <div className="lanyard-3d-wrap">
        <LanyardScene photoSrc={content.hero_photo || '/IMG_20260517_104625.jpg'} />
      </div>

      <div className="hero-left">
        <div className="hero-badge">
          <span>{content.hero_badge || 'Information Technology Student'}</span>
        </div>

        <h1 className="hero-title">
          <span className="t1 mix-title"><span className="s">P</span>ortfolio</span>
          <span className="t2">
            <span ref={typedRef}></span>
            <span className="type-cur">|</span>
          </span>
        </h1>

        <div className="hero-sub">
          <span className="hero-sub-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {content.hero_name || 'Meysya Indah Calista Putri'}
          </span>
        </div>

        <div className="hero-search">
          <span className="hero-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={content.hero_searchbar || 'Open to Internship and any Collaborations!'}
            readOnly
          />
        </div>
      </div>
    </section>
  )
}