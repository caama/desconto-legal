'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

type TableSearchProps = {
  placeholder: string
  ariaLabel: string
}

// Busca que filtra enquanto digita; a URL (?search=) só muda após uma pausa, para não consultar a cada tecla
export function TableSearch({ placeholder, ariaLabel }: TableSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const [value, setValue] = useState(search)
  const debouncedValue = useDebounce(value, 400)

  useEffect(() => {
    if (debouncedValue.trim() === search) return

    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue.trim()) params.set('search', debouncedValue.trim())
    else params.delete('search')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }, [debouncedValue, search, searchParams, router])

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        // O texto digitado fica em 16px no mobile (evita o zoom do iOS); só o placeholder diminui
        className="h-9 pr-9 pl-9 placeholder:text-sm [&::-webkit-search-cancel-button]:hidden"
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

// Lê página, linhas por página e busca da URL, e oferece um atualizador de parâmetros
export function useTableParams(pageSizeOptions: number[]) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const perPageParam = Number(searchParams.get('perPage'))
  const perPage = pageSizeOptions.includes(perPageParam) ? perPageParam : 10
  const search = searchParams.get('search') || ''

  function updateParams(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  return {
    page,
    perPage,
    search,
    setPage: (nextPage: number) => updateParams({ page: String(nextPage) }),
    setPerPage: (nextPerPage: number) => updateParams({ perPage: String(nextPerPage), page: '1' }),
  }
}
