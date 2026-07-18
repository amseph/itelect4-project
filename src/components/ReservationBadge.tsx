import type { FC, ReactNode } from 'react'
import type { Reservation } from '../types'

export interface ReservationBadgeProps {
  reservation: Reservation
  children?: ReactNode
}

const ReservationBadge: FC<ReservationBadgeProps> = ({ reservation, children }) => {
  return (
    <article className="reservation-badge">
      <div className="badge-topline">
        <span className={`status status-${reservation.status}`}>{reservation.status}</span>
        <span>{reservation.date}</span>
      </div>
      <h2>{reservation.purpose}</h2>
      <p>
        {reservation.startTime} to {reservation.endTime}
      </p>
      {children ? <div className="badge-extra">{children}</div> : null}
    </article>
  )
}

export default ReservationBadge
