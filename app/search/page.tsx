'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  image: string
  price: string
  old_price: string
  site: string
  url: string
  rating: number
  reviews: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const router = useRouter()
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('Relevance')
  const [priceRange, setPriceRange] = useState('All Prices')
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')
  const [searchInput, setSearchInput] = useState(q)

  useEffect(() => {
    setSearchInput(q)
    if (!q || q.length < 2) return
    setLoading(true)
    setResults([])
    fetch('/api/search?q=' + encodeURIComponent(q))
      .then(r => r.json())
      .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [q])

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0') - parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0')
    if (sortBy === 'Price: High to Low') return parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0') - parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
    if (sortBy === 'Top Rated') return (b.rating || 0) - (a.rating || 0)
    return 0
  }).filter(p => {
    const pr = parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0')
    if (priceRange === 'Under Rs.500' && pr >= 500) return false
    if (priceRange === 'Rs.500-2000' && (pr < 500 || pr > 2000)) return false
    if (priceRange === 'Rs.2000-10000' && (pr < 2000 || pr > 10000)) return false
    if (priceRange === 'Rs.10000-50000' && (pr < 10000 || pr > 50000)) return false
    if (priceRange === 'Above Rs.50000' && pr <= 50000) return false
    return true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const val = searchInput.trim()
    if (val) router.push('/search?q=' + encodeURIComponent(val))
  }

  const goToProduct = (p: Product) => {
    router.push('/product?name=' + encodeURIComponent(p.name) + '&site=' + encodeURIComponent(p.site) + '&image=' + encodeURIComponent(p.image || '') + '&price=' + encodeURIComponent(p.price) + '&url=' + encodeURIComponent(p.url || ''))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      <nav style={{ background: '#0f172a', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', textDecoration: 'none', whiteSpace: 'nowrap' }}>PriceRadar</Link>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 650 }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search any product — iPhone, Samsung TV, Nike shoes..."
              style={{ flex: 1, padding: '10px 16px', fontSize: 14, color: '#0f172a', borderRadius: '8px 0 0 8px', border: 'none', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#f59e0b', color: '#0f172a', padding: '10px 22px', fontWeight: 700, border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: 14 }}>
              Search
            </button>
          </form>
          <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Login</Link>
          <Link href="/register" style={{ background: '#f59e0b', color: '#0f172a', padding: '7px 16px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>Register</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 16px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

        <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', position: 'sticky', top: 80 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>Refine Results</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>Sort by</div>
            {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                <input type="radio" name="sort" checked={sortBy === opt} onChange={() => setSortBy(opt)} style={{ accentColor: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: '#374151' }}>{opt}</span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>Price Range</div>
            {['All Prices', 'Under Rs.500', 'Rs.500-2000', 'Rs.2000-10000', 'Rs.10000-50000', 'Above Rs.50000'].map(pr => (
              <label key={pr} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                <input type="radio" name="price" checked={priceRange === pr} onChange={() => setPriceRange(pr)} style={{ accentColor: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: '#374151' }}>{pr}</span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>Search on Site</div>
            {['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Croma', 'Nykaa'].map(s => (
              <button key={s} onClick={() => router.push('/search?q=' + encodeURIComponent((q || 'products') + ' ' + s))}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '5px 0', background: 'none', border: 'none', fontSize: 13, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
                {s}
              </button>
            ))}
          </div>

          <button onClick={() => { setSortBy('Relevance'); setPriceRange('All Prices') }}
            style={{ width: '100%', padding: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, color: '#374151', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            Clear Filters
          </button>
        </div>

        <div>
          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, background: 'white', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 15, color: '#0f172a' }}>
                <strong>{sorted.length}</strong> results for <strong style={{ color: '#f59e0b' }}>"{q}"</strong>
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: viewMode === 'grid' ? '#0f172a' : 'white', color: viewMode === 'grid' ? 'white' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Grid</button>
                <button onClick={() => setViewMode('list')} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: viewMode === 'list' ? '#0f172a' : 'white', color: viewMode === 'list' ? 'white' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>List</button>
              </div>
            </div>
          )}

          {loading && (
            <div>
              <div style={{ background: 'white', padding: '14px 18px', borderRadius: 10, marginBottom: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, border: '3px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <span style={{ color: '#64748b', fontSize: 14 }}>Searching 34+ sites for <strong>"{q}"</strong>...</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ height: 190, background: '#f1f5f9' }}></div>
                    <div style={{ padding: 12 }}>
                      <div style={{ height: 10, background: '#f1f5f9', borderRadius: 4, marginBottom: 8 }}></div>
                      <div style={{ height: 10, background: '#f1f5f9', borderRadius: 4, width: '70%', marginBottom: 8 }}></div>
                      <div style={{ height: 22, background: '#f1f5f9', borderRadius: 4, width: '45%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {!loading && sorted.length > 0 && viewMode === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
              {sorted.map((p, i) => (
                <div key={i} onClick={() => goToProduct(p)}
                  style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{ height: 190, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      : <div style={{ color: '#94a3b8', fontSize: 36 }}>?</div>
                    }
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(15,23,42,0.9)', color: '#f59e0b', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{p.site}</div>
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#f59e0b', color: '#0f172a', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Compare</div>
                  </div>
                  <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {p.name}
                    </p>
                    {p.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
                        <span style={{ color: '#64748b', fontSize: 11 }}>{p.rating}</span>
                        {p.reviews && <span style={{ color: '#94a3b8', fontSize: 11 }}>({p.reviews})</span>}
                      </div>
                    )}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ color: '#0f172a', fontSize: 20, fontWeight: 900 }}>{p.price}</div>
                      <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>on {p.site}</div>
                    </div>
                    <div style={{ marginTop: 10, background: '#f59e0b', color: '#0f172a', fontSize: 12, textAlign: 'center' as const, padding: '8px', borderRadius: 8, fontWeight: 700 }}>
                      Compare All Site Prices
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sorted.length > 0 && viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((p, i) => (
                <div key={i} onClick={() => goToProduct(p)}
                  style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: 150, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, flexShrink: 0, position: 'relative' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain' }} />
                      : <div style={{ color: '#94a3b8', fontSize: 36 }}>?</div>
                    }
                  </div>
                  <div style={{ padding: 14, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>{p.site}</div>
                      <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 600, margin: '0 0 6px', lineHeight: 1.4 }}>{p.name}</p>
                      {p.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(Math.round(p.rating))}</span>
                          <span style={{ color: '#64748b', fontSize: 12 }}>{p.rating} ({p.reviews})</span>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>{p.price}</div>
                      <div style={{ background: '#f59e0b', color: '#0f172a', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Compare Prices</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && q && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }}>?</div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No results for "{q}"</p>
              <p style={{ color: '#64748b', marginBottom: 20 }}>Try searching with different keywords</p>
              <Link href="/" style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Go Home</Link>
            </div>
          )}

          {!q && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Search for any product</p>
              <p style={{ color: '#64748b', marginBottom: 20 }}>Compare prices from Amazon, Flipkart, Myntra and 30+ more sites</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['iPhone 15', 'Samsung TV', 'Nike Shoes', 'MacBook Air', 'Sony Headphones'].map(t => (
                  <button key={t} onClick={() => router.push('/search?q=' + encodeURIComponent(t))}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#374151', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b', fontSize: 16 }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
