'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Alert {
  id: string
  targetPrice: number
  triggered: boolean
  createdAt: string
  product: {
    name: string
    image: string
    brand: string
    prices: { site: string; price: number }[]
  }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/alerts')
      .then(r => r.json())
      .then(data => { setAlerts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: '#0f172a', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', textDecoration: 'none' }}>PriceRadar</Link>
        <div style={{ flex: 1 }}></div>
        <Link href="/wishlist" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Wishlist</Link>
        <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>Login</Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Price Alerts</h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>You will get email when price drops below your target</p>
        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>}
        {!loading && alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>í´”</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No alerts set</p>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Search for a product and set a target price alert</p>
            <Link href="/" style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Find Products</Link>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.map((alert, i) => {
            const lowestPrice = alert.product.prices.sort((a, b) => a.price - b.price)[0]
            const currentPrice = lowestPrice?.price || 0
            const isTriggered = currentPrice <= alert.targetPrice
            return (
              <div key={i} style={{ background: 'white', border: '1px solid ' + (isTriggered ? '#86efac' : '#e2e8f0'), borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                {alert.product.image && (
                  <div style={{ width: 60, height: 60, background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                    <img src={alert.product.image} alt={alert.product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{alert.product.name}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Target: <strong style={{ color: '#0f172a' }}>Rs.{alert.targetPrice.toLocaleString()}</strong></span>
                    <span style={{ color: '#64748b' }}>Current: <strong style={{ color: isTriggered ? '#16a34a' : '#0f172a' }}>Rs.{currentPrice.toLocaleString()}</strong></span>
                  </div>
                </div>
                <div style={{ background: isTriggered ? '#dcfce7' : '#fef9c3', color: isTriggered ? '#16a34a' : '#713f12', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {isTriggered ? 'Price Dropped!' : 'Watching'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
