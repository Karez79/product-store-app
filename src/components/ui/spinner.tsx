import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-primary border-r-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Spinner size="lg" />
          <div className="absolute inset-0 animate-ping">
            <Spinner size="lg" className="opacity-20" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading products...
        </p>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow-sm animate-pulse">
      <div className="aspect-square bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="flex gap-1">
            <div className="h-9 w-9 bg-muted rounded" />
            <div className="h-9 w-9 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="h-8 bg-muted rounded w-24" />
        <div className="h-5 bg-muted rounded w-16" />
      </div>
    </div>
  )
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
