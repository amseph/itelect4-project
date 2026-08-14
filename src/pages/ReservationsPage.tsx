import { useEffect, useState } from 'react'
import ReservationBadge from '../components/ReservationBadge'
import { mockReservations } from '../data/mockData'
import useToggle from '../hooks/useToggle'
import type { Reservation } from '../types'

function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [showReservationDetails, toggleReservationDetails] = useToggle(true)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setReservations(mockReservations)
      setIsLoading(false)
    }, 600)

    return () => window.clearTimeout(timerId)
  }, [])

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8"><section className="mx-auto max-w-6xl animate-pulse"><div className="mb-3 h-3 w-56 rounded bg-slate-300" /><div className="mb-4 h-10 w-3/4 rounded bg-slate-300" /><div className="h-5 w-full max-w-xl rounded bg-slate-200" /><p className="sr-only">Loading reservation data...</p></section></main>
  }

  if (isError) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8"><section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm"><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">Unable to load reservations</p><h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1><p className="mb-5 text-sm text-red-800">We could not display the reservation data. Please try again.</p><button className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" type="button" onClick={() => setIsError(false)}>Try again</button></section></main>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Reservation records</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Current requests</h1></div>
          <div className="flex flex-col gap-2 sm:flex-row"><button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" type="button" onClick={toggleReservationDetails}>{showReservationDetails ? 'Hide reservation details' : 'Show reservation details'}</button><button className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2" type="button" onClick={() => setIsError(true)}>Simulate error</button></div>
        </section>
        {showReservationDetails && <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Reservations">{reservations.map((reservation) => <ReservationBadge key={reservation.id} reservation={reservation}>Reservation information loaded dynamically.</ReservationBadge>)}</section>}
      </div>
    </main>
  )
}

export default ReservationsPage
