import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Login required' }, { status: 401 })
    const { productName, productImage, productPrice, productSite, productUrl, targetPrice } = await req.json()
    let user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    let product = await prisma.product.findFirst({ where: { name: productName } })
    if (!product) {
      product = await prisma.product.create({
        data: { name: productName, category: 'General', image: productImage, brand: productSite }
      })
      await prisma.price.create({
        data: { site: productSite, price: parseFloat(productPrice?.replace(/[^0-9.]/g, '') || '0'), url: productUrl || '', productId: product.id }
      })
    }
    const alert = await prisma.alert.create({
      data: { userId: user.id, productId: product.id, targetPrice: parseFloat(targetPrice) }
    })
    return NextResponse.json({ success: true, alert })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Login required' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json([])
    const alerts = await prisma.alert.findMany({
      where: { userId: user.id },
      include: { product: { include: { prices: true } } }
    })
    return NextResponse.json(alerts)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
