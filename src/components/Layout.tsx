import { Outlet } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs />
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
