import type { ChangeEvent, MouseEvent } from 'react'
import type { User } from '../types'

export interface UserCardProps {
  user: User
  onSelect: (user: User) => void
}

function UserCard({ user, onSelect }: UserCardProps) {
  const handleSelectClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur()
    onSelect(user)
  }

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.info(`Selection note for ${user.name}: ${event.currentTarget.value}`)
  }

  return (
    <article className="flex min-h-72 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">User</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user.name}</h2>
        </div>
        <span className={user.isActive ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="grid gap-1">
          <dt className="font-semibold text-slate-500 dark:text-slate-400">Email</dt>
          <dd className="text-slate-800 dark:text-slate-200">{user.email}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="font-semibold text-slate-500 dark:text-slate-400">Role</dt>
          <dd className="text-slate-800 dark:text-slate-200">{user.role}</dd>
        </div>
      </dl>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300" htmlFor={`user-note-${user.id}`}>
          Quick note
        </label>
        <input
          id={`user-note-${user.id}`}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          type="text"
          placeholder="Optional note"
          onChange={handleNoteChange}
        />
      </div>

      <button className="mt-auto min-h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900" type="button" onClick={handleSelectClick}>
        Select user
      </button>
    </article>
  )
}

export default UserCard
