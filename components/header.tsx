"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex items-center">
          EduReach
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        <nav
          className={`${isMenuOpen ? "flex" : "hidden"} md:flex absolute md:static left-0 right-0 top-14 md:top-auto bg-primary md:bg-transparent flex-col md:flex-row gap-2 md:gap-6 p-4 md:p-0 z-50`}
        >
          <Link href="/" className="hover:underline py-2 md:py-0">
            Home
          </Link>
          <Link href="/courses" className="hover:underline py-2 md:py-0">
            Courses
          </Link>
          <Link href="/live-sessions" className="hover:underline py-2 md:py-0">
            Live Sessions
          </Link>
          <Link href="/teach" className="hover:underline py-2 md:py-0">
            Teach
          </Link>
          <Link href="/downloads" className="hover:underline py-2 md:py-0">
            Downloads
          </Link>
          <Link href="/profile" className="hover:underline py-2 md:py-0">
            My Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}

