import type { MouseEvent } from 'react'
import type { StudyRoom } from '../types'

export interface StudyRoomCardProps {
  room: StudyRoom
  onReserve: (room: StudyRoom) => void
  variant?: 'default' | 'compact'
}

function StudyRoomCard({ room, onReserve, variant = 'default' }: StudyRoomCardProps) {
  const handleReserveClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur()
    onReserve(room)
  }

  return (
    <article className={`${variant === 'compact' ? 'gap-3 p-4' : 'gap-4 p-5'} flex min-h-72 flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Study Room</p>
          <h2 className={`${variant === 'compact' ? 'text-base' : 'text-lg'} font-semibold text-slate-900 dark:text-white`}>{room.name}</h2>
        </div>
        <span className={room.isAvailable ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400'}>
          {room.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="grid gap-1"><dt className="font-semibold text-slate-500 dark:text-slate-400">Building</dt><dd className="text-slate-800 dark:text-slate-200">{room.building}</dd>
        </div>
        <div className="grid gap-1"><dt className="font-semibold text-slate-500 dark:text-slate-400">Capacity</dt><dd className="text-slate-800 dark:text-slate-200">{room.capacity} students</dd>
        </div>
        <div className="grid gap-1"><dt className="font-semibold text-slate-500 dark:text-slate-400">Projector</dt><dd className="text-slate-800 dark:text-slate-200">{room.hasProjector ? 'Available' : 'Not available'}</dd>
        </div>
      </dl>

      <button
        className="mt-auto min-h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100 dark:focus:ring-offset-slate-900 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
        type="button"
        onClick={handleReserveClick}
        disabled={!room.isAvailable}
      >
        Reserve room
      </button>
    </article>
  )
}

export default StudyRoomCard
