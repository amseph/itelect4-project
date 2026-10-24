import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { PageFrame } from '../components/PageFrame'

function NotFoundPage() {
  return (
    <PageFrame>
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">404 · Campus Study Rooms</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">The page you requested does not exist.</p>
        <Link className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" to="/"><ArrowLeft size={16} />Back to dashboard</Link>
      </section>
    </PageFrame>
  )
}

export default NotFoundPage
