import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Login required' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json([])
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { product: { include: { prices: true } } }
    })
    return NextResponse.json(wishlist)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Login required' }, { status: 401 })
    const { productName, productImage, productPrice, productSite, productUrl } = await req.json()
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
    const existing = await prisma.wishlist.findFirst({ where: { userId: user.id, productId: product.id } })
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return NextResponse.json({ added: false, message: 'Removed from wishlist' })
    }
    await prisma.wishlist.create({ data: { userId: user.id, productId: product.id } })
    return NextResponse.json({ added: true, message: 'Added to wishlist' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
