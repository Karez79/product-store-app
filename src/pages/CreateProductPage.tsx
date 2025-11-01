import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useProductStore } from '@/store/productStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(2, 'Category is required'),
  brand: z.string().min(2, 'Brand is required'),
  thumbnail: z.string().url('Must be a valid URL'),
})

type ProductFormData = z.infer<typeof productSchema>

export function CreateProductPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const { createProduct, updateProduct, customProducts } = useProductStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (editId) {
      const productId = parseInt(editId)
      const product = customProducts.find((p) => p.id === productId)
      if (product) {
        reset({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          thumbnail: product.thumbnail,
        })
      }
    }
  }, [editId, customProducts, reset])

  const onSubmit = (data: ProductFormData) => {
    if (editId) {
      updateProduct(parseInt(editId), data)
    } else {
      createProduct(data)
    }
    navigate('/products')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {editId ? 'Edit Product' : 'Create New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Enter product description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., Electronics"
                />
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">
                Thumbnail URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="thumbnail"
                {...register('thumbnail')}
                placeholder="https://example.com/image.jpg"
              />
              {errors.thumbnail && (
                <p className="text-sm text-destructive">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editId ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
