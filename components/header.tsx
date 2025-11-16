'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">𝓜</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:inline">Math Chain</span>
        </Link>

        {session ? <Button variant="outline" onClick={() => void signOut()}>
          Logout ({session.user?.username})
        </Button> : <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button>
              Sign Up
            </Button>
          </Link>
        </nav>}
      </div>
    </header>
  )
}
