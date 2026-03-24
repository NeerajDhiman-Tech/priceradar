'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  image: string
  price: string
  site: string
  url: string
  rating: number
  reviews: string
}

const siteColors: Record<string, string> = {
  'Amazon': '#FF9900',
  'Amazon.in': '#FF9900',
  'Flipkart': '#2874F0',
  'Myntra': '#FF3F6C',
  'Meesho': '#9B2D8E',
  'Croma': '#67B346',
  'Nykaa': '#FC2779',
  'Ajio': '#E31E24',
  'Tata Cliq': '#00A9E0',
  'Cashify': '#00B386',
}

function ProductDetail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const name = searchParams.get('name') || ''
  const image = searchParams.get('image') || ''
  const price = searchParams.get('price') || ''
  const site = searchParams.get('site') || ''
  const [comparisons, setComparisons] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('compare')

  useEffect(() => {
    if (!name) return
    setLoading(true)
    fetch('/api/search?q=' + encodeURIComponent(name))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setComparisons(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [name])

  const sorted = [...comparisons].sort((a, b) => {
    const pa = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
    const pb = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0')
    return pa - pb
  })

  const lowest = sorted[0]
  const highest = sorted[sorted.length - 1]

  const savings = (lowest && highest) ? (() => {
    const lo = parseFloat(lowest.price?.replace(/[^0-9.]/g, '') || '0')
    const hi = parseFloat(highest.price?.replace(/[^0-9.]/g, '') || '0')
    return hi > lo ? Math.round(hi - lo) : 0
  })() : 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push('/search?q=' + encodeURIComponent(query))
  }

  const getBuyLink = (p: Product) => {
    if (p.url && p.url !== '#' && p.url !== 'undefined' && p.url.startsWith('http')) {
      return p.url
    }
    return 'https://www.google.com/search?q=' + encodeURIComponent(p.name + ' buy ' + p.site)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      <nav style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', textDecoration: 'none' }}>PriceRadar</Link>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 600 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search any product..."
              style={{ flex: 1, padding: '10px 16px', fontSize: 14, color: '#0f172a', borderRadius: '10px 0 0 10px', border: 'none', outline: 'none' }} />
            <button type="submit" style={{ background: '#f59e0b', color: '#0f172a', padding: '10px 20px', fontWeight: 700, border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer' }}>Search</button>
          </form>
          <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Login</Link>
          <Link href="/register" style={{ background: '#f59e0b', color: '#0f172a', padding: '8px 16px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>Register</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>

        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#475569', marginBottom: 24, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <button onClick={() => router.back()} style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}>Back</button>
          <span>/</span>
          <span style={{ color: '#64748b' }}>{name.substring(0, 50)}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, marginBottom: 32 }}>

          <div>
            <div style={{ background: 'white', borderRadius: 16, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, minHeight: 300 }}>
              {image
                ? <img src={decodeURIComponent(image)} alt={name} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />
                : <div style={{ color: '#94a3b8', fontSize: 60 }}>?</div>
              }
            </div>
            {lowest && (
              <a href={getBuyLink(lowest)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', background: '#f59e0b', color: '#0f172a', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, textAlign: 'center', textDecoration: 'none', marginBottom: 10 }}>
                Buy at {lowest.site} for {lowest.price}
              </a>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.3 }}>{name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, marginBottom: 4 }}>LOWEST</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#4ade80' }}>{lowest?.price || price}</div>
                <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>{lowest?.site || site}</div>
              </div>
              <div style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, marginBottom: 4 }}>HIGHEST</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f87171' }}>{highest?.price || price}</div>
                <div style={{ fontSize: 11, color: '#7f1d1d', marginTop: 2 }}>{highest?.site || site}</div>
              </div>
              <div style={{ background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, marginBottom: 4 }}>YOU SAVE</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#a78bfa' }}>{savings > 0 ? 'Rs.' + savings.toLocaleString() : 'N/A'}</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>SITES</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>{loading ? '...' : comparisons.length}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['compare', 'details'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: activeTab === tab ? '#f59e0b' : '#1e293b', color: activeTab === tab ? '#0f172a' : '#94a3b8' }}>
                  {tab === 'compare' ? 'Price Comparison' : 'Product Details'}
                </button>
              ))}
            </div>

            {activeTab === 'compare' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Live Price Comparison</div>
                  <div style={{ background: '#166534', color: '#4ade80', fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>LIVE</div>
                </div>
                {loading ? (
                  <div style={{ padding: 20 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #1e293b' }}>
                        <div style={{ height: 12, width: 150, background: '#1e293b', borderRadius: 4 }}></div>
                        <div style={{ height: 20, width: 80, background: '#1e293b', borderRadius: 4 }}></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {sorted.map((p, i) => {
                      const isLowest = i === 0
                      const color = siteColors[p.site] || '#f59e0b'
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #1e293b', background: isLowest ? 'rgba(74,222,128,0.05)' : 'transparent' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: isLowest ? '#f59e0b' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: isLowest ? '#0f172a' : '#64748b', flexShrink: 0 }}>
                              {i + 1}
                            </div>
                            {p.image && (
                              <div style={{ width: 48, height: 48, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                                <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: color }}>{p.site}</div>
                                {isLowest && <span style={{ background: '#166534', color: '#4ade80', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>CHEAPEST</span>}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{p.name}</div>
                              {p.rating && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>★ {p.rating} · {p.reviews} reviews</div>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                            <div style={{ fontSize: 20, fontWeight: 900, color: isLowest ? '#4ade80' : '#f59e0b' }}>{p.price}</div>
                            <a href={getBuyLink(p)} target="_blank" rel="noopener noreferrer"
                              style={{ background: isLowest ? '#f59e0b' : color, color: '#fff', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                              Buy Now
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Product Information</h3>
                {[
                  { label: 'Product Name', value: name },
                  { label: 'Best Price', value: lowest?.price || price },
                  { label: 'Available On', value: comparisons.map(c => c.site).join(', ') },
                  { label: 'Total Sites', value: comparisons.length + ' sites' },
                  { label: 'Max Savings', value: savings > 0 ? 'Rs.' + savings.toLocaleString() : 'N/A' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', borderBottom: '1px solid #1e293b', paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ width: 160, color: '#64748b', fontSize: 13, flexShrink: 0 }}>{item.label}</div>
                    <div style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!loading && sorted.length > 0 && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>Direct Buy Links — All Sites</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {sorted.map((p, i) => {
                const color = siteColors[p.site] || '#f59e0b'
                const isLowest = i === 0
                return (
                  <a key={i} href={getBuyLink(p)} target="_blank" rel="noopener noreferrer"
                    style={{ background: '#0a0a0f', border: '2px solid ' + (isLowest ? '#4ade80' : color + '44'), borderRadius: 12, padding: 16, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: color }}>{p.site}</div>
                      {isLowest && <span style={{ background: '#166534', color: '#4ade80', fontSize: 10, padding: '2px 6px', borderRadius: 20, fontWeight: 700 }}>BEST</span>}
                    </div>
                    {p.image && (
                      <div style={{ background: 'white', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
                        <img src={p.image} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLowest ? '#4ade80' : '#f59e0b' }}>{p.price}</div>
                    {p.rating && <div style={{ fontSize: 11, color: '#64748b' }}>★ {p.rating} ({p.reviews})</div>}
                    <div style={{ background: color, color: '#fff', textAlign: 'center', padding: '8px', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                      Buy on {p.site}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: 20 }}>Loading...</p>
      </div>
    }>
      <ProductDetail />
    </Suspense>
  )
}
