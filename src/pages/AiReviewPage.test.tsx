import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AiReviewPage from './AiReviewPage'

describe('AiReviewPage', () => {
  it('shows the schema error and does not fetch for an empty description', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    try {
      render(
        <QueryClientProvider client={queryClient}>
          <AiReviewPage />
        </QueryClientProvider>,
      )

      fireEvent.click(screen.getByRole('button', { name: 'Review study plan' }))

      expect(await screen.findByText(
        'Describe your study session in at least 20 characters.',
        { exact: true },
      )).toBeInTheDocument()
      await waitFor(() => expect(fetchSpy).not.toHaveBeenCalled())
    } finally {
      fetchSpy.mockRestore()
      queryClient.clear()
    }
  })
})
