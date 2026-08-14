import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import StudyRoomCard from '../components/StudyRoomCard'
import { mockRooms } from '../data/mockData'
import usePrevious from '../hooks/usePrevious'
import type { StudyRoom } from '../types'

function RoomsPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const previousSearchTerm = usePrevious(searchTerm)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setRooms(mockRooms)
      setIsLoading(false)
    }, 600)

    return () => window.clearTimeout(timerId)
  }, [])

  const filteredRooms = rooms.filter((room) => {
    const searchValue = searchTerm.toLowerCase()
    return room.name.toLowerCase().includes(searchValue) || room.building.toLowerCase().includes(searchValue)
  })

  const handleViewDetails = (room: StudyRoom): void => {
    navigate(`/rooms/${room.id}`)
  }

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8"><section className="mx-auto max-w-6xl animate-pulse"><div className="mb-3 h-3 w-56 rounded bg-slate-300 dark:bg-slate-700" /><div className="mb-4 h-10 w-3/4 rounded bg-slate-300 dark:bg-slate-700" /><div className="h-5 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" /><p className="sr-only">Loading reservation data...</p></section></main>
  }

  if (isError) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8"><section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100"><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Unable to load reservations</p><h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1><p className="mb-5 text-sm text-red-800 dark:text-red-200">We could not display the reservation data. Please try again.</p><button className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/50 dark:text-red-100 dark:hover:bg-red-900/80 dark:focus:ring-offset-red-950" type="button" onClick={() => setIsError(false)}>Try again</button></section></main>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Find a study room</p><h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Search rooms</h1></div>
          <button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={() => setIsError(true)}>Simulate error</button>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="Room search">
          <button className="mb-4 min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900" type="button" onClick={() => searchInputRef.current?.focus()}>Focus search</button>
          <input ref={searchInputRef} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500" type="search" value={searchTerm} placeholder="Search by room name or building" onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.currentTarget.value)} />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{filteredRooms.length} room{filteredRooms.length === 1 ? '' : 's'} found</p>
          {previousSearchTerm !== undefined && previousSearchTerm !== searchTerm && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Previous search: &quot;{previousSearchTerm || 'empty'}&quot;</p>}
        </section>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Study rooms">
          {filteredRooms.map((room) => (
            <div key={room.id} className="flex flex-col gap-2">
              <StudyRoomCard room={room} onReserve={setSelectedRoom} variant="compact" />
              <button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950" type="button" onClick={() => handleViewDetails(room)}>View details</button>
            </div>
          ))}
          {filteredRooms.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">No study rooms match &quot;{searchTerm}&quot;.</p>}
        </section>
        <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-none dark:border-slate-800 dark:bg-slate-900/60"><p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Requested room</p><p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{selectedRoom ? selectedRoom.name : 'No room selected'}</p></section>
      </div>
    </main>
  )
}

export default RoomsPage
