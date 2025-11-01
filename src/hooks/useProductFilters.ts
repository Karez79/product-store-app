import { useProductStore } from '@/store/productStore'

export function useProductFilters() {
  const showOnlyLiked = useProductStore((state) => state.showOnlyLiked)
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const searchQuery = useProductStore((state) => state.searchQuery)

  return {
    showOnlyLiked,
    selectedCategory,
    searchQuery,
  }
}
