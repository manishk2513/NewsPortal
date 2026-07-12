import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NewsCard({ article, featured }) {
  const navigate = useNavigate()
  const { language } = useLanguage()

  const translation = article.translations?.[language]
  const displayTitle = translation?.title || article.title
  const displaySummary = translation?.summary || article.summary

  return (
    <div
      onClick={() => navigate('/article/' + article._id)}
      style={{ background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', gridColumn: featured ? 'span 2' : 'span 1', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {article.imageUrl && (
        <div style={{ height: featured ? '260px' : '180px', overflow: 'hidden', background: '#f0ebe4' }}>
          <img src={article.imageUrl} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
        </div>
      )}

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#c0392b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
          {article.category}
        </span>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: featured ? '1.4rem' : '1rem', fontWeight: '700', lineHeight: '1.3', marginBottom: '0.6rem', color: '#1a1a1a', flex: 1 }}>
          {displayTitle}
        </h3>
        <p style={{ fontSize: '0.83rem', color: '#666', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '0.8rem' }}>
          {displaySummary}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#999', borderTop: '1px solid #f0ebe4', paddingTop: '0.6rem', marginTop: 'auto' }}>
          <span>{article.source?.name}</span>
          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
        </div>
      </div>
    </div>
  )
}
