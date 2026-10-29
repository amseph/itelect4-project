import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BookOpen, Bot, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { fetchReservations, fetchRooms } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import { useAuthStore } from '../store/authStore'
import type { ApiReservation, StudyRoom } from '../types'

function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.token !== null)
  const userName = useAuthStore((state) => state.userName)
  const roomsQuery = useQuery<StudyRoom[]>({ queryKey: ['rooms'], queryFn: fetchRooms })
  const reservationsQuery = useQuery<ApiReservation[]>({ queryKey: ['reservations'], queryFn: fetchReservations, enabled: isAuthenticated })
  const roomById = new Map((roomsQuery.data ?? []).map((room) => [room.id, room]))
  const recentReservation = [...(reservationsQuery.data ?? [])].sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))[0]
  const recentRoom = recentReservation ? roomById.get(recentReservation.roomId) : undefined

  return <PageFrame className="max-w-5xl">
    <PageHeading title={`Welcome back${isAuthenticated && userName ? `, ${userName.split(' ')[0]}` : ''}`} description="Find and reserve a study room." />

    <section className="mb-8" aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="mb-3 text-base font-semibold text-slate-950 dark:text-white">Quick actions</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <ActionCard to="/rooms" icon={<BookOpen size={18} />} title="Browse rooms" text="Find a room that fits your needs." />
        <ActionCard to="/reservations" icon={<CalendarDays size={18} />} title="Create reservation" text="Book a study room." />
        <ActionCard to={isAuthenticated ? '/review' : '/login'} icon={<Bot size={18} />} title="AI Study Assistant" text="Get feedback on your study plan." />
      </div>
    </section>

    <section aria-labelledby="recent-reservation-title">
      <h2 id="recent-reservation-title" className="mb-3 text-base font-semibold text-slate-950 dark:text-white">Recent reservation</h2>
      {!isAuthenticated && <EmptyState>Log in to view your reservations.</EmptyState>}
      {isAuthenticated && reservationsQuery.isPending && <EmptyState role="status">Loading your reservation…</EmptyState>}
      {isAuthenticated && reservationsQuery.isError && <EmptyState role="alert">Your reservation could not be loaded. Try again from the reservations page.</EmptyState>}
      {isAuthenticated && !reservationsQuery.isPending && !reservationsQuery.isError && !recentReservation && <EmptyState>You don’t have any reservations yet.</EmptyState>}
      {isAuthenticated && recentReservation && <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-slate-950 dark:text-white">{recentRoom?.name ?? `Room ${recentReservation.roomId}`}</h3><Status status={recentReservation.status} /></div><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><MapPin size={14} />{recentRoom?.building ?? 'Location unavailable'}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{formatDate(recentReservation.date)} · {recentReservation.startTime}–{recentReservation.endTime}</p></div><Link to="/reservations" className="inline-flex min-h-9 shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">View reservation <ArrowRight size={15} /></Link></article>}
    </section>
  </PageFrame>
}

function ActionCard({ to, icon, title, text }: { to: string; icon: React.ReactNode; title: string; text: string }) {
  return <Link to={to} className="group flex min-h-24 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">{icon}</span><span><span className="block text-sm font-semibold text-slate-950 dark:text-white">{title}</span><span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{text}</span></span></Link>
}
function EmptyState({ children, role }: { children: React.ReactNode; role?: 'status' | 'alert' }) { return <div role={role} className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">{children}</div> }
function Status({ status }: { status: string }) { const color = status === 'approved' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : status === 'pending' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200' : status === 'completed' ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'; return <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}>{status}</span> }
function formatDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }

export default DashboardPage
