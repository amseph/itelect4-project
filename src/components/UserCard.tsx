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
    <article className="info-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">User</p>
          <h2>{user.name}</h2>
        </div>
        <span className={user.isActive ? 'status is-active' : 'status is-inactive'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <dl className="details-list">
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{user.role}</dd>
        </div>
      </dl>

      <label className="field-label" htmlFor={`user-note-${user.id}`}>
        Quick note
      </label>
      <input
        id={`user-note-${user.id}`}
        className="text-input"
        type="text"
        placeholder="Optional note"
        onChange={handleNoteChange}
      />

      <button className="primary-button" type="button" onClick={handleSelectClick}>
        Select user
      </button>
    </article>
  )
}

export default UserCard
