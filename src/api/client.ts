import type { NewReservation, Reservation, StudyRoom, User } from '../types'

const API_URL = 'http://localhost:3001'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error('Unable to fetch users.')
  }

  return response.json() as Promise<User[]>
}

export async function fetchRooms(): Promise<StudyRoom[]> {
  const response = await fetch(`${API_URL}/rooms`)

  if (!response.ok) {
    throw new Error('Unable to fetch rooms.')
  }

  return response.json() as Promise<StudyRoom[]>
}

export async function fetchRoomById(id: number): Promise<StudyRoom> {
  const response = await fetch(`${API_URL}/rooms/${id}`)

  if (!response.ok) {
    throw new Error(`Unable to fetch room ${id}.`)
  }

  return response.json() as Promise<StudyRoom>
}

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_URL}/reservations`)

  if (!response.ok) {
    throw new Error('Unable to fetch reservations.')
  }

  return response.json() as Promise<Reservation[]>
}

export async function createReservation(newReservation: NewReservation): Promise<Reservation> {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newReservation),
  })

  if (!response.ok) {
    throw new Error('Unable to create reservation.')
  }

  return response.json() as Promise<Reservation>
}
