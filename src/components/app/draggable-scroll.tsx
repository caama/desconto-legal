'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ComponentProps, type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type DraggableScrollProps = ComponentProps<'div'> & {
  showArrows?: boolean
}

const DRAG_THRESHOLD = 5
const SCROLL_AMOUNT = 320

export function DraggableScroll({ className, showArrows = false, children, ...props }: DraggableScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const hasDragged = useRef(false)

  const checkScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const isMobile = window.innerWidth < 640
    const scrollAmount = isMobile ? el.clientWidth : SCROLL_AMOUNT
    const amount = direction === 'left' ? -scrollAmount : scrollAmount
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    setIsDragging(true)
    hasDragged.current = false
    startX.current = e.pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return
      e.preventDefault()

      const el = ref.current
      if (!el) return

      const x = e.pageX - el.offsetLeft
      const walk = x - startX.current

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        hasDragged.current = true
      }

      el.scrollLeft = scrollLeft.current - walk
    },
    [isDragging]
  )

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    const el = ref.current
    if (el) el.style.cursor = 'grab'
  }, [])

  const onClickCapture = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (hasDragged.current) {
      e.stopPropagation()
      e.preventDefault()
      hasDragged.current = false
    }
  }, [])

  return (
    <div className="relative flex flex-col">
      {/* Mobile arrows - above the cards */}
      {showArrows && (canScrollLeft || canScrollRight) && (
        <div className="mb-3 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            disabled={!canScrollLeft}
            className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-background/90 text-primary shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-30"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            disabled={!canScrollRight}
            className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-background/90 text-primary shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-30"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      <div className="relative">
        {/* Desktop arrows - overlapping on the sides */}
        {showArrows && canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className="-translate-y-1/2 -left-4 absolute top-1/2 z-10 hidden size-9 items-center justify-center rounded-full border border-primary/20 bg-background/90 text-primary shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground sm:flex"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* biome-ignore lint/a11y/noStaticElementInteractions: <false> */}
        <div
          {...props}
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClickCapture={onClickCapture}
          className={cn(
            'flex w-full max-w-full cursor-grab touch-pan-x select-none overflow-x-auto overflow-y-hidden overscroll-x-contain',
            isDragging && 'cursor-grabbing',
            className
          )}
        >
          {children}
        </div>

        {/* Desktop arrows - overlapping on the sides */}
        {showArrows && canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className="-translate-y-1/2 -right-4 absolute top-1/2 z-10 hidden size-9 items-center justify-center rounded-full border border-primary/20 bg-background/90 text-primary shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground sm:flex"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}
