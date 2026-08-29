import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createReservation, fetchReservations } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { reservationSchema } from '@/schemas/reservationSchema'
import type { ReservationFormValues } from '@/schemas/reservationSchema'
import ReservationBadge from '../components/ReservationBadge'
import useToggle from '../hooks/useToggle'
import { ReservationStatus } from '../types'
import type { NewReservation, Reservation } from '../types'

const initialReservation: ReservationFormValues = {
  userId: 1,
  roomId: 101,
  date: '2026-08-22',
  startTime: '10:00 AM',
  endTime: '12:00 PM',
  purpose: '',
}

function ReservationsPage() {
  const queryClient = useQueryClient()
  const { data: reservations = [], isPending, isError, error, refetch } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  })
  const [showReservationDetails, toggleReservationDetails] = useToggle(true)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: 'onBlur',
    defaultValues: initialReservation,
  })
  const addReservation = useMutation<Reservation, Error, NewReservation>({
    mutationFn: createReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations'] })
      reset()
    },
  })

  const onSubmit = (values: ReservationFormValues): void => {
    addReservation.mutate({
      ...values,
      status: ReservationStatus.Pending,
    })
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
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-user-id">User ID</Label>
              <Input id="reservation-user-id" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="number" min="1" aria-invalid={errors.userId ? true : undefined} aria-describedby={errors.userId ? 'reservation-user-id-error' : undefined} {...register('userId', { valueAsNumber: true })} />
              {errors.userId && <p id="reservation-user-id-error" className="mt-1 text-sm text-red-600">{errors.userId.message}</p>}
            </div>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-room-id">Room ID</Label>
              <Input id="reservation-room-id" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="number" min="1" aria-invalid={errors.roomId ? true : undefined} aria-describedby={errors.roomId ? 'reservation-room-id-error' : undefined} {...register('roomId', { valueAsNumber: true })} />
              {errors.roomId && <p id="reservation-room-id-error" className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>}
            </div>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-date">Date</Label>
              <Input id="reservation-date" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="date" aria-invalid={errors.date ? true : undefined} aria-describedby={errors.date ? 'reservation-date-error' : undefined} {...register('date')} />
              {errors.date && <p id="reservation-date-error" className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-start-time">Start time</Label>
              <Input id="reservation-start-time" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="text" aria-invalid={errors.startTime ? true : undefined} aria-describedby={errors.startTime ? 'reservation-start-time-error' : undefined} {...register('startTime')} />
              {errors.startTime && <p id="reservation-start-time-error" className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>}
            </div>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-end-time">End time</Label>
              <Input id="reservation-end-time" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="text" aria-invalid={errors.endTime ? true : undefined} aria-describedby={errors.endTime ? 'reservation-end-time-error' : undefined} {...register('endTime')} />
              {errors.endTime && <p id="reservation-end-time-error" className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>}
            </div>
            <div>
              <Label className="text-slate-700" htmlFor="reservation-purpose">Purpose</Label>
              <Input id="reservation-purpose" className="mt-1 min-h-11 border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-blue-500/30" type="text" aria-invalid={errors.purpose ? true : undefined} aria-describedby={errors.purpose ? 'reservation-purpose-error' : undefined} {...register('purpose')} />
              {errors.purpose && <p id="reservation-purpose-error" className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>}
            </div>
            <div className="sm:col-span-2"><Button className="min-h-11 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500" type="submit" disabled={addReservation.isPending}>{addReservation.isPending ? 'Creating reservation...' : 'Create reservation'}</Button>{addReservation.isError && <p className="mt-2 text-sm text-red-700" role="alert">Unable to create reservation. Please try again.</p>}</div>
          </form>
        </section>

        {showReservationDetails && <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Reservations">{reservations.map((reservation) => <ReservationBadge key={reservation.id} reservation={reservation}>Reservation information loaded dynamically.</ReservationBadge>)}</section>}
      </div>
    </main>
  )
}

export default ReservationsPage
