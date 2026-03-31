'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/catalogo', label: 'Produtos' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          AIRCONEX
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-purple-light transition-colors">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="bg-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition"
          >
            Solicitar orçamento
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-brand-blue border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-brand-purple-light">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className="bg-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold text-center"
          >
            Solicitar orçamento
          </Link>
        </nav>
      )}
    </header>
  )
}
