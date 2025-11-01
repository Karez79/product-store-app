import type { Product, ProductsResponse } from '@/types/product'

const API_BASE_URL = 'https://api.escuelajs.co/api/v1'

interface PlatziProduct {
  id: number
  title: string
  price: number
  description: string
  category: {
    id: number
    name: string
    image: string
  }
  images: string[]
}

const adaptProduct = (platziProduct: PlatziProduct): Product => ({
  id: platziProduct.id,
  title: platziProduct.title,
  description: platziProduct.description,
  price: platziProduct.price,
  discountPercentage: 0,
  rating: 4.5,
  stock: 100,
  brand: '',
  category: platziProduct.category.name,
  thumbnail: platziProduct.images[0] || platziProduct.category.image,
  images: platziProduct.images.length > 0 ? platziProduct.images : [platziProduct.category.image],
})

export const productsApi = {
  getAll: async (limit = 12, skip = 0): Promise<ProductsResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/products?offset=${skip}&limit=${limit}`
    )
    if (!response.ok) throw new Error('Failed to fetch products')
    const products: PlatziProduct[] = await response.json()

    const totalResponse = await fetch(`${API_BASE_URL}/products`)
    const allProducts = await totalResponse.json()
    const total = Array.isArray(allProducts) ? allProducts.length : 200

    return {
      products: products.map(adaptProduct),
      total,
      skip,
      limit,
    }
  },

  getById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    const product: PlatziProduct = await response.json()
    return adaptProduct(product)
  },

  search: async (query: string): Promise<ProductsResponse> => {
    const response = await fetch(`${API_BASE_URL}/products?title=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search products')
    const products: PlatziProduct[] = await response.json()

    return {
      products: products.map(adaptProduct),
      total: products.length,
      skip: 0,
      limit: products.length,
    }
  },

  getByCategory: async (category: string): Promise<ProductsResponse> => {
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
    const categories: Array<{ id: number; name: string }> = await categoriesResponse.json()
    const categoryObj = categories.find(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    )

    if (!categoryObj) {
      return { products: [], total: 0, skip: 0, limit: 0 }
    }

    const response = await fetch(
      `${API_BASE_URL}/products/?categoryId=${categoryObj.id}`
    )
    if (!response.ok) throw new Error('Failed to fetch products by category')
    const products: PlatziProduct[] = await response.json()

    return {
      products: products.map(adaptProduct),
      total: products.length,
      skip: 0,
      limit: products.length,
    }
  },

  getCategories: async (): Promise<Array<{ slug: string; name: string; url: string }>> => {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    const categories: Array<{ id: number; name: string; image: string }> = await response.json()
    return categories.slice(0, 8).map((cat) => ({
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      name: cat.name,
      url: '',
    }))
  },

  delete: async (id: number): Promise<{ isDeleted: boolean; id: number }> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete product')
    return { isDeleted: true, id }
  },
}
