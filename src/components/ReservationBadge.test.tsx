import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ReservationBadge from './ReservationBadge'
import { ReservationStatus, type ApiReservation } from '../types'

describe('ReservationBadge', () => {
  it('shows the reservation status from the reservation prop', () => {
    const reservation: ApiReservation = {
      id: 'reservation-1',
      userId: 'user-1',
      roomId: 1,
      date: '2026-10-29',
      startTime: '09:00',
      endTime: '10:00',
      purpose: 'Group study',
      status: ReservationStatus.Pending,
    }

    render(<ReservationBadge reservation={reservation} />)

    expect(screen.getByText('pending', { exact: true })).toBeInTheDocument()
  })
})
