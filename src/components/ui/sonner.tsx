'use client'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-text-primary group-[.toaster]:border-border-default group-[.toaster]:shadow-md',
          description: 'group-[.toast]:text-text-secondary',
          actionButton: 'group-[.toast]:bg-navy group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-bg-secondary group-[.toast]:text-text-secondary',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
