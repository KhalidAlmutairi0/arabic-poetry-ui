"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-xl font-bold">د</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">ديوان</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/search" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              البحث
            </Link>
            <Link 
              href="/poets" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              الشعراء
            </Link>
            <Link 
              href="/discover" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              استكشف
            </Link>
            <Link 
              href="/categories" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              التصنيفات
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/search"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
              <span>ابحث عن بيت شعر...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-background rounded border border-border mr-2">
                ⌘K
              </kbd>
            </Link>
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              aria-label="القائمة"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/search" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                البحث
              </Link>
              <Link 
                href="/poets" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                الشعراء
              </Link>
              <Link 
                href="/discover" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                استكشف
              </Link>
              <Link 
                href="/categories" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                التصنيفات
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
