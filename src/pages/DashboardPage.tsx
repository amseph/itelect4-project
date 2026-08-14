import { useEffect, useState } from 'react'
import UserCard from '../components/UserCard'
import { mockUsers } from '../data/mockData'
import type { User } from '../types'

function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 600)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <section className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-3 w-56 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="mb-4 h-10 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-5 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
          <p className="sr-only">Loading reservation data...</p>
        </section>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Unable to load reservations</p>
          <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
          <p className="mb-5 text-sm text-red-800 dark:text-red-200">We could not display the reservation data. Please try again.</p>
          <button className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/50 dark:text-red-100 dark:hover:bg-red-900/80 dark:focus:ring-offset-red-950" type="button" onClick={() => setIsError(false)}>Try again</button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5">
          <section className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Campus Study Room Reservation System</p>
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Reservation overview</h1>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">Review campus users, available study rooms, and current reservation requests.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:focus:ring-offset-slate-950" type="button" onClick={() => setIsError(true)}>Simulate error</button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Campus users">
            {users.map((user) => <UserCard key={user.id} user={user} onSelect={setSelectedUser} />)}
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Current selection">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-none dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Selected user</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{selectedUser ? selectedUser.name : 'No user selected'}</p>
            </div>
          </section>
        </div>
    </main>
  )
}

export default DashboardPage
