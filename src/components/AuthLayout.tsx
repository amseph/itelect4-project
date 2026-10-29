import type { ReactNode } from 'react'
import { BookOpen, Moon, Sun } from 'lucide-react'
import useUiStore from '../store/uiStore'

function AuthLayout({ children }: { children: ReactNode }) {
  const isDarkMode = useUiStore((state) => state.isDarkMode)
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode)

  return <div className={isDarkMode ? 'dark' : ''}>
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <button type="button" onClick={toggleDarkMode} className="fixed right-4 top-4 grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        {isDarkMode ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      </button>
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-blue-700 text-white"><BookOpen size={21} aria-hidden="true" /></span>
          <h1 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Campus Rooms</h1>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">Study space, made simple.</p>
        </header>
        {children}
      </div>
    </main>
  </div>
}

export default AuthLayout
