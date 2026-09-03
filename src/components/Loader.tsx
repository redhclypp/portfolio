import { useEffect, useState } from 'react'

export default function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('out'), 1500)
    const t3 = setTimeout(() => onDone(), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className={`loader-wrap loader-${phase}`}>
      <div className="loader-inner">
        <div className="loader-line" />
        <div className="loader-name">
          <span className="loader-s">M</span>eysya
        </div>
        <div className="loader-sub">portfolio</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" />
        </div>
      </div>
      <div className="loader-grid" />
    </div>
  )
}