import { useState } from 'react'
import { useSiteContent } from '../hooks/useSiteContent'

export default function Contact() {
  const { content } = useSiteContent()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    const subject = encodeURIComponent(`Pesan dari ${form.name} — Portfolio`)
    const body = encodeURIComponent(`Nama: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.open(`mailto:${content.contact_email || 'myscallista@gmail.com'}?subject=${subject}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  const socials = [
    { icon: '💼', label: 'LinkedIn', value: 'Meysya Indah Calista Putri', href: content.contact_linkedin || '#' },
    { icon: '✉️', label: 'Email', value: content.contact_email || 'myscallista@gmail.com', href: `mailto:${content.contact_email || 'myscallista@gmail.com'}` },
    { icon: '⌥', label: 'GitHub', value: 'redhclypp', href: content.contact_github || '#' },
  ]

  return (
    <section id="contact">
      <div className="contact-inner" data-aos="fade-up">

        <div className="sec-label" style={{ justifyContent: 'center' }} data-aos="fade-up">Contact</div>
        <h2 className="contact-big mix-title">
          <span className="s">L</span>et's{' '}
          <span style={{ background: 'linear-gradient(90deg,var(--cyan),var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Connect
          </span>
        </h2>
        <p className="contact-sub">
          {content.contact_sub || 'Open for internship opportunities, collaborations, and interesting projects!'}
        </p>

        <div className="ctc-split">

          {/* Kiri — Sosmed */}
          <div className="ctc-socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="ctc-social-item">
                <div className="ctc-social-icon">{s.icon}</div>
                <div className="ctc-social-info">
                  <div className="ctc-social-label">{s.label}</div>
                  <div className="ctc-social-value">{s.value}</div>
                </div>
                <span className="ctc-social-arrow">↗</span>
              </a>
            ))}
          </div>

          {/* Kanan — Form */}
          <div className="ctc-form-panel">
            <div className="ctc-form-title">Send a Message</div>
            <form onSubmit={handleSend} className="ctc-form">
              <div className="ctc-field">
                <label className="ctc-field-label">Full Name</label>
                <input className="ctc-input" type="text" placeholder="e.g. Meysya Indah Calista Putri"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="ctc-field">
                <label className="ctc-field-label">Email Address</label>
                <input className="ctc-input" type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="ctc-field">
                <label className="ctc-field-label">Message</label>
                <textarea className="ctc-input ctc-textarea" placeholder="Write your message here..."
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className={`ctc-send-btn ${sent ? 'sent' : ''}`} disabled={sent}>
                {sent ? '✓ Message Sent!' : 'Send Message →'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}