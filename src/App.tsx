import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PageLoader } from '@/components/ui/spinner'

const ProductsPage = lazy(() =>
  import('@/pages/ProductsPage').then((module) => ({
    default: module.ProductsPage,
  }))
)
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((module) => ({
    default: module.ProductDetailPage,
  }))
)
const CreateProductPage = lazy(() =>
  import('@/pages/CreateProductPage').then((module) => ({
    default: module.CreateProductPage,
  }))
)

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route
              path="products"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProductsPage />
                </Suspense>
              }
            />
            <Route
              path="products/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProductDetailPage />
                </Suspense>
              }
            />
            <Route
              path="create-product"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CreateProductPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
