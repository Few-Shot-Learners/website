'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is currently active
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDark = !isDark
    
    if (newIsDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    setIsDark(newIsDark)
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="w-16 h-6"></div>
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 text-sm hover:opacity-60 transition-opacity underline underline-offset-4 decoration-2 z-50"
      aria-label="Toggle theme"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  )
}

