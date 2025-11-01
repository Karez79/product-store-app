import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductWithState, CreateProductInput } from '@/types/product'
import { productsApi } from '@/api/products'

interface ProductStore {
  products: ProductWithState[]
  customProducts: ProductWithState[]
  likedIds: Set<number>
  deletedIds: Set<number>
  loading: boolean
  error: string | null

  currentPage: number
  totalProducts: number
  itemsPerPage: number

  searchQuery: string
  selectedCategory: string | null
  showOnlyLiked: boolean

  fetchProducts: (page?: number) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  filterByCategory: (category: string | null, page?: number) => Promise<void>
  toggleLike: (id: number) => void
  deleteProduct: (id: number) => Promise<void>
  createProduct: (input: CreateProductInput) => void
  updateProduct: (id: number, input: Partial<CreateProductInput>) => void
  setShowOnlyLiked: (value: boolean) => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
  setSelectedCategory: (category: string | null) => void

  getVisibleProducts: () => ProductWithState[]
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      customProducts: [],
      likedIds: new Set(),
      deletedIds: new Set(),
      loading: false,
      error: null,
      currentPage: 1,
      totalProducts: 0,
      itemsPerPage: 12,
      searchQuery: '',
      selectedCategory: null,
      showOnlyLiked: false,

      fetchProducts: async (page = 1) => {
        set({ loading: true, error: null, currentPage: page, products: [] })
        try {
          const { likedIds, itemsPerPage } = get()
          const skip = (page - 1) * itemsPerPage

          const response = await productsApi.getAll(itemsPerPage, skip)

          const productsWithState: ProductWithState[] = response.products.map(
            (product) => ({
              ...product,
              liked: likedIds.has(product.id),
            })
          )

          set({
            products: productsWithState,
            totalProducts: response.total,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            loading: false,
          })
        }
      },

      searchProducts: async (query: string) => {
        if (!query.trim()) {
          get().fetchProducts(1)
          return
        }

        set({ loading: true, error: null, searchQuery: query, products: [] })
        try {
          const { likedIds } = get()
          const response = await productsApi.search(query)

          const productsWithState: ProductWithState[] = response.products.map(
            (product) => ({
              ...product,
              liked: likedIds.has(product.id),
            })
          )

          set({
            products: productsWithState,
            totalProducts: response.total,
            loading: false,
            currentPage: 1,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to search products',
            loading: false,
          })
        }
      },

      filterByCategory: async (category: string | null, page = 1) => {
        set({ selectedCategory: category, loading: true, error: null, products: [] })

        if (!category) {
          get().fetchProducts(page)
          return
        }

        try {
          const { likedIds } = get()
          const response = await productsApi.getByCategory(category)

          const productsWithState: ProductWithState[] = response.products.map(
            (product) => ({
              ...product,
              liked: likedIds.has(product.id),
            })
          )

          set({
            products: productsWithState,
            totalProducts: response.total,
            loading: false,
            currentPage: page,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to filter products',
            loading: false,
          })
        }
      },

      toggleLike: (id: number) => {
        set((state) => {
          const newLikedIds = new Set(state.likedIds)
          if (newLikedIds.has(id)) {
            newLikedIds.delete(id)
          } else {
            newLikedIds.add(id)
          }

          return {
            likedIds: newLikedIds,
            products: state.products.map((p) =>
              p.id === id ? { ...p, liked: newLikedIds.has(id) } : p
            ),
            customProducts: state.customProducts.map((p) =>
              p.id === id ? { ...p, liked: newLikedIds.has(id) } : p
            ),
          }
        })
      },

      deleteProduct: async (id: number) => {
        try {
          if (id < 0) {
            set((state) => ({
              customProducts: state.customProducts.filter((p) => p.id !== id),
            }))
          } else {
            await productsApi.delete(id)
            set((state) => {
              const newDeletedIds = new Set(state.deletedIds)
              newDeletedIds.add(id)
              return { deletedIds: newDeletedIds }
            })
          }
        } catch (error) {
          console.error('Failed to delete product:', error)
          throw error
        }
      },

      createProduct: (input: CreateProductInput) => {
        set((state) => {
          const newId = -(state.customProducts.length + 1)

          const newProduct: ProductWithState = {
            id: newId,
            ...input,
            rating: 0,
            stock: 0,
            discountPercentage: 0,
            images: [input.thumbnail],
            liked: false,
            isCustom: true,
          }

          return {
            customProducts: [newProduct, ...state.customProducts],
          }
        })
      },

      updateProduct: (id: number, input: Partial<CreateProductInput>) => {
        set((state) => ({
          customProducts: state.customProducts.map((p) =>
            p.id === id ? { ...p, ...input } : p
          ),
        }))
      },

      setShowOnlyLiked: (value: boolean) => {
        set({ showOnlyLiked: value, currentPage: 1 })
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setCurrentPage: (page: number) => {
        get().fetchProducts(page)
      },

      setSelectedCategory: (category: string | null) => {
        set({ selectedCategory: category })
      },

      getVisibleProducts: () => {
        const { products, customProducts, deletedIds, showOnlyLiked } = get()

        let allProducts = [...customProducts, ...products]

        allProducts = allProducts.filter((p) => !deletedIds.has(p.id))

        if (showOnlyLiked) {
          allProducts = allProducts.filter((p) => p.liked)
        }

        return allProducts
      },
    }),
    {
      name: 'product-storage',
      version: 2,
      partialize: (state) => ({
        likedIds: Array.from(state.likedIds),
        deletedIds: Array.from(state.deletedIds),
        customProducts: state.customProducts,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.likedIds = new Set(state.likedIds as unknown as number[])
          state.deletedIds = new Set(state.deletedIds as unknown as number[])
        }
      },
    }
  )
)
