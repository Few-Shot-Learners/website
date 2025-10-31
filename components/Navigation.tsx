'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/technical-writings', label: 'Technical Writings' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="border-b border-black">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <ul className="flex gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:opacity-60 transition-opacity ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
