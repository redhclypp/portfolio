import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah')
    } else {
      navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)'
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        padding: '40px', borderRadius: '4px', width: '100%', maxWidth: '400px'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '28px',
          marginBottom: '8px', color: 'var(--white)'
        }}>Admin Login</h2>
        <p style={{ color: 'var(--dim)', fontSize: '13px', marginBottom: '28px' }}>
          Meysya's Portfolio Dashboard
        </p>
        {error && (
          <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                display: 'block', width: '100%', marginTop: '8px',
                background: 'rgba(10,30,80,0.5)', border: '1px solid var(--border)',
                color: 'var(--white)', padding: '10px 14px', fontSize: '14px',
                borderRadius: '2px', outline: 'none', fontFamily: 'var(--font-body)'
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                display: 'block', width: '100%', marginTop: '8px',
                background: 'rgba(10,30,80,0.5)', border: '1px solid var(--border)',
                color: 'var(--white)', padding: '10px 14px', fontSize: '14px',
                borderRadius: '2px', outline: 'none', fontFamily: 'var(--font-body)'
              }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  )
}