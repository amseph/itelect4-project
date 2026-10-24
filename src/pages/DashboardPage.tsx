import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building2, CalendarDays, DoorOpen, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router'
import { fetchReservations, fetchRooms } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import ReservationBadge from '../components/ReservationBadge'
import { useAuthStore } from '../store/authStore'
import type { ApiReservation, StudyRoom } from '../types'

function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.token !== null)
  const userName = useAuthStore((state) => state.userName)
  const roomsQuery = useQuery<StudyRoom[]>({ queryKey: ['rooms'], queryFn: fetchRooms })
  const reservationsQuery = useQuery<ApiReservation[]>({ queryKey: ['reservations'], queryFn: fetchReservations, enabled: isAuthenticated })
  const rooms = roomsQuery.data ?? []
  const availableRooms = rooms.filter((room) => room.isAvailable)
  const previewRooms = (availableRooms.length ? availableRooms : rooms).slice(0, 3)
  const reservations = [...(reservationsQuery.data ?? [])].sort((a, b) => b.date.localeCompare(a.date))
  const roomById = new Map(rooms.map((room) => [room.id, room]))

  return (
    <PageFrame>
      <PageHeading eyebrow="Campus Study Rooms" title={`Welcome${isAuthenticated && userName ? `, ${userName.split(' ')[0]}` : ''}`} description="Find a comfortable place to focus, meet with classmates, and plan your next study session." actions={
        <Link to="/rooms" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Browse study rooms <ArrowRight size={16} /></Link>
      } />

      <section className="mb-8 grid gap-3 sm:grid-cols-3" aria-label="Room summary">
        <SummaryCard icon={<DoorOpen size={18} />} label="Study rooms" value={roomsQuery.isPending ? '…' : roomsQuery.isError ? '—' : String(rooms.length)} detail="Listed in the system" />
        <SummaryCard icon={<Building2 size={18} />} label="Generally available" value={roomsQuery.isPending ? '…' : roomsQuery.isError ? '—' : String(availableRooms.length)} detail="Check your chosen time when booking" />
        {isAuthenticated ? <SummaryCard icon={<CalendarDays size={18} />} label="My reservations" value={reservationsQuery.isPending ? '…' : reservationsQuery.isError ? '—' : String(reservations.length)} detail="Your reservation requests" /> : <SummaryCard icon={<Users size={18} />} label="Your study space" value="Ready when you are" detail="Sign in to manage reservations" />}
      </section>

      {roomsQuery.isError && <InlineError title="Rooms could not be loaded" message="Please check your connection and try the room list again." onRetry={() => void roomsQuery.refetch()} />}
      {roomsQuery.isPending && <LoadingState label="Loading study rooms…" />}

      {!roomsQuery.isPending && !roomsQuery.isError && <section aria-labelledby="room-preview-title" className="mb-9">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 id="room-preview-title" className="text-lg font-semibold text-slate-950 dark:text-white">Places to study</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">A quick look at rooms listed by the campus.</p></div>
          <Link to="/rooms" className="inline-flex min-h-10 shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200">All rooms <ArrowRight size={15} /></Link>
        </div>
        {previewRooms.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{previewRooms.map((room) => <RoomPreview key={room.id} room={room} />)}</div> : <EmptyState title="No study rooms listed yet" message="Rooms will appear here when they are available in the system." />}
      </section>}

      {isAuthenticated ? <section aria-labelledby="recent-reservations-title">
        <div className="mb-4 flex items-end justify-between gap-4"><div><h2 id="recent-reservations-title" className="text-lg font-semibold text-slate-950 dark:text-white">Recent reservations</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your latest booking requests.</p></div><Link to="/reservations" className="inline-flex min-h-10 shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">My reservations <ArrowRight size={15} /></Link></div>
        {reservationsQuery.isPending && <LoadingState label="Loading your reservations…" />}
        {reservationsQuery.isError && <InlineError title="Reservations could not be loaded" message="Your rooms are still available to browse. Try loading your reservations again." onRetry={() => void reservationsQuery.refetch()} />}
        {!reservationsQuery.isPending && !reservationsQuery.isError && reservations.length === 0 && <EmptyState title="No reservations yet" message="Once you submit a reservation, it will show up here." />}
        {!reservationsQuery.isPending && !reservationsQuery.isError && reservations.length > 0 && <div className="grid gap-3 md:grid-cols-2">{reservations.slice(0, 2).map((reservation) => <ReservationBadge key={reservation.id} reservation={reservation}><span>{roomById.get(reservation.roomId)?.name ?? `Room ${reservation.roomId}`}</span></ReservationBadge>)}</div>}
      </section> : <section className="flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/70 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-950 dark:text-white">Keep your plans together</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Log in to create reservations and review your study plans.</p></div><Link to="/login" className="inline-flex min-h-10 w-fit items-center justify-center rounded-lg border border-blue-300 bg-white px-4 text-sm font-semibold text-blue-800 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-blue-950">Log in to continue</Link></section>}
    </PageFrame>
  )
}

function SummaryCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"><span className="text-blue-700 dark:text-blue-300">{icon}</span>{label}</div><p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></article>
}

function RoomPreview({ room }: { room: StudyRoom }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold text-slate-950 dark:text-white">{room.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><MapPin size={14} />{room.building}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${room.isAvailable ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{room.isAvailable ? 'Generally available' : 'Unavailable'}</span></div><p className="mt-4 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><Users size={15} /> Up to {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p><Link to={`/rooms/${room.id}`} className="mt-4 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">Room details <ArrowRight size={15} /></Link></article>
}

function LoadingState({ label }: { label: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" role="status">{label}</div> }
function EmptyState({ title, message }: { title: string; message: string }) { return <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 dark:border-slate-700 dark:bg-slate-950/40"><h3 className="font-medium text-slate-900 dark:text-white">{title}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p></div> }
function InlineError({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) { return <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert"><div><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm">{message}</p></div><button type="button" onClick={onRetry} className="min-h-10 w-fit rounded-lg border border-red-300 px-3 text-sm font-medium hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-800 dark:hover:bg-red-950">Try again</button></div> }

export default DashboardPage
