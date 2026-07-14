'use client'

import { cn } from '@/lib/utils'

interface CategoryTagProps {
  label: string
  colorClass: string
  className?: string
}

export default function CategoryTag({ label, colorClass, className }: CategoryTagProps) {
  return (
    <span className={cn('category-tag', colorClass, className)}>
      {label}
    </span>
  )
}
