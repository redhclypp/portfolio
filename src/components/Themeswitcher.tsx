import { useEffect, useState } from 'react'

const THEMES = [
  {
    id: 'dark',
    label: 'Dark',
    vars: {
      '--bg':           '#03091a',
      '--bg2':          '#060e24',
      '--white':        '#dde8ff',
      '--dim':          '#6677aa',
      '--blue':         '#1246ff',
      '--blue-mid':     '#2d5fff',
      '--blue-bright':  '#4d7fff',
      '--cyan':         '#00d4ff',
      '--border':       'rgba(50,100,255,.2)',
      '--border-c':     'rgba(0,212,255,.35)',
      '--card':         'rgba(8,20,60,.7)',
    }
  },
  {
    id: 'light',
    label: 'Light',
    vars: {
      '--bg':           '#f0f4ff',
      '--bg2':          '#e4ecff',
      '--white':        '#0f1c3f',
      '--dim':          '#5566aa',
      '--blue':         '#1246ff',
      '--blue-mid':     '#2d5fff',
      '--blue-bright':  '#4d7fff',
      '--cyan':         '#0099cc',
      '--border':       'rgba(18,70,255,.15)',
      '--border-c':     'rgba(0,153,204,.4)',
      '--card':         'rgba(255,255,255,.7)',
    }
  },
]

const STORAGE_KEY = 'portfolio-theme'

function applyTheme(id: string) {
  const theme = THEMES.find(t => t.id === id)
  if (!theme) return
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))

  // body background juga ikut ganti
  document.body.style.background = theme.vars['--bg']

  // grid lines body::after — inject/update style tag
  let styleEl = document.getElementById('theme-dynamic-style') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'theme-dynamic-style'
    document.head.appendChild(styleEl)
  }

  if (id === 'light') {
    styleEl.textContent = `
      body { color: var(--white); background: var(--bg); }
      body::before {
        background:
          radial-gradient(ellipse 60% 50% at 15% 20%, rgba(18,70,255,.08) 0%, transparent 70%),
          radial-gradient(ellipse 50% 60% at 85% 70%, rgba(0,153,204,.06) 0%, transparent 70%);
      }
      body::after {
        background-image:
          linear-gradient(rgba(18,70,255,.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(18,70,255,.05) 1px, transparent 1px);
      }
      nav { background: rgba(240,244,255,.85); border-bottom-color: rgba(18,70,255,.12); }
      .hero-photo-card { box-shadow: 0 0 0 1px rgba(18,70,255,.12), 0 20px 60px rgba(18,70,255,.15); }
      .hpc-photo-fade  { background: linear-gradient(to top, rgba(240,244,255,.95) 0%, transparent 100%); }
      .hpc-nametag     { background: rgba(240,244,255,.9); border-color: rgba(18,70,255,.15); color: #0f1c3f; }
      .abt-right, .exp-card, .admin-panel, .ctc-form-panel, .ctc-social-item, .pd-card { background: rgba(255,255,255,.85); border-color: rgba(18,70,255,.1); }
      .card-body-new, .project-card-new { background: rgba(255,255,255,.9); border-color: rgba(18,70,255,.1); }
      .card-title-new { color: #0f1c3f; }
      .admin-input, .ctc-input { background: rgba(255,255,255,.8); color: #0f1c3f; border-color: rgba(18,70,255,.2); }
      .strip { background: rgba(18,70,255,.04); }
      footer { border-top-color: rgba(18,70,255,.1); }
      .loader-wrap { background: var(--bg); }
      .loader-name { color: #0f1c3f; }
      .hpc-pill { background: rgba(240,244,255,.9); color: #0f1c3f; border-color: rgba(18,70,255,.25); }
    `
  } else {
    styleEl.textContent = ''
  }

  localStorage.setItem(STORAGE_KEY, id)
}

export default function ThemeSwitcher() {
  const [active, setActive] = useState(() => localStorage.getItem(STORAGE_KEY) || 'dark')

  useEffect(() => { applyTheme(active) }, [])

  const toggle = () => {
    const next = active === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setActive(next)
  }

  const isDark = active === 'dark'

  return (
    <button className="theme-toggle-btn" onClick={toggle} title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
      {isDark ? (
        /* Sun icon */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}