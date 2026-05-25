import { Badge } from './Badge'
import type { Category } from '../data'

export function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="flex justify-center pt-6 pb-2">
      <Badge>{category.name}</Badge>
    </div>
  )
}
