import type { ApiReservation, ApiUser, LoginResponse, LoginUserBody, NewReservation, RegisterUserBody, StudyRoom } from '../types'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

if (!API_URL) {
  throw new Error('VITE_API_URL is missing. Set it in the frontend .env file.')
}

type RequestOptions = RequestInit & { private?: boolean }

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { private: isPrivate = false, headers: suppliedHeaders, ...init } = options
  const headers = new Headers(suppliedHeaders)
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (isPrivate) {
    const token = useAuthStore.getState().token
    if (!token) throw new Error('Your session has expired. Please log in again.')
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string'
      ? payload.message
      : `Request failed (${response.status}). Please try again.`
    throw new Error(message)
  }
  return payload as T
}

export function fetchRooms(): Promise<StudyRoom[]> {
  return request<StudyRoom[]>('/api/rooms')
}

export function fetchRoomById(id: number): Promise<StudyRoom> {
  return request<StudyRoom>(`/api/rooms/${id}`)
}

export function registerUser(body: RegisterUserBody): Promise<ApiUser> {
  return request<ApiUser>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })
}

export function loginUser(body: LoginUserBody): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })
}

export function fetchReservations(): Promise<ApiReservation[]> {
  return request<ApiReservation[]>('/api/reservations', { private: true })
}

export function createReservation(newReservation: NewReservation): Promise<ApiReservation> {
  return request<ApiReservation>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(newReservation),
    private: true,
  })
}
