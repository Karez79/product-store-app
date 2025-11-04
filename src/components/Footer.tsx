import { Heart, Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>using React + TypeScript + Zustand</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/Karez79/product-store-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://fakeapi.platzi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>API</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Product Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
