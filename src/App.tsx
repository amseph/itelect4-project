import { useEffect, useState } from 'react'
import ReservationBadge from './components/ReservationBadge'
import StudyRoomCard from './components/StudyRoomCard'
import UserCard from './components/UserCard'
import { ReservationStatus, Role } from './types'
import type { Reservation, StudyRoom, User } from './types'
import './App.css'

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Mika Santos',
    email: 'mika.santos@campus.edu',
    role: Role.Student,
    isActive: true,
  },
  {
    id: 2,
    name: 'Andrea Cruz',
    email: 'andrea.cruz@campus.edu',
    role: Role.Admin,
    isActive: true,
  },
]

const mockRooms: StudyRoom[] = [
  {
    id: 101,
    name: 'Quiet Study Room A',
    building: 'Learning Commons',
    capacity: 6,
    hasProjector: true,
    isAvailable: true,
  },
  {
    id: 102,
    name: 'Collaboration Room B',
    building: 'Main Library',
    capacity: 10,
    hasProjector: true,
    isAvailable: true,
  },
  {
    id: 103,
    name: 'Research Pod C',
    building: 'Learning Commons',
    capacity: 4,
    hasProjector: false,
    isAvailable: false,
  },
]

const mockReservations: Reservation[] = [
  {
    id: 5001,
    userId: 1,
    roomId: 101,
    date: '2026-07-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    purpose: 'Group research meeting',
    status: ReservationStatus.Pending,
  },
  {
    id: 5002,
    userId: 1,
    roomId: 102,
    date: '2026-07-22',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    purpose: 'Capstone consultation',
    status: ReservationStatus.Approved,
  },
]

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setUsers(mockUsers)
      setRooms(mockRooms)
      setReservations(mockReservations)
      setIsLoading(false)
    }, 600)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const handleUserSelect = (user: User): void => {
    console.info(`Selected user: ${user.name}`)
  }

  const handleRoomReserve = (room: StudyRoom): void => {
    console.info(`Reserve room requested: ${room.name}`)
  }

  if (isLoading) {
    return (
      <main className="app-shell">
        <section className="page-header">
          <p className="eyebrow">Campus Study Room Reservation System</p>
          <h1>Loading reservation data...</h1>
          <p>Please wait while the mock data is being prepared.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <p className="eyebrow">Campus Study Room Reservation System</p>
        <h1>Reservation overview</h1>
        <p>
          Review campus users, available study rooms, and current reservation
          requests.
        </p>
      </section>

      <section className="component-grid" aria-label="Campus users">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onSelect={handleUserSelect}
          />
        ))}
      </section>

      <section className="component-grid" aria-label="Study rooms">
        {rooms.map((room) => (
          <StudyRoomCard
            key={room.id}
            room={room}
            onReserve={handleRoomReserve}
          />
        ))}
      </section>

      <section className="component-grid" aria-label="Reservations">
        {reservations.map((reservation) => (
          <ReservationBadge
            key={reservation.id}
            reservation={reservation}
          >
            Reservation information loaded dynamically.
          </ReservationBadge>
        ))}
      </section>
    </main>
  )
}

export default App