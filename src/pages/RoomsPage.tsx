import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react'
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
  const availableAmenities = [...new Set(rooms.flatMap((room) => room.amenities ?? []))].filter((value): value is StudyRoomAmenity => value in amenityLabels)
  const capacities = [...new Set(rooms.map((room) => room.capacity))].sort((a, b) => a - b)

  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const normalized = searchTerm.trim().toLocaleLowerCase()
    const matchesSearch = !normalized || room.name.toLocaleLowerCase().includes(normalized) || room.building.toLocaleLowerCase().includes(normalized)
    const matchesCapacity = !minimumCapacity || room.capacity >= Number(minimumCapacity)
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' ? room.isAvailable : !room.isAvailable)
    const matchesAmenities = amenityFilters.every((amenity) => room.amenities?.includes(amenity))
    return matchesSearch && matchesCapacity && matchesStatus && matchesAmenities
  }), [rooms, searchTerm, minimumCapacity, statusFilter, amenityFilters])

  const clearFilters = () => { setSearchTerm(''); setMinimumCapacity(''); setStatusFilter('all'); setAmenityFilters([]) }
  const toggleAmenity = (amenity: StudyRoomAmenity) => setAmenityFilters((selected) => selected.includes(amenity) ? selected.filter((item) => item !== amenity) : [...selected, amenity])
  const activeFilterCount = Number(Boolean(searchTerm || minimumCapacity || statusFilter !== 'all')) + amenityFilters.length

  return <PageFrame>
    <PageHeading eyebrow="Find your space" title="Study rooms" description="Search campus rooms by name, capacity, availability, and the amenities listed for each space." />

    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5" aria-label="Room filters">
      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1.5fr)_repeat(2,minmax(10rem,0.8fr))]">
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Search rooms</span><span className="relative block"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.currentTarget.value)} placeholder="Room name or building" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></span></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Minimum capacity</span><select value={minimumCapacity} onChange={(event) => setMinimumCapacity(event.currentTarget.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="">Any capacity</option>{capacities.map((capacity) => <option key={capacity} value={capacity}>At least {capacity}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">General status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.currentTarget.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="all">Any status</option><option value="available">Generally available</option><option value="unavailable">Unavailable</option></select></label>
      </div>
      {availableAmenities.length > 0 && <fieldset className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800"><legend className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><SlidersHorizontal size={16} />Amenities</legend><div className="mt-3 flex flex-wrap gap-2">{availableAmenities.map((amenity) => <label key={amenity} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${amenityFilters.includes(amenity) ? 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}><input type="checkbox" checked={amenityFilters.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="size-4 accent-blue-700" />{amenityLabels[amenity]}</label>)}</div></fieldset>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"><p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">{isPending ? 'Loading rooms…' : `${filteredRooms.length} ${filteredRooms.length === 1 ? 'room' : 'rooms'}${activeFilterCount ? ' match your filters' : ' listed'}`}</p>{activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950"><X size={15} />Clear filters</button>}</div>
    </section>

    {isPending && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading study rooms">{[1,2,3].map((item) => <div key={item} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />)}</div>}
    {isError && <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/30" role="alert"><h2 className="font-semibold text-red-900 dark:text-red-100">We couldn’t load the rooms</h2><p className="mt-1 text-sm text-red-800 dark:text-red-200">{error instanceof Error ? error.message : 'Please try again in a moment.'}</p><button type="button" onClick={() => void refetch()} className="mt-4 min-h-10 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-900 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-800 dark:text-red-100">Try again</button></section>}
    {!isPending && !isError && filteredRooms.length > 0 && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filteredRooms.map((room) => <StudyRoomCard key={room.id} room={room} onViewDetails={(selected) => navigate(`/rooms/${selected.id}`)} onReserve={(selected) => navigate('/reservations', { state: { roomId: selected.id } })} />)}</div>}
    {!isPending && !isError && filteredRooms.length === 0 && <section className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950"><h2 className="font-semibold text-slate-900 dark:text-white">No rooms match those filters</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try a different search or clear some filters.</p><button type="button" onClick={clearFilters} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:hover:bg-slate-900">Clear filters <ArrowRight size={15} /></button></section>}
    <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">“Generally available” is a room status only. It does not confirm availability for a specific date or time.</p>
  </PageFrame>
}

export default RoomsPage
