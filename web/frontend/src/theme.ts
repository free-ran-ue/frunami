import { useCallback, useEffect, useState } from 'react'

// Light/dark choice. With nothing saved the page follows the OS setting
// (prefers-color-scheme in index.css); a saved choice is written to
// <html data-theme>, which index.html also applies before first paint.
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'frunami-theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function savedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

function currentTheme(): Theme {
  return savedTheme() ?? (media().matches ? 'dark' : 'light')
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // follow OS changes while the user has not picked one
  useEffect(() => {
    const m = media()
    const onChange = () => { if (!savedTheme()) setTheme(m.matches ? 'dark' : 'light') }
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode: applies to this page only */ }
    setTheme(next)
  }, [])

  return [theme, toggle]
}
