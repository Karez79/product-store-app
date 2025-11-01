import { useCallback } from 'react'
import { useProductStore } from '@/store/productStore'
import type { CreateProductInput } from '@/types/product'

export function useProductActions() {
  const toggleLike = useProductStore((state) => state.toggleLike)
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  const createProduct = useProductStore((state) => state.createProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const searchProducts = useProductStore((state) => state.searchProducts)
  const filterByCategory = useProductStore((state) => state.filterByCategory)
  const setCurrentPage = useProductStore((state) => state.setCurrentPage)
  const setShowOnlyLiked = useProductStore((state) => state.setShowOnlyLiked)

  const handleLike = useCallback(
    (id: number) => {
      toggleLike(id)
    },
    [toggleLike]
  )

  const handleDelete = useCallback(
    async (id: number, onSuccess?: () => void) => {
      try {
        await deleteProduct(id)
        onSuccess?.()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    },
    [deleteProduct]
  )

  const handleCreate = useCallback(
    (data: CreateProductInput, onSuccess?: () => void) => {
      createProduct(data)
      onSuccess?.()
    },
    [createProduct]
  )

  const handleUpdate = useCallback(
    (id: number, data: Partial<CreateProductInput>, onSuccess?: () => void) => {
      updateProduct(id, data)
      onSuccess?.()
    },
    [updateProduct]
  )

  return {
    toggleLike: handleLike,
    deleteProduct: handleDelete,
    createProduct: handleCreate,
    updateProduct: handleUpdate,
    fetchProducts,
    searchProducts,
    filterByCategory,
    setCurrentPage,
    setShowOnlyLiked,
  }
}
