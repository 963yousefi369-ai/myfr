import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-navy text-white shadow-sm',
        secondary:   'border-transparent bg-bg-secondary text-text-secondary',
        success:     'border-transparent bg-success/10 text-success border-success/20',
        warning:     'border-transparent bg-amber/10 text-amber border-amber/20',
        destructive: 'border-transparent bg-error/10 text-error border-error/20',
        outline:     'border-border-default text-text-primary',
        gradient:    'border-transparent bg-gradient-to-l from-navy to-teal text-white shadow-sm',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
