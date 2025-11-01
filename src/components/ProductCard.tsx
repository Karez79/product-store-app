import { memo, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useProductActions } from '@/hooks/useProductActions'
import type { ProductWithState } from '@/types/product'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface ProductCardProps {
  product: ProductWithState
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const { toggleLike, deleteProduct } = useProductActions()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleLikeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleLike(product.id)
    },
    [toggleLike, product.id]
  )

  const handleImageError = useCallback(() => {
    setImgError(true)
    setImgLoaded(true)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImgLoaded(true)
  }, [])

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setShowDeleteDialog(true)
    },
    []
  )

  const handleConfirmDelete = useCallback(async () => {
    await deleteProduct(product.id)
    setShowDeleteDialog(false)
  }, [deleteProduct, product.id])

  const truncatedDescription =
    product.description.length > 100
      ? product.description.substring(0, 100) + '...'
      : product.description

  return (
    <>
      <Link to={`/products/${product.id}`} className="block h-full group">
        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center">
                <div className="text-4xl text-muted-foreground/30">⏳</div>
              </div>
            )}
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <div className="text-center p-4">
                  <div className="text-6xl mb-2">📦</div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.title}</p>
                </div>
              </div>
            ) : (
              <img
                src={product.thumbnail}
                alt={product.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
            {product.isCustom && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                Custom
              </Badge>
            )}
          </div>

          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {product.title}
              </h3>
              <div className="flex gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`transition-colors ${
                    product.liked ? 'text-red-500 hover:text-red-600' : ''
                  }`}
                  onClick={handleLikeClick}
                  aria-label={product.liked ? 'Unlike' : 'Like'}
                >
                  <Heart
                    className="h-5 w-5 transition-transform hover:scale-110"
                    fill={product.liked ? 'currentColor' : 'none'}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive/80"
                  onClick={handleDeleteClick}
                  aria-label="Delete product"
                >
                  <Trash2 className="h-5 w-5 transition-transform hover:scale-110" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
              {truncatedDescription}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{product.category}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.rating > 0 && (
              <span className="text-sm text-muted-foreground">
                ⭐ {product.rating.toFixed(1)}
              </span>
            )}
          </CardFooter>
        </Card>
      </Link>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  )
})

