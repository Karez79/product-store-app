import { useMemo } from 'react'
import { useProductStore } from '@/store/productStore'

export function useProducts() {
  const products = useProductStore((state) => state.products)
  const customProducts = useProductStore((state) => state.customProducts)
  const deletedIds = useProductStore((state) => state.deletedIds)
  const showOnlyLiked = useProductStore((state) => state.showOnlyLiked)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const totalProducts = useProductStore((state) => state.totalProducts)
  const currentPage = useProductStore((state) => state.currentPage)
  const itemsPerPage = useProductStore((state) => state.itemsPerPage)

  const allVisibleProducts = useMemo(() => {
    let allProducts = [...customProducts, ...products]
    allProducts = allProducts.filter((p) => !deletedIds.has(p.id))
    return allProducts
  }, [products, customProducts, deletedIds])

  const { filteredProducts, actualTotalProducts, actualTotalPages } = useMemo(() => {
    if (showOnlyLiked) {
      const filtered = allVisibleProducts.filter((p) => p.liked)
      const total = filtered.length
      const pages = Math.ceil(total / itemsPerPage)

      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginated = filtered.slice(startIndex, endIndex)

      return {
        filteredProducts: paginated,
        actualTotalProducts: total,
        actualTotalPages: pages,
      }
    } else {
      return {
        filteredProducts: allVisibleProducts,
        actualTotalProducts: totalProducts,
        actualTotalPages: Math.ceil(totalProducts / itemsPerPage),
      }
    }
  }, [allVisibleProducts, showOnlyLiked, currentPage, itemsPerPage, totalProducts])

  return {
    products: filteredProducts,
    loading,
    error,
    totalProducts: actualTotalProducts,
    currentPage,
    itemsPerPage,
    totalPages: actualTotalPages,
  }
}
