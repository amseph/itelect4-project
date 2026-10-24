import { z } from 'zod'

const reservationTimePattern = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i

function toMinutes(time: string): number | null {
  const match = reservationTimePattern.exec(time.trim())

  if (!match) {
    return null
  }

  const hour = Number(match[1]) % 12
  const minute = Number(match[2])
  const periodOffset = match[3].toUpperCase() === 'PM' ? 12 * 60 : 0

  return hour * 60 + minute + periodOffset
}

function localDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const reservationSchema = z
  .object({
    roomId: z.number({ error: 'Enter a valid room ID.' }).int('Room ID must be a whole number.').positive('Room ID must be greater than zero.'),
    date: z.string().min(1, 'Reservation date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid reservation date.'),
    startTime: z.string().trim().min(1, 'Start time is required.').regex(reservationTimePattern, 'Use a time such as 10:00 AM.'),
    endTime: z.string().trim().min(1, 'End time is required.').regex(reservationTimePattern, 'Use a time such as 12:00 PM.'),
    purpose: z.string().trim().min(3, 'Purpose must be at least 3 characters.'),
  })
  .refine(({ date }) => date >= localDateString(), {
    message: 'Choose today or a future date.',
    path: ['date'],
  })
  .refine(
    ({ startTime, endTime }) => {
      const startMinutes = toMinutes(startTime)
      const endMinutes = toMinutes(endTime)

      return startMinutes === null || endMinutes === null || endMinutes > startMinutes
    },
    {
      message: 'End time must be after start time.',
      path: ['endTime'],
    },
  )

export type ReservationFormValues = z.infer<typeof reservationSchema>
