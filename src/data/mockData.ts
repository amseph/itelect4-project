import { Role } from '../types'
import type { User } from '../types'

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
