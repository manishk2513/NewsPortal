import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin(username, password)
      localStorage.setItem('adminToken', res.data.token)
      navigate('/admin')
    } catch {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '0.3rem' }}>
          Admin Login
        </h2>
        <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '2rem' }}>
          NewsPortal Administration
        </p>

        {error && (
          <p style={{ background: '#fdf0ef', color: '#c0392b', padding: '0.7rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0dbd4', borderRadius: '4px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0dbd4', borderRadius: '4px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '4px', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

      </div>
    </div>
  )
}
