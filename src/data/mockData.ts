import { ReservationStatus, Role } from '../types'
import type { Reservation, StudyRoom, User } from '../types'

export const mockUsers: User[] = [
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

export const mockRooms: StudyRoom[] = [
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

export const mockReservations: Reservation[] = [
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
