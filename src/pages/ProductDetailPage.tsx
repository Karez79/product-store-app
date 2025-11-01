import { useEffect, useState, useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Trash2, Edit } from 'lucide-react'
import { useProductStore } from '@/store/productStore'
import { productsApi } from '@/api/products'
import type { ProductWithState } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PageLoader } from '@/components/ui/spinner'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export const ProductDetailPage = memo(function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const toggleLike = useProductStore((state) => state.toggleLike)
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  const likedIds = useProductStore((state) => state.likedIds)

  const [product, setProduct] = useState<ProductWithState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())
  const [imgLoaded, setImgLoaded] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const productId = parseInt(id)

        if (productId < 0) {
          const customProducts = useProductStore.getState().customProducts
          const customProduct = customProducts.find((p) => p.id === productId)
          if (customProduct) {
            setProduct(customProduct)
          } else {
            setError('Product not found')
          }
        } else {
          const currentLikedIds = useProductStore.getState().likedIds
          const apiProduct = await productsApi.getById(productId)
          setProduct({
            ...apiProduct,
            liked: currentLikedIds.has(productId),
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (product) {
      await deleteProduct(product.id)
      setShowDeleteDialog(false)
      navigate('/products')
    }
  }, [product, deleteProduct, navigate])

  const handleLikeToggle = useCallback(() => {
    if (product) {
      toggleLike(product.id)
    }
  }, [product, toggleLike])

  const handleImageError = useCallback((index: number) => {
    setImgErrors((prev) => new Set(prev).add(index))
    setImgLoaded((prev) => new Set(prev).add(index))
  }, [])

  const handleImageLoad = useCallback((index: number) => {
    setImgLoaded((prev) => new Set(prev).add(index))
  }, [])

  const handleBackClick = useCallback(() => {
    navigate(-1)
  }, [navigate])

  if (loading) {
    return <PageLoader />
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">{error || 'Product not found'}</p>
        <Button className="mt-4" onClick={handleBackClick}>
          Back to Products
        </Button>
      </div>
    )
  }

  const isLiked = likedIds.has(product.id)
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail]

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0 relative">
              {!imgLoaded.has(currentImageIndex) && !imgErrors.has(currentImageIndex) && (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center rounded-lg z-10">
                  <div className="text-6xl text-muted-foreground/30">⏳</div>
                </div>
              )}
              {imgErrors.has(currentImageIndex) ? (
                <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 rounded-lg">
                  <div className="text-center p-8">
                    <div className="text-9xl mb-4">📦</div>
                    <p className="text-lg text-muted-foreground">{product.title}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className={`w-full aspect-square object-cover rounded-lg transition-opacity duration-300 ${
                    imgLoaded.has(currentImageIndex) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={() => handleImageError(currentImageIndex)}
                  onLoad={() => handleImageLoad(currentImageIndex)}
                />
              )}
            </CardContent>
          </Card>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 relative ${
                    index === currentImageIndex
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  {!imgLoaded.has(index) && !imgErrors.has(index) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center z-10">
                      <div className="text-xs">⏳</div>
                    </div>
                  )}
                  {imgErrors.has(index) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-2xl">📦</div>
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imgLoaded.has(index) ? 'opacity-100' : 'opacity-0'
                      }`}
                      onError={() => handleImageError(index)}
                      onLoad={() => handleImageLoad(index)}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex gap-2">
                {product.isCustom && (
                  <Link to={`/create-product?edit=${product.id}`}>
                    <Button size="icon" variant="outline">
                      <Edit className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleLikeToggle}
                  className={isLiked ? 'text-red-500' : ''}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDeleteClick}
                  className="text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge>{product.category}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
              {product.isCustom && <Badge variant="secondary">Custom</Badge>}
            </div>

            <p className="text-4xl font-bold mb-4">${product.price}</p>

            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <span className="text-xl font-semibold">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {!product.isCustom && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="text-2xl font-bold">{product.stock}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="text-2xl font-bold">{product.discountPercentage}%</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  )
})
