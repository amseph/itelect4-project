import ReservationBadge from './components/ReservationBadge'
import StudyRoomCard from './components/StudyRoomCard'
import UserCard from './components/UserCard'
import { ReservationStatus, Role } from './types'
import type { Reservation, StudyRoom, User } from './types'
import './App.css'

function App() {
  const sampleUser: User = {
    id: 1,
    name: 'Mika Santos',
    email: 'mika.santos@campus.edu',
    role: Role.Student,
    isActive: true,
  }

  const sampleRoom: StudyRoom = {
    id: 101,
    name: 'Quiet Study Room A',
    building: 'Learning Commons',
    capacity: 6,
    hasProjector: true,
    isAvailable: true,
  }

  const sampleReservation: Reservation = {
    id: 5001,
    userId: sampleUser.id,
    roomId: sampleRoom.id,
    date: '2026-07-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    purpose: 'Group research meeting',
    status: ReservationStatus.Pending,
  }

  const handleUserSelect = (user: User): void => {
    console.info(`Selected user: ${user.name}`)
  }

  const handleRoomReserve = (room: StudyRoom): void => {
    console.info(`Reserve room requested: ${room.name}`)
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <p className="eyebrow">Campus Study Room Reservation System</p>
        <h1>Reservation overview</h1>
        <p>
          Review the selected student, available study room, and current
          reservation request.
        </p>
      </section>

      <section className="component-grid" aria-label="Reservation sample data">
        <UserCard user={sampleUser} onSelect={handleUserSelect} />
        <StudyRoomCard room={sampleRoom} onReserve={handleRoomReserve} />
        <ReservationBadge reservation={sampleReservation}>
          Awaiting library admin approval.
        </ReservationBadge>
      </section>
    </main>
  )
}

export default App
