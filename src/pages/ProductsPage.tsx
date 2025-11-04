import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilter } from '@/components/ProductFilter'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { ProductsGridSkeleton } from '@/components/ui/spinner'
import { useProducts } from '@/hooks/useProducts'
import { useProductStore } from '@/store/productStore'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, loading, error, totalPages, currentPage } = useProducts()
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const showOnlyLiked = useProductStore((state) => state.showOnlyLiked)
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const searchQuery = useProductStore((state) => state.searchQuery)
  const setShowOnlyLiked = useProductStore((state) => state.setShowOnlyLiked)
  const filterByCategory = useProductStore((state) => state.filterByCategory)
  const setSearchQuery = useProductStore((state) => state.setSearchQuery)
  const setSelectedCategory = useProductStore((state) => state.setSelectedCategory)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false)
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false)

  const urlPage = parseInt(searchParams.get('page') || '1')
  const urlCategory = searchParams.get('category')
  const urlLiked = searchParams.get('liked') === 'true'
  const urlSearch = searchParams.get('search') || ''

  useEffect(() => {
    const needsUpdate =
      urlLiked !== showOnlyLiked ||
      urlCategory !== selectedCategory ||
      urlSearch !== searchQuery ||
      urlPage !== currentPage

    if (needsUpdate || !hasLoadedFromUrl) {
      setIsLoadingFromUrl(true)

      const page = urlPage
      const category = urlCategory
      const liked = urlLiked
      const search = urlSearch

      if (liked !== showOnlyLiked) {
        setShowOnlyLiked(liked)
      }
      if (category !== selectedCategory) {
        setSelectedCategory(category)
      }
      if (search !== searchQuery) {
        setSearchQuery(search)
      }

      const loadData = async () => {
        if (category) {
          await filterByCategory(category, page)
        } else if (page !== currentPage && page >= 1) {
          await fetchProducts(page)
        } else if (!hasLoadedFromUrl) {
          await fetchProducts()
        }
        setIsLoadingFromUrl(false)
        setHasLoadedFromUrl(true)
      }

      loadData()
    }
  }, [searchParams])

  useEffect(() => {
    if (!hasLoadedFromUrl) return

    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (selectedCategory) params.set('category', selectedCategory)
    if (showOnlyLiked) params.set('liked', 'true')
    if (searchQuery) params.set('search', searchQuery)

    const currentUrlPage = searchParams.get('page')
    const currentUrlCategory = searchParams.get('category')
    const currentUrlLiked = searchParams.get('liked')
    const currentUrlSearch = searchParams.get('search')

    const targetPage = currentPage > 1 ? currentPage.toString() : null
    const targetCategory = selectedCategory || null
    const targetLiked = showOnlyLiked ? 'true' : null
    const targetSearch = searchQuery || null

    if (
      currentUrlPage !== targetPage ||
      currentUrlCategory !== targetCategory ||
      currentUrlLiked !== targetLiked ||
      currentUrlSearch !== targetSearch
    ) {
      setSearchParams(params, { replace: true })
    }
  }, [currentPage, selectedCategory, showOnlyLiked, searchQuery, hasLoadedFromUrl, searchParams, setSearchParams])

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 500)
    return () => clearTimeout(timer)
  }, [showOnlyLiked, selectedCategory, searchQuery, currentPage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <SearchBar />
        </div>
      </div>

      <ProductFilter />

      {isLoadingFromUrl || (loading && products.length === 0) || isTransitioning ? (
        <ProductsGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && <Pagination />}
        </>
      )}
    </div>
  )
}
