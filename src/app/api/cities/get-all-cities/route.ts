import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search')?.trim() || ''
  const perPage = Math.min(Math.max(Number(searchParams.get('perPage')) || 10, 1), 50)
  // Aba do painel: ativas (padrão) ou inativas
  const isActive = searchParams.get('status') !== 'inactive'

  const filters = {
    name: search ? { contains: search, mode: 'insensitive' as const } : undefined,
  }

  try {
    const [cities, activeCount, inactiveCount] = await Promise.all([
      prisma.city.findMany({
        where: {
          ...filters,
          active: isActive,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          isThirst: true,
          active: true,
          createdAt: true,
          _count: { select: { companies: true } },
        },
        orderBy: [{ isThirst: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.city.count({ where: { ...filters, active: true } }),
      prisma.city.count({ where: { ...filters, active: false } }),
    ])

    const total = isActive ? activeCount : inactiveCount

    if (!cities) {
      return NextResponse.json({ error: 'Cidades não encontradas.' }, { status: 404 })
    }

    return NextResponse.json({ cities, total, activeCount, inactiveCount }, { status: 200 })
  } catch (err) {
    console.log(err)
    throw NextResponse.json({ error: 'Erro ao buscar cidades' }, { status: 500 })
  }
}
