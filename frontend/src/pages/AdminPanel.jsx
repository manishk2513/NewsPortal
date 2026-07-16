import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetchNews, adminGetDrafts, adminGetStats, adminPublish, adminDelete, adminGetArticles } from '../api'

const categories = ['india','world','technology','business','sports','entertainment','health']

export default function AdminPanel() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [drafts, setDrafts] = useState([])
  const [published, setPublished] = useState([])
  const [activeTab, setActiveTab] = useState('drafts')
  const [fetchCategory, setFetchCategory] = useState('india')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchResult, setFetchResult] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) navigate('/admin/login')
    else loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, draftsRes, allRes] = await Promise.all([
        adminGetStats(),
        adminGetDrafts(),
        adminGetArticles()
      ])
      setStats(statsRes.data)
      setDrafts(draftsRes.data)
      setPublished(allRes.data.filter(a => a.status === 'published'))
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login')
    }
  }

  const handleFetch = async () => {
    setFetchLoading(true)
    setFetchResult('')
    try {
      const res = await adminFetchNews(fetchCategory)
      const { success = 0, failed = 0, message = '' } = res.data
      if (success === 0 && failed === 0) {
        setFetchResult(message || 'No new articles found (all already exist or API returned nothing).')
      } else {
        setFetchResult(`Done: ${success} article${success !== 1 ? 's' : ''} fetched and saved.${failed > 0 ? ` ${failed} failed.` : ''}`)
      }
      loadData()
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error'
      setFetchResult(`Fetch failed: ${msg}`)
    }
    setFetchLoading(false)
  }

  const handlePublish = async (id) => {
    await adminPublish(id)
    loadData()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this article?')) {
      await adminDelete(id)
      loadData()
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}>Admin Panel</h1>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid #e0dbd4', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
          View Site
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total', value: stats.total, color: '#3498db' },
            { label: 'Published', value: stats.published, color: '#27ae60' },
            { label: 'Drafts', value: stats.drafts, color: '#f39c12' },
            { label: 'AI Rewritten', value: stats.aiRewritten, color: '#9b59b6' }
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px', padding: '1.2rem', borderTop: '3px solid ' + stat.color }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Fetch New Articles</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={fetchCategory} onChange={e => setFetchCategory(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid #e0dbd4', borderRadius: '4px', fontSize: '0.9rem' }}>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button onClick={handleFetch} disabled={fetchLoading} style={{ background: fetchLoading ? '#999' : '#c0392b', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '4px', cursor: fetchLoading ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
            {fetchLoading ? 'Fetching and rewriting...' : 'Fetch News'}
          </button>
          {fetchResult && <span style={{ fontSize: '0.85rem', color: '#555' }}>{fetchResult}</span>}
        </div>
        {fetchLoading && (
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.8rem' }}>
            AI is rewriting each article. This takes 1 to 3 minutes. Please wait.
          </p>
        )}
      </div>

      <div style={{ borderBottom: '2px solid #e0dbd4', marginBottom: '1.5rem', display: 'flex' }}>
        {['drafts','published'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.6rem 1.5rem', border: 'none', background: activeTab === tab ? '#1a1a1a' : 'transparent', color: activeTab === tab ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>
            {tab} ({tab === 'drafts' ? drafts.length : published.length})
          </button>
        ))}
      </div>

      <div>
        {(activeTab === 'drafts' ? drafts : published).map(article => (
          <div key={article._id} style={{ background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px', padding: '1rem 1.2rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.3rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                {article.title}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#999' }}>
                {article.category} - {new Date(article.fetchedAt).toLocaleString()} {article.aiRewritten ? ' - AI Rewritten' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {activeTab === 'drafts' && (
                <button onClick={() => handlePublish(article._id)} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Publish
                </button>
              )}
              <button onClick={() => navigate('/article/' + article._id)} style={{ background: 'none', border: '1px solid #e0dbd4', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                Preview
              </button>
              <button onClick={() => handleDelete(article._id)} style={{ background: '#fdf0ef', color: '#c0392b', border: '1px solid #f5c6c1', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {(activeTab === 'drafts' ? drafts : published).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999', background: '#fff', border: '1px solid #e0dbd4', borderRadius: '4px' }}>
            {activeTab === 'drafts' ? 'No drafts. Click Fetch News above to get articles.' : 'No published articles yet.'}
          </div>
        )}
      </div>

    </div>
  )
}
