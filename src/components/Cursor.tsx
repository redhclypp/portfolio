import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cur = document.getElementById('cur')
    const curR = document.getElementById('cur-r')

    if (!cur || !curR) return

    const move = (e: MouseEvent) => {
      cur.style.left = e.clientX + 'px'
      cur.style.top = e.clientY + 'px'

      setTimeout(() => {
        curR.style.left = e.clientX + 'px'
        curR.style.top = e.clientY + 'px'
      }, 60)
    }

    window.addEventListener('mousemove', move)

    return () => {
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <>
      <div id="cur" />
      <div id="cur-r" />
    </>
  )
}