export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface ProductWithState extends Product {
  liked: boolean
  isCustom?: boolean
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CreateProductInput {
  title: string
  description: string
  price: number
  category: string
  brand: string
  thumbnail: string
}
