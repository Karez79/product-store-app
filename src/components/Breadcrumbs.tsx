import { memo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useProductStore } from '@/store/productStore'

export const Breadcrumbs = memo(function Breadcrumbs() {
  const location = useLocation()
  const params = useParams()
  const products = useProductStore((state) => state.products)
  const customProducts = useProductStore((state) => state.customProducts)

  const pathSegments = location.pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) return null

  const getBreadcrumbLabel = (segment: string, index: number): string => {
    if (segment === 'products') return 'Products'
    if (segment === 'create-product') return 'Create Product'

    if (params.id) {
      const allProducts = [...products, ...customProducts]
      const product = allProducts.find((p) => p.id.toString() === params.id)
      return product?.title || `Product #${params.id}`
    }

    return segment
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <Link
        to="/products"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`
        const isLast = index === pathSegments.length - 1
        const label = getBreadcrumbLabel(segment, index)

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground line-clamp-1">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="hover:text-foreground transition-colors line-clamp-1"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
})
