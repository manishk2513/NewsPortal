import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage, languages } from '../context/LanguageContext.jsx'

export default function Navbar() {
  const { language, changeLanguage } = useLanguage()
  const navigate = useNavigate()
  const isAdmin = !!localStorage.getItem('adminToken')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
    window.location.reload()
  }

  return (
    <header style={{ background: '#1a1a1a', color: '#fff', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #333', fontSize: '0.75rem', color: '#aaa' }}>
        <span>{new Date().toDateString()}</span>
        <span>AI Powered Multilingual News Portal</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: '800', color: '#fff', textDecoration: 'none', letterSpacing: '-1px' }}>
          NewsPortal
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={language} onChange={e => changeLanguage(e.target.value)} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          {isAdmin ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/admin" style={{ color: '#f39c12', textDecoration: 'none', fontSize: '0.9rem' }}>Admin Panel</Link>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
            </div>
          ) : (
            <Link to="/admin/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.85rem' }}>Admin</Link>
          )}
        </div>
      </div>

      <nav style={{ display: 'flex', overflowX: 'auto', borderTop: '1px solid #333' }}>
        {['all','india','world','technology','business','sports','entertainment','health'].map(cat => (
          <Link key={cat} to={'/?category=' + cat} style={{ padding: '0.5rem 1rem', color: '#ccc', textDecoration: 'none', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderRight: '1px solid #333', display: 'inline-block' }}>
            {cat}
          </Link>
        ))}
      </nav>

    </header>
  )
}
