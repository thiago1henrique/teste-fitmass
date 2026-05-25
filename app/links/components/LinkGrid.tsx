import { LinkCard } from './LinkCard'
import { CategoryHeader } from './CategoryHeader'
import { EmptyState } from './EmptyState'
import { AppsSection } from './AppsSection'
import type { CategoryNode } from './AppsSection'

export type { CategoryNode }

export function LinkGrid({ tree }: { tree: CategoryNode[] }) {
  if (tree.length === 0) return <EmptyState />

  return (
    <div className="flex flex-col gap-2 w-full">
      {tree.map((node) => (
        <div key={node.id} className="flex flex-col gap-2">
          <CategoryHeader category={node} />
          {node.children.length > 0 ? (
            <AppsSection category={node} />
          ) : (
            node.links.map((link) => <LinkCard key={link.id} link={link} />)
          )}
        </div>
      ))}
    </div>
  )
}
