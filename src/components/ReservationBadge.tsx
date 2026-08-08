import type { FC, ReactNode } from 'react'
import type { Reservation } from '../types'

export interface ReservationBadgeProps {
  reservation: Reservation
  children?: ReactNode
}

const ReservationBadge: FC<ReservationBadgeProps> = ({ reservation, children }) => {
  const statusClass = reservation.status === 'approved' || reservation.status === 'completed'
    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    : reservation.status === 'pending'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700">
      <div className="flex items-start justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span className={`rounded-full px-2.5 py-1 font-bold capitalize ${statusClass}`}>{reservation.status}</span>
        <span>{reservation.date}</span>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{reservation.purpose}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {reservation.startTime} to {reservation.endTime}
      </p>
      {children ? <div className="text-sm text-slate-500 dark:text-slate-400">{children}</div> : null}
    </article>
  )
}

export default ReservationBadge
