import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useProductStore } from '@/store/productStore'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchBar() {
  const { searchProducts, searchQuery } = useProductStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const debouncedQuery = useDebounce(localQuery, 500)

  useEffect(() => {
    searchProducts(debouncedQuery)
  }, [debouncedQuery])

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
