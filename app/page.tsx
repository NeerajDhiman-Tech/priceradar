'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

const categories = [
  { name: 'Mobiles', q: 'mobile phone india' },
  { name: 'Laptops', q: 'laptop india' },
  { name: 'TVs', q: 'LED TV india' },
  { name: 'Headphones', q: 'headphones india' },
  { name: 'Cameras', q: 'digital camera india' },
  { name: 'Tablets', q: 'tablet india' },
  { name: 'Watches', q: 'smart watch india' },
  { name: 'Fashion', q: 'clothing india' },
  { name: 'Shoes', q: 'shoes india' },
  { name: 'Appliances', q: 'home appliances india' },
]

const sites = [
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Myntra', color: '#FF3F6C' },
  { name: 'Meesho', color: '#9B2D8E' },
  { name: 'Croma', color: '#67B346' },
  { name: 'Nykaa', color: '#FC2779' },
  { name: 'Ajio', color: '#E31E24' },
  { name: 'Tata Cliq', color: '#00A9E0' },
]

function ProductCard({ product, onClick }: { product: Product, onClick: () => void }) {
  return (
    <div onClick={onClick}
      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
      <div style={{ height: 180, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, position: 'relative' }}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          : <div style={{ color: '#94a3b8', fontSize: 32 }}>?</div>
        }
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(15,23,42,0.85)', color: '#f59e0b', fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>
          {product.site}
        </div>
      </div>
      <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {product.name}
        </p>
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ color: '#f59e0b', fontSize: 11 }}>{'★'.repeat(Math.round(product.rating || 0))}</span>
            <span style={{ color: '#64748b', fontSize: 11 }}>{product.rating}</span>
          </div>
        )}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 900 }}>{product.price}</div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>on {product.site}</div>
        </div>
        <div style={{ marginTop: 10, background: '#f59e0b', color: '#0f172a', fontSize: 12, textAlign: 'center' as const, padding: '8px', borderRadius: 8, fontWeight: 700 }}>
          Compare All Prices
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/search?q=best+sellers+india+2024')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTrendingProducts(data.slice(0, 10)); setLoadingTrending(false) })
      .catch(() => setLoadingTrending(false))

    fetch('/api/search?q=top+deals+electronics+india')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFeaturedProducts(data.slice(0, 10)); setLoadingFeatured(false) })
      .catch(() => setLoadingFeatured(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query.trim()))
    }
  }

  const goToProduct = (p: Product) => {
    router.push('/product?name=' + encodeURIComponent(p.name) + '&site=' + encodeURIComponent(p.site) + '&image=' + encodeURIComponent(p.image || '') + '&price=' + encodeURIComponent(p.price) + '&url=' + encodeURIComponent(p.url || ''))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ background: '#0f172a', padding: '6px 24px', fontSize: 12, color: '#64748b' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <span>India best price comparison — Compare across 34+ sites</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/register" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>Register Free</Link>
          </div>
        </div>
      </div>

      <nav style={{ background: '#0f172a', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', height: 70, display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: '#f59e0b', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>P</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>PriceRadar</div>
              <div style={{ fontSize: 9, color: '#64748b', letterSpacing: 1 }}>COMPARE PRICES</div>
            </div>
          </Link>

          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 700 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              style={{ flex: 1, padding: '12px 16px', fontSize: 14, color: '#0f172a', border: 'none', outline: 'none', background: 'white', borderRadius: '10px 0 0 10px' }}
            />
            <button type="submit"
              style={{ background: '#f59e0b', color: '#0f172a', padding: '0 24px', fontWeight: 800, border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer', fontSize: 15 }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Login</Link>
            <Link href="/register" style={{ background: '#f59e0b', color: '#0f172a', padding: '8px 18px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>Register</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', overflowX: 'auto' as const }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 4, padding: '6px 0' }}>
            {categories.map(c => (
              <button key={c.name}
                onClick={() => router.push('/search?q=' + encodeURIComponent(c.q))}
                style={{ padding: '6px 16px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', borderRadius: 6, whiteSpace: 'nowrap' as const }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#f59e0b'; (e.target as HTMLElement).style.background = '#1e293b' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#94a3b8'; (e.target as HTMLElement).style.background = 'transparent' }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', padding: '60px 24px', textAlign: 'center' as const }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 13, padding: '6px 16px', borderRadius: 20, marginBottom: 20, fontWeight: 600 }}>
            Compare prices across 34+ Indian shopping sites instantly
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1, color: 'white' }}>
            Never Overpay<br />
            <span style={{ color: '#f59e0b' }}>Ever Again</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, margin: '0 0 32px' }}>
            Real-time prices from Amazon, Flipkart, Myntra, Croma and 30+ more
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: 600, margin: '0 auto 24px' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Try: iPhone 15, Samsung TV, Nike shoes..."
              style={{ flex: 1, padding: '16px 20px', fontSize: 15, color: '#0f172a', borderRadius: '12px 0 0 12px', border: 'none', outline: 'none' }}
            />
            <button type="submit"
              style={{ background: '#f59e0b', color: '#0f172a', padding: '16px 28px', fontWeight: 800, border: 'none', borderRadius: '0 12px 12px 0', cursor: 'pointer', fontSize: 16 }}>
              Compare
            </button>
          </form>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M3', 'Sony Headphones', 'Nike Air Max', 'Books'].map(t => (
              <button key={t}
                onClick={() => router.push('/search?q=' + encodeURIComponent(t))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#f59e0b' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#94a3b8' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#f59e0b', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' as const }}>
          {[{ val: '34+', label: 'Sites Tracked' }, { val: '2.4M+', label: 'Products' }, { val: 'Rs.12K', label: 'Avg. Savings' }, { val: '15min', label: 'Price Updates' }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#713f12', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0f172a', padding: '16px 24px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p style={{ color: '#475569', fontSize: 11, textAlign: 'center' as const, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' as const }}>We compare prices from</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {sites.map(s => (
              <button key={s.name}
                onClick={() => router.push('/search?q=' + encodeURIComponent(s.name))}
                style={{ background: '#1e293b', border: '1px solid ' + s.color + '44', borderRadius: 8, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}></div>
                <span style={{ color: s.color, fontSize: 13, fontWeight: 700 }}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Trending Right Now</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Live products from across all sites</p>
          </div>
          <button onClick={() => router.push('/search?q=trending+best+sellers+india')}
            style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            View All
          </button>
        </div>
        {loadingTrending ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ height: 180, background: '#f1f5f9' }}></div>
                <div style={{ padding: 12 }}>
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ height: 16, background: '#f1f5f9', borderRadius: 4, width: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {trendingProducts.map((p, i) => <ProductCard key={i} product={p} onClick={() => goToProduct(p)} />)}
          </div>
        )}
      </div>

      <div style={{ background: '#0f172a', padding: '32px 24px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Best Deals Today</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Lowest prices right now</p>
            </div>
            <button onClick={() => router.push('/search?q=best+deals+electronics+india')}
              style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              View All
            </button>
          </div>
          {loadingFeatured ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
                  <div style={{ height: 180, background: '#334155' }}></div>
                  <div style={{ padding: 12 }}>
                    <div style={{ height: 10, background: '#334155', borderRadius: 4, marginBottom: 8 }}></div>
                    <div style={{ height: 16, background: '#334155', borderRadius: 4, width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {featuredProducts.map((p, i) => <ProductCard key={i} product={p} onClick={() => goToProduct(p)} />)}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {categories.map(c => (
            <button key={c.name}
              onClick={() => router.push('/search?q=' + encodeURIComponent(c.q))}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 12px', textAlign: 'center' as const, cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget).style.borderColor = '#f59e0b'; (e.currentTarget).style.background = '#fffbeb' }}
              onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = 'white' }}>
              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: 14 }}>{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' as const }}>
          <h2 style={{ margin: '0 0 40px', fontSize: 28, fontWeight: 800, color: 'white' }}>How PriceRadar Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { num: '1', title: 'Search', desc: 'Type any product name' },
              { num: '2', title: 'We Scan', desc: 'We check 34+ Indian sites instantly' },
              { num: '3', title: 'Compare', desc: 'See all prices side by side' },
              { num: '4', title: 'Save', desc: 'Buy cheapest and save money' },
            ].map(h => (
              <div key={h.num}>
                <div style={{ width: 56, height: 56, background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{h.num}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: 'white' }}>{h.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: '#020617', padding: '40px 24px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', marginBottom: 10 }}>PriceRadar</div>
              <p style={{ color: '#475569', fontSize: 13 }}>India best price comparison. Never overpay again.</p>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Quick Links</div>
              {[['Home', '/'], ['Login', '/login'], ['Register', '/register']].map(([l, h]) => (
                <div key={l} style={{ marginBottom: 6 }}>
                  <Link href={h} style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Categories</div>
              {['Mobiles', 'Laptops', 'TVs', 'Fashion', 'Shoes'].map(l => (
                <div key={l} style={{ marginBottom: 6 }}>
                  <button onClick={() => router.push('/search?q=' + l)} style={{ color: '#475569', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', padding: 0 }}>{l}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 10, fontSize: 14 }}>We Compare</div>
              {sites.slice(0, 5).map(s => (
                <div key={s.name} style={{ marginBottom: 6, color: '#475569', fontSize: 13 }}>{s.name}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: 16, textAlign: 'center' as const, color: '#334155', fontSize: 13 }}>
            2024 PriceRadar. Built with love in India.
          </div>
        </div>
      </footer>

    </div>
  )
}
