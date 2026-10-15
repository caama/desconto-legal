import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search')?.trim() || ''
  const perPage = Math.min(Math.max(Number(searchParams.get('perPage')) || 10, 1), 50)
  // Aba do painel: ativos (padrão) ou inativos (inactive guarda a data da inativação)
  const isActive = searchParams.get('status') !== 'inactive'

  // Um único campo de busca procura no nome e no e-mail
  const filters = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  try {
    const [users, activeCount, inactiveCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...filters,
          inactive: isActive ? null : { not: null },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          inactive: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where: { ...filters, inactive: null } }),
      prisma.user.count({ where: { ...filters, inactive: { not: null } } }),
    ])

    const total = isActive ? activeCount : inactiveCount

    if (!users) {
      return NextResponse.json({ error: 'Usuários não encontrados.' }, { status: 404 })
    }

    return NextResponse.json({ users, total, activeCount, inactiveCount }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Houve um erro ao obter todos os usuários.' }, { status: 500 })
  }
}
