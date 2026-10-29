import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, MapPin, Plus, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { createReservation, fetchReservations, fetchRooms } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import { reservationSchema, type ReservationFormValues } from '../schemas/reservationSchema'
import type { ApiReservation, NewReservation, StudyRoom } from '../types'

type Step = 1 | 2 | 3
type StatusFilter = 'all' | 'upcoming' | 'past' | 'cancelled'
const durationChoices = [{ value: 30, label: '30 min' }, { value: 60, label: '1 hour' }, { value: 90, label: '1.5 hours' }, { value: 120, label: '2 hours' }]
const amenityLabels: Record<string, string> = { aircon: 'Air conditioning', 'quiet-zone': 'Quiet zone', tv: 'TV', whiteboard: 'Whiteboard', projector: 'Projector' }

function localDateString(date = new Date()): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function apiTime(minutes: number): string { const hour = Math.floor(minutes / 60); const minute = minutes % 60; return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}` }
function timeMinutes(value: string): number { const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(value); if (!match) return 0; return ((Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(match[2]) }
function dateLabel(value: string, options?: Intl.DateTimeFormatOptions): string { const date = new Date(`${value}T12:00:00`); return date.toLocaleDateString(undefined, options ?? { month: 'short', day: 'numeric', year: 'numeric' }) }
function durationLabel(start: string, end: string): string { const total = timeMinutes(end) - timeMinutes(start); return total < 60 ? `${total} min` : total % 60 ? `${Math.floor(total / 60)}.5 hours` : `${total / 60} ${total === 60 ? 'hour' : 'hours'}` }

function ReservationsPage() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const routeRoomId = (location.state as { roomId?: unknown } | null)?.roomId
  const preferredRoomId = typeof routeRoomId === 'number' && Number.isInteger(routeRoomId) ? routeRoomId : 0
  const [step, setStep] = useState<Step>(1)
  const [isCreating, setIsCreating] = useState(preferredRoomId > 0)
  const [duration, setDuration] = useState(60)
  const [dateMode, setDateMode] = useState<'quick' | 'other'>('quick')
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const roomsQuery = useQuery<StudyRoom[]>({ queryKey: ['rooms'], queryFn: fetchRooms })
  const reservationsQuery = useQuery<ApiReservation[]>({ queryKey: ['reservations'], queryFn: fetchReservations })
  const rooms = useMemo(() => roomsQuery.data ?? [], [roomsQuery.data])
  const roomById = useMemo(() => new Map(rooms.map((room) => [room.id, room])), [rooms])
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<ReservationFormValues>({ resolver: zodResolver(reservationSchema), mode: 'onBlur', defaultValues: { roomId: 0, date: localDateString(), startTime: '', endTime: '', purpose: '' } })
  const watchedValues = useWatch({ control, defaultValue: { roomId: 0, date: localDateString(), startTime: '', endTime: '', purpose: '' } })
  const today = localDateString()
  const values: ReservationFormValues = { roomId: watchedValues.roomId ?? 0, date: watchedValues.date ?? today, startTime: watchedValues.startTime ?? '', endTime: watchedValues.endTime ?? '', purpose: watchedValues.purpose ?? '' }
  const dateOptions = Array.from({ length: 2 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() + index); const value = localDateString(date); return { value, title: index === 0 ? 'Today' : 'Tomorrow', date: dateLabel(value, { month: 'short', day: 'numeric' }) } })
  const selectedRoom = roomById.get(values.roomId)
  const startMinutes = timeMinutes(values.startTime)
  const endMinutes = startMinutes + duration
  const validTime = Boolean(values.startTime) && endMinutes < 24 * 60
  const startTimeChoices = Array.from({ length: 48 }, (_, index) => index * 30).filter((minutes) => minutes + duration < 24 * 60)

  useEffect(() => {
    if (preferredRoomId > 0) {
      if (rooms.some((room) => room.id === preferredRoomId && room.isAvailable)) setValue('roomId', preferredRoomId)
    }
  }, [preferredRoomId, rooms, setValue])

  const reservationMutation = useMutation<ApiReservation, Error, NewReservation>({
    mutationFn: createReservation,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['reservations'] }); setIsCreating(false); setStep(1) },
  })

  const selectStart = (value: string) => { setValue('startTime', value, { shouldDirty: true, shouldValidate: true }); setValue('endTime', apiTime(timeMinutes(value) + duration), { shouldDirty: true, shouldValidate: true }) }
  const selectDuration = (value: number) => { setDuration(value); if (values.startTime) setValue('endTime', apiTime(timeMinutes(values.startTime) + value), { shouldDirty: true, shouldValidate: true }) }
  const goNextFromWhen = () => { if (!values.date || values.date < today || !validTime) return; setStep(2) }
  const goNextFromRoom = () => { if (selectedRoom?.isAvailable) setStep(3) }
  const onSubmit = (formValues: ReservationFormValues) => reservationMutation.mutate({ ...formValues, endTime: apiTime(endMinutes) })
  const startNewReservation = () => { reset({ roomId: rooms.some((room) => room.id === preferredRoomId && room.isAvailable) ? preferredRoomId : 0, date: localDateString(), startTime: '', endTime: '', purpose: '' }); setDuration(60); setDateMode('quick'); setStep(1); reservationMutation.reset(); setIsCreating(true) }
  const cancelReservation = () => { reset({ roomId: 0, date: localDateString(), startTime: '', endTime: '', purpose: '' }); setDuration(60); setDateMode('quick'); setIsCreating(false); setStep(1); reservationMutation.reset() }
  const reservations = [...(reservationsQuery.data ?? [])].sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))
  const filteredReservations = reservations.filter((reservation) => {
    if (activeFilter === 'cancelled') return reservation.status === 'cancelled' || reservation.status === 'rejected'
    if (activeFilter === 'past') return reservation.date < today || reservation.status === 'completed'
    if (activeFilter === 'upcoming') return reservation.date >= today && reservation.status !== 'cancelled' && reservation.status !== 'rejected' && reservation.status !== 'completed'
    return true
  })

  return <PageFrame className="max-w-5xl">
    <PageHeading eyebrow={isCreating ? 'New booking' : 'Your bookings'} title={isCreating ? 'Create a reservation' : 'Your reservations'} description={isCreating ? 'Choose a time, select a room, and review your request.' : 'View and manage your study room bookings.'} actions={!isCreating ? <button type="button" onClick={startNewReservation} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"><Plus size={17} />New reservation</button> : undefined} />

    {isCreating ? <ReservationWizard step={step} rooms={rooms} roomsPending={roomsQuery.isPending} roomsError={roomsQuery.isError} roomsRetry={() => void roomsQuery.refetch()} values={values} errors={errors} register={register} setValue={setValue} selectedRoom={selectedRoom} dateOptions={dateOptions} dateMode={dateMode} setDateMode={setDateMode} today={today} duration={duration} selectDuration={selectDuration} startTimeChoices={startTimeChoices} selectStart={selectStart} validTime={validTime} endMinutes={endMinutes} onCancel={cancelReservation} onNextWhen={goNextFromWhen} onNextRoom={goNextFromRoom} onBack={() => setStep((current) => current === 3 ? 2 : 1)} onSubmit={handleSubmit(onSubmit)} isSubmitting={reservationMutation.isPending} submitError={reservationMutation.isError ? reservationMutation.error.message : undefined} submitSuccess={reservationMutation.isSuccess} /> : <>{reservationMutation.isSuccess && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100" role="status">Reservation request submitted. You can follow its status below.</p>}<ReservationsList reservations={filteredReservations} roomById={roomById} isPending={reservationsQuery.isPending} isError={reservationsQuery.isError} retry={() => void reservationsQuery.refetch()} activeFilter={activeFilter} setActiveFilter={setActiveFilter} /></>}
  </PageFrame>
}

type WizardProps = {
  step: Step; rooms: StudyRoom[]; roomsPending: boolean; roomsError: boolean; roomsRetry: () => void
  values: ReservationFormValues; errors: FieldErrors<ReservationFormValues>; register: ReturnType<typeof useForm<ReservationFormValues>>['register']; setValue: UseFormSetValue<ReservationFormValues>; selectedRoom?: StudyRoom
  dateOptions: { value: string; title: string; date: string }[]; dateMode: 'quick' | 'other'; setDateMode: (mode: 'quick' | 'other') => void; today: string
  duration: number; selectDuration: (value: number) => void; startTimeChoices: number[]; selectStart: (value: string) => void; validTime: boolean; endMinutes: number
  onCancel: () => void; onNextWhen: () => void; onNextRoom: () => void; onBack: () => void; onSubmit: () => void; isSubmitting: boolean; submitError?: string; submitSuccess: boolean
}

function ReservationWizard(props: WizardProps) {
  const { step, rooms, roomsPending, roomsError, roomsRetry, values, errors, register, setValue, selectedRoom, dateOptions, dateMode, setDateMode, today, duration, selectDuration, startTimeChoices, selectStart, validTime, endMinutes, onCancel, onNextWhen, onNextRoom, onBack, onSubmit, isSubmitting, submitError, submitSuccess } = props
  const availableRooms = rooms.filter((room) => room.isAvailable)
  return <section aria-labelledby="reservation-flow-title">
    <div className="mb-6 flex items-center gap-2" aria-label={`Step ${step} of 3`}>
      {[['When', 1], ['Choose a room', 2], ['Details & confirm', 3]].map(([label, number]) => { const index = Number(number) as Step; return <div key={label} className="flex min-w-0 flex-1 items-center gap-2"><span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${step === index ? 'bg-blue-700 text-white' : step > index ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{step > index ? <Check size={14} /> : index}</span><span className={`truncate text-xs font-medium sm:text-sm ${step === index ? 'text-slate-950 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>{index < 3 && <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />}</div> })}
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
      {step === 1 && <>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choose when you want to study.</p>
        <div className="mt-5"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Date</h3><div className="mt-2 grid max-w-lg grid-cols-3 gap-2">{dateOptions.map((option) => <button key={option.value} type="button" onClick={() => { setDateMode('quick'); setValue('date', option.value, { shouldDirty: true, shouldValidate: true }) }} className={`min-h-11 rounded-lg border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${values.date === option.value && dateMode === 'quick' ? 'border-blue-600 bg-blue-50 font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-200' : 'border-slate-200 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500'}`}>{option.title} <span className="text-slate-500 dark:text-slate-400">{option.date}</span></button>)}<button type="button" onClick={() => setDateMode('other')} className={`min-h-11 rounded-lg border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${dateMode === 'other' ? 'border-blue-600 bg-blue-50 font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-200' : 'border-slate-200 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300'}`}>Other date</button></div>
          {dateMode === 'other' && <div className="mt-3 max-w-xs"><label htmlFor="reservation-date" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Choose a date</label><input id="reservation-date" type="date" min={today} {...register('date')} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:[color-scheme:dark]" /></div>}
        </div>
        <div className="mt-5 grid max-w-2xl gap-5 sm:grid-cols-[minmax(14rem,0.8fr)_minmax(18rem,1fr)]">
          <div><h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Clock3 size={16} className="text-slate-500" />Start time</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Requested preference, not live availability.</p><details className="relative mt-2 max-w-xs"><summary aria-label="Choose start time" className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">{values.startTime || 'Select a start time'}<ChevronDown size={16} className="text-slate-500" /></summary><div className="absolute left-0 z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-950" role="group" aria-label="Requested start time">{startTimeChoices.map((minutes) => { const label = apiTime(minutes); return <button key={minutes} type="button" onClick={(event) => { selectStart(label); event.currentTarget.closest('details')?.removeAttribute('open') }} aria-pressed={values.startTime === label} className={`min-h-9 w-full rounded-md px-3 text-left text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800 ${values.startTime === label ? 'font-semibold text-blue-800 dark:text-blue-200' : 'text-slate-700 dark:text-slate-300'}`}>{label}</button> })}</div></details></div>
          <fieldset><legend className="text-sm font-semibold text-slate-900 dark:text-white">Duration</legend><div className="mt-2 grid grid-cols-2 gap-2">{durationChoices.map((choice) => <button key={choice.value} type="button" onClick={() => selectDuration(choice.value)} aria-pressed={duration === choice.value} className={`min-h-11 rounded-lg border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${duration === choice.value ? 'border-blue-600 bg-blue-50 font-semibold text-blue-800 dark:bg-blue-950/40 dark:text-blue-200' : 'border-slate-200 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300'}`}>{choice.label}</button>)}</div></fieldset>
        </div>
        {values.startTime && <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">Requested: {values.startTime}–{apiTime(timeMinutes(values.startTime) + duration)}</p>}
        {values.date < today && <FieldError>Choose today or a future date.</FieldError>}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-between"><button type="button" onClick={onCancel} className="min-h-10 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900">Cancel</button><button type="button" onClick={onNextWhen} disabled={!values.date || values.date < today || !validTime} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50">Next: Choose a room <ArrowRight size={16} /></button></div>
      </>}

      {step === 2 && <>
        <h2 id="reservation-flow-title" className="text-xl font-semibold text-slate-950 dark:text-white">Choose a room</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{values.date && dateLabel(values.date)} · {values.startTime}–{validTime ? apiTime(endMinutes) : 'Select a time'}</p>
        {roomsPending && <p className="mt-5 rounded-lg border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400" role="status">Loading rooms…</p>}
        {roomsError && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100" role="alert">Rooms could not be loaded. <button type="button" onClick={roomsRetry} className="font-semibold underline">Try again</button></div>}
        {!roomsPending && !roomsError && <div className="mt-5 space-y-2">{availableRooms.map((room) => {
          const selected = values.roomId === room.id
          return <button key={room.id} type="button" onClick={() => setValue('roomId', room.id, { shouldDirty: true, shouldValidate: true })} aria-pressed={selected} className={`w-full rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${selected ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30' : 'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-400 dark:border-slate-500'}`}>{selected && <Check size={13} />}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-semibold text-slate-950 dark:text-white">{room.name}</span><span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Generally available</span></span>
                <span className="mt-1 flex flex-wrap gap-x-3 text-sm text-slate-600 dark:text-slate-400"><span className="inline-flex items-center gap-1"><MapPin size={13} />{room.building}</span><span className="inline-flex items-center gap-1"><Users size={13} />Capacity {room.capacity}</span></span>
                {room.amenities && room.amenities.length > 0 && <span className="mt-2 flex flex-wrap gap-1.5">{room.amenities.map((amenity) => <span key={amenity} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{amenityLabels[amenity] ?? amenity}</span>)}</span>}
              </span>
            </div>
          </button>
        })}{availableRooms.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">No generally available rooms can be selected right now.</p>}</div>}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-between"><button type="button" onClick={onBack} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"><ArrowLeft size={15} />Back</button><button type="button" onClick={onNextRoom} disabled={!selectedRoom?.isAvailable} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50">Next: Details &amp; confirm <ArrowRight size={16} /></button></div>
      </>}

      {step === 3 && <>
        <h2 id="reservation-flow-title" className="text-xl font-semibold text-slate-950 dark:text-white">Details &amp; confirm</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Review your reservation before submitting.</p>
        <form className="mt-5" onSubmit={(event) => { event.preventDefault(); onSubmit() }} noValidate>
          {selectedRoom && <div className="border-b border-slate-200 pb-4 dark:border-slate-800"><h3 className="font-semibold text-slate-950 dark:text-white">{selectedRoom.name}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selectedRoom.building} · Capacity {selectedRoom.capacity}</p>{selectedRoom.amenities && selectedRoom.amenities.length > 0 && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selectedRoom.amenities.map((amenity) => amenityLabels[amenity] ?? amenity).join(' · ')}</p>}</div>}
          <dl className="grid gap-x-8 gap-y-4 border-b border-slate-200 py-4 text-sm dark:border-slate-800 sm:grid-cols-3"><div><dt className="text-slate-500 dark:text-slate-400">Date</dt><dd className="mt-1 font-medium text-slate-900 dark:text-white">{dateLabel(values.date)}</dd></div><div><dt className="text-slate-500 dark:text-slate-400">Requested time</dt><dd className="mt-1 font-medium text-slate-900 dark:text-white">{values.startTime}–{apiTime(endMinutes)}</dd></div><div><dt className="text-slate-500 dark:text-slate-400">Duration</dt><dd className="mt-1 font-medium text-slate-900 dark:text-white">{durationLabel(values.startTime, apiTime(endMinutes))}</dd></div></dl>
          <div className="max-w-xl pt-4"><label htmlFor="reservation-purpose" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Purpose</label><input id="reservation-purpose" type="text" placeholder="e.g. To study" {...register('purpose')} aria-invalid={Boolean(errors.purpose)} aria-describedby={errors.purpose ? 'purpose-error' : undefined} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />{errors.purpose?.message && <FieldError id="purpose-error">{errors.purpose.message}</FieldError>}</div>
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Submitting a request does not guarantee that the selected time is available.</p>
          {submitError && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100" role="alert">{submitError}</p>}
          {submitSuccess && <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100" role="status">Reservation request submitted. You can follow its status below.</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-between"><button type="button" onClick={onBack} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"><ArrowLeft size={15} />Back</button><button type="submit" disabled={isSubmitting || !selectedRoom} className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Submitting…' : 'Confirm reservation'}</button></div>
        </form>
      </>}
    </div>
  </section>
}

function ReservationsList({ reservations, roomById, isPending, isError, retry, activeFilter, setActiveFilter }: { reservations: ApiReservation[]; roomById: Map<number, StudyRoom>; isPending: boolean; isError: boolean; retry: () => void; activeFilter: StatusFilter; setActiveFilter: (filter: StatusFilter) => void }) {
  const tabs: { value: StatusFilter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }, { value: 'cancelled', label: 'Cancelled' }]
  return <section aria-label="Reservation list">
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800" role="group" aria-label="Filter reservations">{tabs.map((tab) => <button key={tab.value} type="button" aria-pressed={activeFilter === tab.value} onClick={() => setActiveFilter(tab.value)} className={`min-h-10 shrink-0 border-b-2 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${activeFilter === tab.value ? 'border-blue-700 text-blue-800 dark:text-blue-200' : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'}`}>{tab.label}</button>)}</div>
    {isPending && <ListState role="status">Loading your reservations…</ListState>}
    {isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100" role="alert">We couldn’t load your reservations. <button type="button" onClick={retry} className="font-semibold underline">Try again</button></div>}
    {!isPending && !isError && reservations.length === 0 && <ListState>{activeFilter === 'all' ? 'You have no reservations yet. Create one to get started.' : `No ${activeFilter} reservations.`}</ListState>}
    {!isPending && !isError && reservations.length > 0 && <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">{reservations.map((reservation) => <ReservationRow key={reservation.id} reservation={reservation} room={roomById.get(reservation.roomId)} />)}</div>}
  </section>
}

function ReservationRow({ reservation, room }: { reservation: ApiReservation; room?: StudyRoom }) { return <article className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className="text-sm font-semibold text-slate-950 dark:text-white">{room?.name ?? `Room ${reservation.roomId}`}</h2><StatusBadge status={reservation.status} /></div><p className="mt-1 flex flex-wrap gap-x-3 text-sm text-slate-600 dark:text-slate-400"><span className="inline-flex items-center gap-1"><MapPin size={13} />{room?.building ?? 'Location unavailable'}</span><span>{dateLabel(reservation.date)} · {reservation.startTime}–{reservation.endTime}</span></p></div>{room && <Link to={`/rooms/${room.id}`} className="inline-flex min-h-9 shrink-0 items-center text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">View details <ArrowRight size={14} className="ml-1" /></Link>}</article> }
function StatusBadge({ status }: { status: string }) { const tone = status === 'approved' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200' : status === 'pending' ? 'text-amber-800 bg-amber-50 dark:bg-amber-950 dark:text-amber-200' : status === 'rejected' ? 'text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-200' : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'; return <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${tone}`}>{status}</span> }
function ListState({ children, role }: { children: React.ReactNode; role?: 'status' | 'alert' }) { return <div role={role} className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">{children}</div> }
function FieldError({ children, id }: { children: React.ReactNode; id?: string }) { return <p id={id} className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">{children}</p> }

export default ReservationsPage
