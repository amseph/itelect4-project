import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { askAi } from '@/api/client'
import { aiReviewSchema, type AiReviewFormValues } from '@/schemas/aiReviewSchema'
import type { AiReview } from '@/types'
import { PageFrame, PageHeading } from '@/components/PageFrame'

const readinessCopy: Record<AiReview['readiness'], { label: string; className: string }> = {
  ready: { label: 'Ready', className: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' },
  almost: { label: 'Almost', className: 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200' },
  'not-yet': { label: 'Not yet', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return <section aria-label={title}><h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700 marker:text-slate-400 dark:text-slate-300">{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>
}

function AiReviewPage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<AiReviewFormValues>({ resolver: zodResolver(aiReviewSchema), mode: 'onBlur', defaultValues: { prompt: '' } })
  const reviewMutation = useMutation<AiReview, Error, string>({ mutationFn: askAi })
  const promptLength = (useWatch({ control, name: 'prompt' }) ?? '').trim().length
  const onSubmit = ({ prompt }: AiReviewFormValues): void => { reviewMutation.mutate(prompt) }
  const review = reviewMutation.data

  return <PageFrame className="max-w-5xl">
    <PageHeading title="AI Study Assistant" description="Get feedback on your study plan." />
    <div className="mx-auto max-w-3xl">
      <section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Label className="font-semibold text-slate-800 dark:text-slate-200" htmlFor="study-session-description">Study session description</Label>
          <textarea id="study-session-description" className="mt-2 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-base leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20 aria-invalid:border-red-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-900" placeholder="Describe your study session, including the date, time, group size, or room requirements." aria-invalid={errors.prompt ? true : undefined} aria-describedby={errors.prompt ? 'study-session-error study-session-hint' : 'study-session-hint'} disabled={reviewMutation.isPending} {...register('prompt')} />
          <div className="mt-2 flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-start"><p id="study-session-hint" className="text-slate-500 dark:text-slate-400">20–2000 characters. This review does not confirm room availability.</p><span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400" aria-label={`${promptLength} of 2000 characters`}>{promptLength}/2000</span></div>
          {errors.prompt && <p id="study-session-error" className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">{errors.prompt.message}</p>}
          <div className="mt-4"><Button className="min-h-11 gap-2 bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500" type="submit" disabled={reviewMutation.isPending}>{reviewMutation.isPending ? 'Reviewing your plan…' : 'Review study plan'}</Button></div>
        </form>
      </section>

      {reviewMutation.isError && <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert"><h2 className="font-semibold">Unable to get your review</h2><p className="mt-1 text-sm leading-6">{reviewMutation.error.message || 'The review service is temporarily unavailable. Please try again shortly.'}</p></section>}

      {review && <section className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-800" aria-labelledby="review-results-title" aria-live="polite"><h2 id="review-results-title" className="text-lg font-semibold text-slate-950 dark:text-white">AI Feedback</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><section className="sm:col-span-2" aria-labelledby="review-summary-title"><h3 id="review-summary-title" className="text-sm font-semibold text-slate-900 dark:text-white">Summary</h3><p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">{review.summary}</p></section><ReviewList title="Strengths" items={review.strengths} /><ReviewList title="Suggestions" items={review.improvements} /></div><div className="mt-5 flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Readiness</h3><span className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-medium ${readinessCopy[review.readiness].className}`}>{readinessCopy[review.readiness].label}</span></div><Link to="/rooms" className="mt-5 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">Browse study rooms <ArrowRight size={15} /></Link></section>}
    </div>
  </PageFrame>
}

export default AiReviewPage
