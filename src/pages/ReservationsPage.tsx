import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReservation, fetchReservations } from '../api/client'
import ReservationBadge from '../components/ReservationBadge'
import useToggle from '../hooks/useToggle'
import { ReservationStatus } from '../types'
import type { NewReservation, Reservation } from '../types'

const initialReservation: NewReservation = {
  userId: 1,
  roomId: 101,
  date: '2026-08-22',
  startTime: '10:00 AM',
  endTime: '12:00 PM',
  purpose: '',
  status: ReservationStatus.Pending,
}

function ReservationsPage() {
  const queryClient = useQueryClient()
  const { data: reservations = [], isPending, isError, error, refetch } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  })
  const [newReservation, setNewReservation] = useState<NewReservation>(initialReservation)
  const [showReservationDetails, toggleReservationDetails] = useToggle(true)
  const createReservationMutation = useMutation<Reservation, Error, NewReservation>({
    mutationFn: createReservation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  })

  const handleReservationChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget
    setNewReservation((current) => ({
      ...current,
      [name]: name === 'userId' || name === 'roomId' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    createReservationMutation.mutate(newReservation)
  }

  if (isPending) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8"><section className="mx-auto max-w-6xl animate-pulse"><div className="mb-3 h-3 w-56 rounded bg-slate-300" /><div className="mb-4 h-10 w-3/4 rounded bg-slate-300" /><div className="h-5 w-full max-w-xl rounded bg-slate-200" /><p className="sr-only">Loading reservation data...</p></section></main>
  }

  if (isError) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8"><section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm"><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">Unable to load reservations</p><h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1><p className="mb-5 text-sm text-red-800">{error instanceof Error ? error.message : 'We could not display the reservation data. Please try again.'}</p><button className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" type="button" onClick={() => void refetch()}>Try again</button></section></main>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Reservation records</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Current requests</h1></div>
          <button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" type="button" onClick={toggleReservationDetails}>{showReservationDetails ? 'Hide reservation details' : 'Show reservation details'}</button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="new-reservation-title">
          <h2 id="new-reservation-title" className="text-lg font-semibold text-slate-950">New reservation</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-slate-700">User ID<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="number" name="userId" min="1" required value={newReservation.userId} onChange={handleReservationChange} /></label>
            <label className="text-sm font-medium text-slate-700">Room ID<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="number" name="roomId" min="1" required value={newReservation.roomId} onChange={handleReservationChange} /></label>
            <label className="text-sm font-medium text-slate-700">Date<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="date" name="date" required value={newReservation.date} onChange={handleReservationChange} /></label>
            <label className="text-sm font-medium text-slate-700">Start time<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="text" name="startTime" required value={newReservation.startTime} onChange={handleReservationChange} /></label>
            <label className="text-sm font-medium text-slate-700">End time<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="text" name="endTime" required value={newReservation.endTime} onChange={handleReservationChange} /></label>
            <label className="text-sm font-medium text-slate-700">Purpose<input className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" type="text" name="purpose" required value={newReservation.purpose} onChange={handleReservationChange} /></label>
            <div className="sm:col-span-2"><button className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={createReservationMutation.isPending}>{createReservationMutation.isPending ? 'Creating reservation...' : 'Create reservation'}</button>{createReservationMutation.isError && <p className="mt-2 text-sm text-red-700" role="alert">{createReservationMutation.error instanceof Error ? createReservationMutation.error.message : 'Unable to create reservation. Please try again.'}</p>}</div>
          </form>
        </section>

        {showReservationDetails && <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Reservations">{reservations.map((reservation) => <ReservationBadge key={reservation.id} reservation={reservation}>Reservation information loaded dynamically.</ReservationBadge>)}</section>}
      </div>
    </main>
  )
}

export default ReservationsPage
