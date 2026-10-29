import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronDown, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { fetchRooms } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import StudyRoomCard from '../components/StudyRoomCard'
import useUiStore from '../store/uiStore'
import type { StudyRoom, StudyRoomAmenity } from '../types'

const amenityLabels: Record<StudyRoomAmenity, string> = { aircon: 'Air conditioning', tv: 'TV', whiteboard: 'Whiteboard', projector: 'Projector', 'quiet-zone': 'Quiet zone' }

function RoomsPage() {
  const navigate = useNavigate()
  const { data: rooms = [], isPending, isError, error, refetch } = useQuery<StudyRoom[]>({ queryKey: ['rooms'], queryFn: fetchRooms })
  const searchTerm = useUiStore((state) => state.searchTerm)
  const setSearchTerm = useUiStore((state) => state.setSearchTerm)
  const [minimumCapacity, setMinimumCapacity] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [amenityFilters, setAmenityFilters] = useState<StudyRoomAmenity[]>([])
  const availableAmenities = [...new Set(rooms.flatMap((room) => room.amenities ?? []))].filter((amenity): amenity is StudyRoomAmenity => amenity in amenityLabels)
  const capacities = [...new Set(rooms.map((room) => room.capacity))].sort((a, b) => a - b)

  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const normalized = searchTerm.trim().toLocaleLowerCase()
    const amenityText = (room.amenities ?? []).map((amenity) => amenityLabels[amenity]?.toLocaleLowerCase() ?? amenity.toLocaleLowerCase()).join(' ')
    const matchesSearch = !normalized || room.name.toLocaleLowerCase().includes(normalized) || room.building.toLocaleLowerCase().includes(normalized) || amenityText.includes(normalized)
    const matchesCapacity = !minimumCapacity || room.capacity >= Number(minimumCapacity)
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' ? room.isAvailable : !room.isAvailable)
    const matchesAmenities = amenityFilters.every((amenity) => room.amenities?.includes(amenity))
    return matchesSearch && matchesCapacity && matchesStatus && matchesAmenities
  }), [rooms, searchTerm, minimumCapacity, statusFilter, amenityFilters])

  const clearFilters = () => { setSearchTerm(''); setMinimumCapacity(''); setStatusFilter('all'); setAmenityFilters([]) }
  const toggleAmenity = (amenity: StudyRoomAmenity) => setAmenityFilters((selected) => selected.includes(amenity) ? selected.filter((item) => item !== amenity) : [...selected, amenity])
  const activeFilterCount = Number(Boolean(searchTerm || minimumCapacity || statusFilter !== 'all')) + amenityFilters.length
  const filterButtonClass = 'inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500'

  return <PageFrame className="max-w-5xl">
    <PageHeading eyebrow="Find your space" title="Study rooms" description="Find the right space for your study session." />

    <section className="mb-6" aria-label="Room filters">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative block min-w-0 flex-1"><span className="sr-only">Search rooms, buildings, or amenities</span><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.currentTarget.value)} placeholder="Search rooms..." className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>

        <details className="relative"><summary className={`${filterButtonClass} list-none [&::-webkit-details-marker]:hidden`}>Capacity <span className="text-slate-500">{minimumCapacity ? `≥ ${minimumCapacity}` : ''}</span><ChevronDown size={15} /></summary><div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-950" role="group" aria-label="Filter by minimum capacity"><button type="button" aria-pressed={!minimumCapacity} onClick={() => setMinimumCapacity('')} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800">Any capacity</button>{capacities.map((capacity) => <button key={capacity} type="button" aria-pressed={minimumCapacity === String(capacity)} onClick={() => setMinimumCapacity(String(capacity))} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800">At least {capacity}</button>)}</div></details>

        <details className="relative"><summary className={`${filterButtonClass} list-none [&::-webkit-details-marker]:hidden`}>Amenities {amenityFilters.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-blue-100 text-xs text-blue-800 dark:bg-blue-950 dark:text-blue-200">{amenityFilters.length}</span>}<ChevronDown size={15} /></summary><div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-950"><fieldset><legend className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Choose amenities</legend><div className="grid gap-1">{availableAmenities.map((amenity) => <label key={amenity} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><input type="checkbox" checked={amenityFilters.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="size-4 accent-blue-700" />{amenityLabels[amenity]}</label>)}</div>{availableAmenities.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No amenity details are listed.</p>}</fieldset></div></details>

        <details className="relative"><summary className={`${filterButtonClass} list-none [&::-webkit-details-marker]:hidden`}>Availability <span className="text-slate-500">{statusFilter === 'all' ? '' : statusFilter === 'available' ? 'Available' : 'Unavailable'}</span><ChevronDown size={15} /></summary><div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-950" role="group" aria-label="Filter by general availability">{[['all', 'Any status'], ['available', 'Generally available'], ['unavailable', 'Unavailable']].map(([value, label]) => <button key={value} type="button" aria-pressed={statusFilter === value} onClick={() => setStatusFilter(value)} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800">{label}</button>)}</div></details>
      </div>
      <div className="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">{isPending ? 'Loading rooms…' : `${filteredRooms.length} ${filteredRooms.length === 1 ? 'room' : 'rooms'}${activeFilterCount ? ' match your filters' : ' listed'}`}</p>{activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950"><X size={15} />Clear filters</button>}</div>
    </section>

    {isPending && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading study rooms">{[1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />)}</div>}
    {isError && <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/30" role="alert"><h2 className="font-semibold text-red-900 dark:text-red-100">We couldn’t load the rooms</h2><p className="mt-1 text-sm text-red-800 dark:text-red-200">{error instanceof Error ? error.message : 'Please try again in a moment.'}</p><button type="button" onClick={() => void refetch()} className="mt-4 min-h-10 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-900 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-800 dark:text-red-100">Try again</button></section>}
    {!isPending && !isError && filteredRooms.length > 0 && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filteredRooms.map((room) => <StudyRoomCard key={room.id} room={room} onViewDetails={(selected) => navigate(`/rooms/${selected.id}`)} onReserve={(selected) => navigate('/reservations', { state: { roomId: selected.id } })} />)}</div>}
    {!isPending && !isError && filteredRooms.length === 0 && <section className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950"><h2 className="font-semibold text-slate-900 dark:text-white">No rooms match those filters</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try a different search or clear some filters.</p><button type="button" onClick={clearFilters} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:hover:bg-slate-900">Clear filters <ArrowRight size={15} /></button></section>}
    <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Generally available means room status only; it does not confirm a specific time.</p>
  </PageFrame>
}

export default RoomsPage
