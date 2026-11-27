import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoMark from '../../assets/frunami-mark.png'
import { useTheme } from '../../theme'
import styles from './sidebar.module.css'

function navItemClassName({ isActive }: { isActive: boolean }): string {
  return `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
}

// The FRUNAMI wave mark (assets/frunami-favicon.png, resized).
export function LogoMark({ size = 28 }: { size?: number }) {
  return <img src={logoMark} width={size} height={size} alt="" aria-hidden="true" className={styles.logoMark} />
}

// Icon is a 16px line icon in the nav's text colour.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ICONS = {
  dashboard: <Icon><path d="M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z" /></Icon>,
  subscribers: <Icon><circle cx="8" cy="5.5" r="2.5" /><path d="M3 13.5c.8-2.4 2.7-3.5 5-3.5s4.2 1.1 5 3.5" /></Icon>,
  logs: <Icon><path d="M3 4h10M3 8h10M3 12h6" /></Icon>,
  images: <Icon><path d="M8 2.5l5.5 3-5.5 3-5.5-3zM2.5 8.5l5.5 3 5.5-3M2.5 11l5.5 3 5.5-3" /></Icon>,
  testers: <Icon><rect x="2.5" y="3" width="11" height="4" rx="1" /><rect x="2.5" y="9" width="11" height="4" rx="1" /><path d="M5 5h.01M5 11h.01" /></Icon>,
  setup: <Icon><path d="M2.5 4.5h11M2.5 11.5h11" /><circle cx="6" cy="4.5" r="1.6" fill="var(--chrome)" /><circle cx="10" cy="11.5" r="1.6" fill="var(--chrome)" /></Icon>,
  profiles: <Icon><path d="M4 2.5h5l3 3v8H4zM9 2.5v3h3" /></Icon>,
  runs: <Icon><path d="M1.5 8h2.5l2-4.5 3 9 2-4.5h3.5" /></Icon>,
  history: <Icon><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.2l2 1.3" /></Icon>,
  bench: <Icon><path d="M2.5 11.5a5.5 5.5 0 1 1 11 0M8 11.5l2.5-3.5" /></Icon>,
  sun: <Icon><circle cx="8" cy="8" r="2.75" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06" /></Icon>,
  moon: <Icon><path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z" /></Icon>,
  logout: <Icon><path d="M6 2.5H3v11h3M10 5l3 3-3 3M13 8H6" /></Icon>,
}

interface SidebarProps {
  // runs in progress, shown on Runs; null or 0 shows nothing
  activeRuns?: number | null
  onLogout?: () => void
}

// Sidebar is the v2 navigation: the brand row, two groups of icon links,
// and Log out at the bottom.
export default function Sidebar({ activeRuns = null, onLogout }: SidebarProps) {
  const [theme, toggleTheme] = useTheme()
  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.brand} aria-label="FRUNAMI: go to the dashboard">
        <LogoMark size={38} />
        <span className={styles.wordmark}>FRUNAMI</span>
      </Link>

      <p className={styles.navGroup}>Core network</p>
      <nav className={styles.nav} aria-label="Core network">
        <NavLink to="/" end className={navItemClassName}>{ICONS.dashboard}Dashboard</NavLink>
        <NavLink to="/subscribers" className={navItemClassName}>{ICONS.subscribers}Subscribers</NavLink>
        <NavLink to="/logs" className={navItemClassName}>{ICONS.logs}Logs</NavLink>
        <NavLink to="/images" className={navItemClassName}>{ICONS.images}Images</NavLink>
      </nav>

      <p className={styles.navGroup}>Load testing</p>
      <nav className={styles.nav} aria-label="Load testing">
        <NavLink to="/tester/status" className={navItemClassName}>{ICONS.testers}Testers</NavLink>
        <NavLink to="/tester" end className={navItemClassName}>{ICONS.setup}Setup</NavLink>
        <NavLink to="/tester/profiles" className={navItemClassName}>{ICONS.profiles}Profiles</NavLink>
        <NavLink to="/tester/run" className={navItemClassName}>
          {ICONS.runs}Runs
          {activeRuns ? <span className={styles.badge} aria-label={`${activeRuns} in progress`}>{activeRuns}</span> : null}
        </NavLink>
        <NavLink to="/tester/history" className={navItemClassName}>{ICONS.history}History</NavLink>
        <NavLink to="/tester/bench" className={navItemClassName}>{ICONS.bench}Bench</NavLink>
      </nav>

      <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'dark' ? ICONS.sun : ICONS.moon}
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>

      {onLogout && (
        <button type="button" className={styles.logout} onClick={onLogout}>{ICONS.logout}Log out</button>
      )}
    </aside>
  )
}
