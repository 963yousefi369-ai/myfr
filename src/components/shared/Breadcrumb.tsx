import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface AfiBreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function AfiBreadcrumb({ items }: AfiBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm text-text-secondary">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <Fragment key={idx}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="text-text-primary font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="hover:text-navy transition-colors">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="rotate-180" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
