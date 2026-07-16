import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchArticle } from '../api'
import { useLanguage } from '../context/useLanguage.js'

export default function ArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language, getTranslation } = useLanguage()
  const [article, setArticle] = useState(null)
  const [displayContent, setDisplayContent] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [listening, setListening] = useState(false)

  const loadArticle = useCallback(async () => {
    try {
      const res = await fetchArticle(id)
      setArticle(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  const applyTranslation = useCallback(async () => {
    if (!article) return
    setTranslating(true)
    const result = await getTranslation(article, language)
    if (result) {
      setDisplayContent(result)
    } else {
      // Gemini failed — fall back to English
      setDisplayContent({ title: article.title, content: article.content, summary: article.summary })
    }
    setTranslating(false)
  }, [article, language, getTranslation])

  useEffect(() => { loadArticle() }, [loadArticle])

  useEffect(() => {
    if (article) applyTranslation()
  }, [article, applyTranslation])

  const handleListen = () => {
    if (listening) { window.speechSynthesis.cancel(); setListening(false); return }
    if (!displayContent) return
    const parts = [displayContent.title]
    if (displayContent.summary) parts.push(displayContent.summary)
    if (displayContent.content) parts.push(displayContent.content)
    const text = parts.join('. ')
    const utterance = new SpeechSynthesisUtterance(text)
    const langMap = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN', fr: 'fr-FR', es: 'es-ES' }
    utterance.lang = langMap[language] || 'en-US'
    utterance.rate = 0.9
    utterance.onend = () => setListening(false)
    utterance.onerror = () => setListening(false)
    window.speechSynthesis.speak(utterance)
    setListening(true)
  }

  if (!article || !displayContent) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
        <div style={{ height: '400px', background: '#e8e3dc', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>
    )
  }

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1.5rem', padding: 0 }}>
        Back to News
      </button>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#c0392b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{article.category}</span>
        <span style={{ color: '#999' }}>{article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}</span>
        <span style={{ color: '#999' }}>{article.source?.name}</span>
      </div>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem', color: '#1a1a1a' }}>
        {translating ? 'Translating...' : displayContent.title}
      </h1>

      <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6', borderLeft: '4px solid #c0392b', paddingLeft: '1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
        {translating ? '' : displayContent.summary}
      </p>

      <button
        onClick={handleListen}
        disabled={translating}
        style={{ background: listening ? '#c0392b' : '#1a1a1a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem' }}
      >
        {listening ? 'Stop Listening' : 'Listen to Article'}
      </button>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={displayContent.title}
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '4px', marginBottom: '2rem' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      )}

      {article.videoUrl && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '2rem' }}>
          <iframe
            src={article.videoUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
            allowFullScreen
            title="Article video"
          />
        </div>
      )}

      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#2c2c2c' }}>
        {translating ? (
          <p style={{ color: '#999' }}>Translating article...</p>
        ) : (
          displayContent.content.split('\n').map((para, i) =>
            para.trim() ? <p key={i} style={{ marginBottom: '1.2rem' }}>{para}</p> : null
          )
        )}
      </div>

      {article.source?.url && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f4ef', borderRadius: '4px', fontSize: '0.85rem', color: '#666' }}>
          Source: <a href={article.source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c0392b' }}>{article.source.name}</a>
        </div>
      )}

    </article>
  )
}
