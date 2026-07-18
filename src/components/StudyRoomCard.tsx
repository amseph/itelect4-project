import type { MouseEvent } from 'react'
import type { StudyRoom } from '../types'

export interface StudyRoomCardProps {
  room: StudyRoom
  onReserve: (room: StudyRoom) => void
}

function StudyRoomCard({ room, onReserve }: StudyRoomCardProps) {
  const handleReserveClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur()
    onReserve(room)
  }

  return (
    <article className="info-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Study Room</p>
          <h2>{room.name}</h2>
        </div>
        <span className={room.isAvailable ? 'status is-active' : 'status is-inactive'}>
          {room.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <dl className="details-list">
        <div>
          <dt>Building</dt>
          <dd>{room.building}</dd>
        </div>
        <div>
          <dt>Capacity</dt>
          <dd>{room.capacity} students</dd>
        </div>
        <div>
          <dt>Projector</dt>
          <dd>{room.hasProjector ? 'Available' : 'Not available'}</dd>
        </div>
      </dl>

      <button
        className="primary-button"
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
