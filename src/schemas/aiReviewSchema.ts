import { z } from 'zod'

export const aiReviewSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, 'Describe your study session in at least 20 characters.')
    .max(2000, 'Keep the description under 2000 characters.'),
})

export type AiReviewFormValues = z.infer<typeof aiReviewSchema>
