'use server'

import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search')?.trim() || ''
  const perPage = Math.min(Math.max(Number(searchParams.get('perPage')) || 10, 1), 50)
  const city = searchParams.get('city') || ''
  // Aba da listagem do painel: ativas (padrão) ou inativas
  const isActive = searchParams.get('status') !== 'inactive'

  const filters = {
    name: search ? { contains: search, mode: 'insensitive' as const } : undefined,
    city: city
      ? {
          name: {
            contains: city,
            mode: 'insensitive' as const,
          },
        }
      : undefined,
  }

  try {
    const [companies, activeCount, inactiveCount] = await Promise.all([
      prisma.company.findMany({
        where: {
          ...filters,
          active: isActive,
        },
        select: {
          id: true,
          name: true,
          email: true,
          logoUrl: true,
          contractStart: true,
          contractEnd: true,
          slug: true,
          city: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          whatsapp: true,
          active: true,
          featured: true,
        },
        orderBy: [{ featured: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.company.count({ where: { ...filters, active: true } }),
      prisma.company.count({ where: { ...filters, active: false } }),
    ])

    const total = isActive ? activeCount : inactiveCount

    if (!companies) {
      return NextResponse.json({ error: 'Nenhuma empresa encontrada.' }, { status: 404 })
    }

    return NextResponse.json({ companies, total, activeCount, inactiveCount }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Houve um erro ao obter todas as empresas.' }, { status: 500 })
  }
}
