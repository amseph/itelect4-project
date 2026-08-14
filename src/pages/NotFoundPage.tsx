import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">404 error</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p>
        <Link className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900" to="/">Back to dashboard</Link>
      </section>
    </main>
  )
}

export default NotFoundPage
