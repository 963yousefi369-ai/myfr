'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface AfiPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function AfiPagination({ currentPage, totalPages, onPageChange }: AfiPaginationProps) {
  if (totalPages <= 1) return null

  const getPages = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <Pagination dir="rtl">
      <PaginationContent className="gap-1.5">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={cn(
              'rounded-xl transition-all duration-200',
              currentPage === 1
                ? 'pointer-events-none opacity-40'
                : 'cursor-pointer hover:bg-navy/5 hover:text-navy hover:border-navy/30 active:scale-95'
            )}
          />
        </PaginationItem>
        {getPages().map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className={cn(
                  'cursor-pointer rounded-xl transition-all duration-200 min-w-[40px]',
                  page === currentPage
                    ? 'bg-gradient-to-l from-navy to-navy-dark text-white border-0 shadow-navy font-bold'
                    : 'hover:bg-navy/5 hover:text-navy hover:border-navy/30 active:scale-95'
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={cn(
              'rounded-xl transition-all duration-200',
              currentPage === totalPages
                ? 'pointer-events-none opacity-40'
                : 'cursor-pointer hover:bg-navy/5 hover:text-navy hover:border-navy/30 active:scale-95'
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
