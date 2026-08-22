import { useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchRoomById } from '../api/client'
import type { StudyRoom } from '../types'

function RoomDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: room, isPending, isError, error } = useQuery<StudyRoom>({
    queryKey: ['rooms', id],
    queryFn: () => fetchRoomById(Number(id)),
    enabled: Boolean(id),
  })

  const handleBackClick = (): void => {
    navigate('/rooms')
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <section className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-3 w-32 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="mb-4 h-10 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-24 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <p className="sr-only">Loading room data...</p>
        </section>
      </main>
    )
  }

  if (isError || !room) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Study room</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Room not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{error instanceof Error ? error.message : 'The requested study room is unavailable or does not exist.'}</p>
          <button className="mt-5 min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={handleBackClick}>Back to rooms</button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Study room</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{room.name}</h1>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Building</dt><dd className="mt-1 text-slate-800 dark:text-slate-200">{room.building}</dd></div>
          <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Capacity</dt><dd className="mt-1 text-slate-800 dark:text-slate-200">{room.capacity} students</dd></div>
          <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Projector</dt><dd className="mt-1 text-slate-800 dark:text-slate-200">{room.hasProjector ? 'Available' : 'Not available'}</dd></div>
          <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Availability</dt><dd className="mt-1 text-slate-800 dark:text-slate-200">{room.isAvailable ? 'Available' : 'Unavailable'}</dd></div>
        </dl>
        <button className="mt-6 min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={handleBackClick}>Back to rooms</button>
      </section>
    </main>
  )
}

export default RoomDetailPage
