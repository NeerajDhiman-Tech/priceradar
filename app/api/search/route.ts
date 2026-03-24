import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json([])

  try {
    const apiKey = process.env.SERPAPI_KEY
    const url = 'https://serpapi.com/search.json?engine=google_shopping&q=' + encodeURIComponent(q) + '&api_key=' + apiKey + '&gl=in&hl=en&num=40'

    const response = await fetch(url, { cache: 'no-store' })
    const data = await response.json()

    if (data.error) {
      console.error('SerpAPI error:', data.error)
      return NextResponse.json({ error: data.error }, { status: 500 })
    }

    if (!data.shopping_results || data.shopping_results.length === 0) {
      return NextResponse.json([])
    }

    const products = data.shopping_results.map((item: any, index: number) => ({
      id: item.product_id || String(index),
      name: item.title || 'Unknown Product',
      image: item.thumbnail || '',
      price: item.price || 'Price not available',
      old_price: item.extracted_price || null,
      site: item.source || 'Unknown',
      url: item.link || item.product_link || '',
      rating: item.rating || null,
      reviews: item.reviews ? String(item.reviews) : null,
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
