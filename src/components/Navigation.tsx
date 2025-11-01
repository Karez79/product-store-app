import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Plus, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductStore } from '@/store/productStore'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  badge?: number
  onClick?: () => void
}

const NavLink = memo(function NavLink({
  to,
  icon,
  label,
  badge,
  onClick,
}: NavLinkProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={cn(
          'w-full justify-start gap-2',
          isActive && 'shadow-sm'
        )}
      >
        {icon}
        <span>{label}</span>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Button>
    </Link>
  )
})

export const Navigation = memo(function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const likedCount = useProductStore((state) => state.likedIds.size)
  const setShowOnlyLiked = useProductStore((state) => state.setShowOnlyLiked)
  const showOnlyLiked = useProductStore((state) => state.showOnlyLiked)
  const setSelectedCategory = useProductStore((state) => state.setSelectedCategory)
  const setSearchQuery = useProductStore((state) => state.setSearchQuery)
  const fetchProducts = useProductStore((state) => state.fetchProducts)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleFavoritesClick = () => {
    setShowOnlyLiked(true)
  }

  const handleProductsClick = () => {
    setShowOnlyLiked(false)
    setSelectedCategory(null)
    setSearchQuery('')
    fetchProducts(1)
  }

  const navItems = [
    {
      to: '/products',
      icon: <ShoppingBag className="h-4 w-4" />,
      label: 'Products',
      onClick: handleProductsClick,
    },
    {
      to: '/create-product',
      icon: <Plus className="h-4 w-4" />,
      label: 'Create Product',
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/products"
            className="flex items-center gap-2 group"
            onClick={handleProductsClick}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Product Store</h1>
              <p className="text-xs text-muted-foreground">Manage your products</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
            <Button
              variant={showOnlyLiked ? 'default' : 'ghost'}
              className="gap-2"
              asChild
            >
              <Link to="/products" onClick={handleFavoritesClick}>
                <Heart className={cn(
                  "h-4 w-4",
                  likedCount > 0 ? "fill-red-500 text-red-500" : ""
                )} />
                <Badge variant="secondary">{likedCount}</Badge>
              </Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 space-y-2 animate-slide-in">
            {navItems.map((item) => (
              <NavLink key={item.to} {...item} onClick={closeMobileMenu} />
            ))}
            <Link
              to="/products"
              onClick={() => {
                handleFavoritesClick()
                closeMobileMenu()
              }}
            >
              <Button
                variant={showOnlyLiked ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <Heart className={cn(
                  "h-4 w-4",
                  likedCount > 0 ? "fill-red-500 text-red-500" : ""
                )} />
                <span>Favorites</span>
                <Badge variant="secondary" className="ml-auto">
                  {likedCount}
                </Badge>
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
})
