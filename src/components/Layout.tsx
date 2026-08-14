import { NavLink, Outlet } from 'react-router'
import useToggle from '../hooks/useToggle'
import { useAuthStore } from '../store/authStore'

type NavigationIconName = 'dashboard' | 'rooms' | 'reservations' | 'login'

const navigationLinks: Array<{ label: string; to: string; icon: NavigationIconName }> = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Rooms', to: '/rooms', icon: 'rooms' },
  { label: 'Reservations', to: '/reservations', icon: 'reservations' },
  { label: 'Login', to: '/login', icon: 'login' },
]

function NavigationIcon({ name }: { name: NavigationIconName }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    rooms: <><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" /><path d="M2 21h20" /><path d="M8 7h5M8 11h5M8 15h2" /></>,
    reservations: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h6" /></>,
    login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>,
  }

  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Layout() {
  const [isDarkMode, toggleDarkMode] = useToggle(false)
  const [isSidebarCollapsed, toggleSidebarCollapsed] = useToggle(false)
  const [isMobileMenuOpen, toggleMobileMenu] = useToggle(false)
  const userName = useAuthStore((state) => state.userName)
  const logout = useAuthStore((state) => state.logout)

  const closeMobileDrawer = (): void => {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {isMobileMenuOpen && <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" type="button" aria-label="Close navigation menu" onClick={closeMobileDrawer} />}

        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-2 shadow-lg transition-[transform,width] duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-auto lg:w-[216px] lg:translate-x-0 lg:shadow-none ${isSidebarCollapsed ? 'lg:w-16' : ''} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex min-h-10 items-center justify-between gap-1 px-1">
            <div className={`flex min-w-0 items-center gap-3 ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[10px] font-bold text-white">SR</span>
              <span className={`truncate text-xs font-bold tracking-wide text-slate-900 dark:text-white ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Study Rooms</span>
            </div>
            <button className="inline-flex size-11 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden" type="button" aria-label="Close navigation menu" onClick={closeMobileDrawer}>
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <button className="hidden size-11 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 lg:inline-flex" type="button" aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggleSidebarCollapsed}>
              <svg className={`size-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>

          <nav className="mt-4 flex flex-col gap-0.5" aria-label="Primary navigation">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMobileDrawer}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  } ${isSidebarCollapsed ? 'lg:justify-center lg:px-1.5' : ''}`
                }
              >
                <NavigationIcon name={link.icon} />
                <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-2 dark:border-slate-800">
            {userName && <span className={`truncate px-2.5 pb-1 text-xs font-medium text-slate-500 dark:text-slate-400 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>{userName}</span>}
            {userName && <button className={`flex min-h-11 items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 ${isSidebarCollapsed ? 'lg:justify-center lg:px-1.5' : ''}`} type="button" onClick={logout}><svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></svg><span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Logout</span></button>}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex h-14 items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-950">
            <button className="inline-flex size-11 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" type="button" aria-label="Open navigation menu" aria-expanded={isMobileMenuOpen} onClick={toggleMobileMenu}>
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-200 lg:hidden">Study Rooms</span>
            <button className="ml-auto min-h-11 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
