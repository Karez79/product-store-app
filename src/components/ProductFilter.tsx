import { useEffect, useState } from 'react'
import { useProductStore } from '@/store/productStore'
import { productsApi } from '@/api/products'
import { Button } from '@/components/ui/button'

interface Category {
  slug: string
  name: string
  url: string
}

export function ProductFilter() {
  const showOnlyLiked = useProductStore((state) => state.showOnlyLiked)
  const setShowOnlyLiked = useProductStore((state) => state.setShowOnlyLiked)
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const filterByCategory = useProductStore((state) => state.filterByCategory)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productsApi.getCategories()
        const parsedCategories = Array.isArray(cats)
          ? cats.slice(0, 8).map((cat) =>
              typeof cat === 'string'
                ? { slug: cat, name: cat, url: '' }
                : cat
            )
          : []
        setCategories(parsedCategories)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={!showOnlyLiked ? 'default' : 'outline'}
          onClick={() => setShowOnlyLiked(false)}
        >
          All Products
        </Button>
        <Button
          variant={showOnlyLiked ? 'default' : 'outline'}
          onClick={() => setShowOnlyLiked(true)}
        >
          Favorites
        </Button>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!selectedCategory ? 'default' : 'outline'}
            onClick={() => filterByCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.slug}
              size="sm"
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              onClick={() => filterByCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
