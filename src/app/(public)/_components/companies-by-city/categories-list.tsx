'use client'

import { DraggableScroll } from '@/components/app/draggable-scroll'
import { CategoryItem } from './category-item'

type CategoriesItemProps = {
  categories: {
    name: string
    id: string
    icon: string | null
    _count: {
      companies: number
    }
  }[]
}

export function CategoriesList({ categories }: CategoriesItemProps) {
  return (
    <DraggableScroll className="scroll-hidden mask-r-from-80% gap-2 pb-2">
      {categories.map(category => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </DraggableScroll>
  )
}
