import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import NewsCard from '../components/NewsCard'
import { fetchNews } from '../api'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    setArticles([])
    setPage(1)
    loadNews(1)
  }, [category])

  const loadNews = async (pageNum) => {
    setLoading(true)
    try {
      const res = await fetchNews(category, pageNum)
      if (pageNum === 1) {
        setArticles(res.data.articles)
      } else {
        setArticles(prev => [...prev, ...res.data.articles])
      }
      setTotalPages(res.data.pages)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      <div style={{ borderBottom: '3px solid #1a1a1a', marginBottom: '2rem', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: '700', textTransform: 'capitalize' }}>
          {category === 'all' ? 'Latest News' : category + ' News'}
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#999' }}>{articles.length} articles</span>
      </div>

      {loading && articles.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: '300px', background: '#e8e3dc', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No articles published yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Login as admin to fetch and publish news.</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {articles.map((article, index) => (
              <NewsCard key={article._id} article={article} featured={index === 0} />
            ))}
          </div>

          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => { const next = page + 1; setPage(next); loadNews(next) }}
                style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '0.8rem 2.5rem', fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '1px', borderRadius: '4px' }}
              >
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      )}

    </main>
  )
}
