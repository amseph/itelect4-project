import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { BookOpen, CalendarDays, LayoutDashboard, LogIn, LogOut, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sparkles, Sun, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import useUiStore from '../store/uiStore'

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, public: true },
  { label: 'Study rooms', to: '/rooms', icon: BookOpen, public: true },
  { label: 'Reservations', to: '/reservations', icon: CalendarDays, public: false },
  { label: 'AI Study Assistant', to: '/review', icon: Sparkles, public: false },
]

function Layout() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const token = useAuthStore((state) => state.token)
  const userName = useAuthStore((state) => state.userName)
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = token !== null
  const isDarkMode = useUiStore((state) => state.isDarkMode)
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode)

  useEffect(() => {
    if (!mobileOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () => drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    focusable()?.[0]?.focus()
    const handleDrawerKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMobileOpen(false); return }
      if (event.key !== 'Tab') return
      const elements = focusable()
      if (!elements?.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleDrawerKeys)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleDrawerKeys)
      previousFocus?.focus()
    }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/login', { replace: true })
  }

  const sidebar = (mobile = false) => (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 ${mobile ? 'w-[min(19rem,88vw)]' : collapsed ? 'w-[4.5rem]' : 'w-64'}`}>
      <div className={`flex h-[4.5rem] shrink-0 items-center border-b border-slate-200 px-4 dark:border-slate-800 ${!mobile && collapsed ? 'justify-center px-2' : 'justify-between'}`}>
        <Link to="/" className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" onClick={() => setMobileOpen(false)} aria-label="Campus Study Rooms home">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-700 text-white"><BookOpen size={19} aria-hidden="true" /></span>
          {(mobile || !collapsed) && <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">Campus Rooms</span><span className="block truncate text-xs text-slate-500 dark:text-slate-400">Study space, made simple</span></span>}
        </Link>
        {mobile ? <button type="button" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800" aria-label="Close navigation"><X size={19} /></button> : <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800 lg:grid" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
        <p className={`mb-3 px-3 text-xs font-medium text-slate-400 ${!mobile && collapsed ? 'sr-only' : ''}`}>Workspace</p>
        {navItems.filter((item) => item.public || isAuthenticated).map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} title={!mobile && collapsed ? label : undefined} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${!mobile && collapsed ? 'lg:justify-center lg:px-2' : ''} ${isActive ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'}`}>
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            {(mobile || !collapsed) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        {isAuthenticated ? <>
          {(mobile || !collapsed) && <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{userName?.trim().charAt(0).toUpperCase() || 'S'}</span><span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{userName || 'Student'}</span><span className="block text-xs text-slate-500 dark:text-slate-400">Signed in</span></span></div>}
          <button type="button" onClick={handleLogout} title={!mobile && collapsed ? 'Log out' : undefined} className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900 ${!mobile && collapsed ? 'lg:justify-center lg:px-2' : ''}`}><LogOut size={18} />{(mobile || !collapsed) && 'Log out'}</button>
        </> : <div className="grid gap-2">
          {(mobile || !collapsed) && <Link to="/register" onClick={() => setMobileOpen(false)} className="flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Create account</Link>}
          <Link to="/login" title={!mobile && collapsed ? 'Log in' : undefined} onClick={() => setMobileOpen(false)} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900 ${!mobile && collapsed ? 'lg:justify-center lg:px-2' : ''}`}>{!mobile && collapsed ? <LogIn size={18} /> : <>{!isAuthenticated && <LogIn size={18} />}Log in</>}</Link>
        </div>}
      </div>
    </aside>
  )

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 lg:flex">
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar()}</div>
        {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden" role="presentation"><button type="button" className="absolute inset-0 bg-slate-950/45" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /><div ref={drawerRef} className="absolute inset-y-0 left-0 shadow-xl" role="dialog" aria-modal="true" aria-label="Mobile navigation">{sidebar(true)}</div></div>}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
            <div className="min-w-0 text-sm font-semibold text-slate-900 dark:text-white lg:hidden">Campus Rooms</div>
            <div className="ml-auto flex items-center gap-2">
              {!isAuthenticated && <Link to="/login" className="hidden min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900 sm:inline-flex"><LogIn size={16} /> Log in</Link>}
              <button type="button" onClick={toggleDarkMode} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900" aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>{isDarkMode ? <Sun size={17} /> : <Moon size={17} />}<span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'} mode</span></button>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
