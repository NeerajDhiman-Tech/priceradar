'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    image: string
    brand: string
    prices: { site: string; price: number; url: string }[]
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/wishlist')
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const removeItem = async (productName: string) => {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName })
    })
    setItems(items.filter(i => i.product.name !== productName))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: '#0f172a', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', textDecoration: 'none' }}>PriceRadar</Link>
        <div style={{ flex: 1 }}></div>
        <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Login</Link>
        <Link href="/register" style={{ background: '#f59e0b', color: '#0f172a', padding: '7px 16px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>Register</Link>
      </nav>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>My Wishlist</h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Products you are tracking</p>
        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>}
        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>♡</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Your wishlist is empty</p>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Search for products and add them to your wishlist</p>
            <Link href="/" style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Start Shopping</Link>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map((item, i) => {
            const lowestPrice = item.product.prices.sort((a, b) => a.price - b.price)[0]
            return (
              <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 180, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, position: 'relative' }}>
                  {item.product.image
                    ? <img src={item.product.image} alt={item.product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    : <div style={{ fontSize: 40, color: '#94a3b8' }}>?</div>
                  }
                  <button onClick={() => removeItem(item.product.name)}
                    style={{ position: 'absolute', top: 8, right: 8, background: '#fee2e2', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#dc2626', fontSize: 14, fontWeight: 700 }}>
                    x
                  </button>
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {item.product.name}
                  </p>
                  {lowestPrice && (
                    <div style={{ color: '#16a34a', fontSize: 18, fontWeight: 900, marginBottom: 4 }}>
                      Rs.{lowestPrice.price.toLocaleString()}
                    </div>
                  )}
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10 }}>on {item.product.brand}</div>
                  <button onClick={() => router.push('/product?name=' + encodeURIComponent(item.product.name) + '&site=' + encodeURIComponent(item.product.brand || '') + '&image=' + encodeURIComponent(item.product.image || '') + '&price=' + encodeURIComponent('Rs.' + (lowestPrice?.price || 0)) + '&url=')}
                    style={{ width: '100%', background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                    Compare Prices
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
