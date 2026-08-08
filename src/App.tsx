import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import ReservationBadge from './components/ReservationBadge'
import StudyRoomCard from './components/StudyRoomCard'
import UserCard from './components/UserCard'
import usePrevious from './hooks/usePrevious'
import useToggle from './hooks/useToggle'
import { ReservationStatus, Role } from './types'
import type { Reservation, StudyRoom, User } from './types'

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
  const [isError, setIsError] = useState<boolean>(false)
  const [isDarkMode, toggleDarkMode] = useToggle(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [showReservationDetails, toggleReservationDetails] = useToggle(true)
  const previousSearchTerm = usePrevious(searchTerm)

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

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchTerm(event.currentTarget.value)
  }

  const focusSearchInput = (): void => {
    searchInputRef.current?.focus()
  }

  const simulateError = (): void => {
    setIsError(true)
  }

  const resetError = (): void => {
    setIsError(false)
  }

  const handleUserSelect = (user: User): void => {
    setSelectedUser(user)
  }

  const handleRoomReserve = (room: StudyRoom): void => {
    setSelectedRoom(room)
  }

  const filteredRooms = rooms.filter((room) => {
    const searchValue = searchTerm.toLowerCase()

    return (
      room.name.toLowerCase().includes(searchValue) ||
      room.building.toLowerCase().includes(searchValue)
    )
  })

  if (isLoading) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
          <section className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-3 w-56 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="mb-4 h-10 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-5 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
          <p className="sr-only">Loading reservation data...</p>
          </section>
        </main>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
          <section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
            Unable to load reservations
          </p>
          <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
          <p className="mb-5 text-sm text-red-800 dark:text-red-200">
            We could not display the reservation data. Please try again.
          </p>
          <button
            className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/50 dark:text-red-100 dark:hover:bg-red-900/80 dark:focus:ring-offset-red-950"
            type="button"
            onClick={resetError}
          >
            Try again
          </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <section className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Campus Study Room Reservation System</p>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Reservation overview</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Review campus users, available study rooms, and current reservation
          requests.
        </p></div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:focus:ring-offset-slate-950"
            type="button"
            onClick={simulateError}
          >
            Simulate error
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Campus users">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onSelect={handleUserSelect}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Current selection">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-none dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Selected user</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {selectedUser ? selectedUser.name : 'No user selected'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-none dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Requested room</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {selectedRoom ? selectedRoom.name : 'No room selected'}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="Room search">
        <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Find a study room</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Search rooms</h2>
          </div>

          <button
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900"
            type="button"
            onClick={focusSearchInput}
          >
            Focus search
          </button>
        </div>

        <input
          ref={searchInputRef}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          type="search"
          value={searchTerm}
          placeholder="Search by room name or building"
          onChange={handleSearchChange}
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {filteredRooms.length} room
          {filteredRooms.length === 1 ? '' : 's'} found
        </p>

        {previousSearchTerm !== undefined &&
          previousSearchTerm !== searchTerm && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Previous search: "{previousSearchTerm || 'empty'}"
            </p>
          )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Study rooms">
        {filteredRooms.map((room) => (
          <StudyRoomCard
            key={room.id}
            room={room}
            onReserve={handleRoomReserve}
            variant="compact"
          />
        ))}

        {filteredRooms.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No study rooms match “{searchTerm}”.
          </p>
        )}
      </section>

      <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Reservation records</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Current requests</h2>
        </div>

        <button
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
          type="button"
          onClick={toggleReservationDetails}
        >
          {showReservationDetails
            ? 'Hide reservation details'
            : 'Show reservation details'}
        </button>
      </section>

      {showReservationDetails && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Reservations">
          {reservations.map((reservation) => (
            <ReservationBadge
              key={reservation.id}
              reservation={reservation}
            >
              Reservation information loaded dynamically.
            </ReservationBadge>
          ))}
        </section>
      )}
        </div>
      </main>
    </div>
  )
}

export default App
