import { ArrowRight, MapPin, Users } from 'lucide-react'
import type { StudyRoom } from '../types'

const amenityLabels: Record<string, string> = { aircon: 'Air conditioning', tv: 'TV', whiteboard: 'Whiteboard', projector: 'Projector', 'quiet-zone': 'Quiet zone' }

export interface StudyRoomCardProps {
  room: StudyRoom
  onViewDetails: (room: StudyRoom) => void
  onReserve: (room: StudyRoom) => void
}

function StudyRoomCard({ room, onViewDetails, onReserve }: StudyRoomCardProps) {
  const amenities = [...new Set(room.amenities ?? [])]
  return (
    <article className="flex min-h-[14rem] flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h2 className="text-base font-semibold text-slate-950 dark:text-white">{room.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><MapPin size={14} className="shrink-0" />{room.building}</p></div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${room.isAvailable ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{room.isAvailable ? 'Generally available' : 'Unavailable'}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><Users size={16} className="text-slate-500" />Capacity: {room.capacity}</p>
      {amenities.length > 0 ? <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Room amenities">{amenities.map((amenity) => <li key={amenity} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{amenityLabels[amenity] ?? amenity}</li>)}</ul> : <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">No amenity information provided.</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
        <button type="button" onClick={() => onViewDetails(room)} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950">Details <ArrowRight size={15} /></button>
        <button type="button" onClick={() => onReserve(room)} disabled={!room.isAvailable} className="min-h-10 rounded-lg bg-blue-700 px-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">{room.isAvailable ? 'Reserve' : 'Unavailable'}</button>
      </div>
    </article>
  )
}

export default StudyRoomCard
