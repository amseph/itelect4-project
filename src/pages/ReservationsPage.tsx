import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { useLocation } from 'react-router'
import { createReservation, fetchReservations, fetchRooms } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import { reservationSchema, type ReservationFormValues } from '../schemas/reservationSchema'
import type { ApiReservation, NewReservation, StudyRoom } from '../types'

function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function toApiTime(value: string): string {
  if (!value) return ''
  const [rawHour, minutes] = value.split(':')
  const hour = Number(rawHour)
  const period = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:${minutes} ${period}`
}
function toInputTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(value)
  if (!match) return ''
  let hour = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${match[2]}`
}
function initialValues(roomId = 0): ReservationFormValues {
  return { roomId, date: localDateString(), startTime: '10:00 AM', endTime: '12:00 PM', purpose: '' }
}

function ReservationsPage() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const routeRoomId = (location.state as { roomId?: unknown } | null)?.roomId
  const preferredRoomId = typeof routeRoomId === 'number' && Number.isInteger(routeRoomId) ? routeRoomId : 0
  const roomsQuery = useQuery<StudyRoom[]>({ queryKey: ['rooms'], queryFn: fetchRooms })
  const reservationsQuery = useQuery<ApiReservation[]>({ queryKey: ['reservations'], queryFn: fetchReservations })
  const rooms = useMemo(() => roomsQuery.data ?? [], [roomsQuery.data])
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<ReservationFormValues>({ resolver: zodResolver(reservationSchema), mode: 'onBlur', defaultValues: initialValues(preferredRoomId) })

  useEffect(() => {
    if (preferredRoomId > 0 && rooms.some((room) => room.id === preferredRoomId && room.isAvailable)) setValue('roomId', preferredRoomId)
    else if (preferredRoomId > 0) setValue('roomId', 0)
  }, [preferredRoomId, rooms, setValue])

  const addReservation = useMutation<ApiReservation, Error, NewReservation>({
    mutationFn: createReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations'] })
      reset(initialValues(preferredRoomId > 0 && rooms.some((room) => room.id === preferredRoomId && room.isAvailable) ? preferredRoomId : 0))
    },
  })

  const onSubmit = (values: ReservationFormValues) => addReservation.mutate({ ...values })
  const today = localDateString()
  const reservations = [...(reservationsQuery.data ?? [])].sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))

  return <PageFrame>
    <PageHeading eyebrow="Your bookings" title="Reservations" description="Request a study room and keep track of your reservation status." />
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6" aria-labelledby="create-reservation-title">
        <div className="mb-5"><h2 id="create-reservation-title" className="text-lg font-semibold text-slate-950 dark:text-white">Create reservation</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choose a room and describe when you would like to use it.</p></div>
        {roomsQuery.isError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert">We couldn’t load rooms. Refresh the page or try again later.</div>}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div><label htmlFor="reservation-room-id" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Study room</label><select id="reservation-room-id" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900" aria-invalid={Boolean(errors.roomId)} aria-describedby={errors.roomId ? 'room-error' : 'room-help'} disabled={roomsQuery.isPending || roomsQuery.isError} {...register('roomId', { valueAsNumber: true })}><option value={0}>{roomsQuery.isPending ? 'Loading rooms…' : rooms.length ? 'Choose a room' : 'No rooms available'}</option>{rooms.map((room) => <option key={room.id} value={room.id} disabled={!room.isAvailable}>{room.name} · {room.building} · up to {room.capacity}{room.isAvailable ? '' : ' · unavailable'}</option>)}</select><p id="room-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Rooms marked unavailable cannot be selected. General status does not confirm a specific time slot.</p>{errors.roomId && <FieldError id="room-error">{errors.roomId.message}</FieldError>}</div>

          <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="reservation-date" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Date</label><div className="relative"><CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="reservation-date" type="date" min={today} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'date-error' : undefined} {...register('date')} /></div>{errors.date && <FieldError id="date-error">{errors.date.message}</FieldError>}</div>
            <div><label htmlFor="reservation-purpose" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Purpose</label><input id="reservation-purpose" type="text" placeholder="e.g. Group project meeting" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" aria-invalid={Boolean(errors.purpose)} aria-describedby={errors.purpose ? 'purpose-error' : undefined} {...register('purpose')} />{errors.purpose && <FieldError id="purpose-error">{errors.purpose.message}</FieldError>}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2"><Controller control={control} name="startTime" render={({ field }) => <TimeField id="reservation-start-time" label="Start time" value={toInputTime(field.value)} onChange={(value) => field.onChange(toApiTime(value))} error={errors.startTime?.message} />} /><Controller control={control} name="endTime" render={({ field }) => <TimeField id="reservation-end-time" label="End time" value={toInputTime(field.value)} onChange={(value) => field.onChange(toApiTime(value))} error={errors.endTime?.message} />} /></div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center"><button type="submit" disabled={addReservation.isPending || roomsQuery.isPending || roomsQuery.isError || rooms.length === 0} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{addReservation.isPending ? 'Submitting…' : 'Submit reservation'}</button><p className="text-xs leading-5 text-slate-500 dark:text-slate-400">A request does not confirm that the time slot is free.</p></div>
          {addReservation.isError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert">{addReservation.error.message || 'Unable to submit your reservation. Please try again.'}</div>}
          {addReservation.isSuccess && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100" role="status">Reservation request submitted. You can follow its status in My reservations.</div>}
        </form>
      </section>

      <section aria-labelledby="my-reservations-title"><div className="mb-4"><h2 id="my-reservations-title" className="text-lg font-semibold text-slate-950 dark:text-white">My reservations</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your submitted requests and their current status.</p></div>
        {reservationsQuery.isPending && <PanelState>Loading your reservations…</PanelState>}
        {reservationsQuery.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert"><p>We couldn’t load your reservations.</p><button type="button" onClick={() => void reservationsQuery.refetch()} className="mt-2 font-semibold underline underline-offset-2">Try again</button></div>}
        {!reservationsQuery.isPending && !reservationsQuery.isError && reservations.length === 0 && <PanelState>You have no reservations yet. Your requests will appear here.</PanelState>}
        {!reservationsQuery.isPending && !reservationsQuery.isError && reservations.length > 0 && <div className="space-y-3">{reservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} room={roomById.get(reservation.roomId)} />)}</div>}
      </section>
    </div>
  </PageFrame>
}

function TimeField({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string }) { return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</label><div className="relative"><Clock3 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id={id} type="time" value={value} onChange={(event) => onChange(event.currentTarget.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : `${id}-help`} />{error && <FieldError id={`${id}-error`}>{error}</FieldError>}{!error && <p id={`${id}-help`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Shown in your local time.</p>}</div></div> }
function FieldError({ id, children }: { id: string; children?: React.ReactNode }) { return <p id={id} className="mt-1.5 text-sm text-red-700 dark:text-red-300" role="alert">{children}</p> }
function PanelState({ children }: { children: React.ReactNode }) { return <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-400">{children}</div> }
function ReservationCard({ reservation, room }: { reservation: ApiReservation; room?: StudyRoom }) {
  const statusClasses: Record<string, string> = { approved: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200', completed: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200', pending: 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200', rejected: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200', cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
  return <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold text-slate-950 dark:text-white">{room?.name ?? `Room ${reservation.roomId}`}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"><MapPin size={13} />{room?.building ?? 'Location unavailable'}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses[reservation.status] ?? statusClasses.pending}`}>{reservation.status}</span></div><p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">{reservation.purpose}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{reservation.date} · {reservation.startTime}–{reservation.endTime}</p></article>
}

export default ReservationsPage
