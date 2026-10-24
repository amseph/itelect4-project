import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { askAi } from '@/api/client'
import { aiReviewSchema, type AiReviewFormValues } from '@/schemas/aiReviewSchema'
import type { AiReview } from '@/types'
import { PageFrame, PageHeading } from '@/components/PageFrame'

const readinessCopy: Record<AiReview['readiness'], { label: string; className: string }> = {
  ready: {
    label: 'Ready to proceed',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200',
  },
  almost: {
    label: 'Almost ready',
    className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  },
  'not-yet': {
    label: 'More planning needed',
    className: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <section aria-label={title}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AiReviewPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AiReviewFormValues>({
    resolver: zodResolver(aiReviewSchema),
    mode: 'onBlur',
    defaultValues: { prompt: '' },
  })
  const reviewMutation = useMutation<AiReview, Error, string>({
    mutationFn: askAi,
  })
  const promptLength = (useWatch({ control, name: 'prompt' }) ?? '').trim().length

  const onSubmit = ({ prompt }: AiReviewFormValues): void => {
    reviewMutation.mutate(prompt)
  }

  const review = reviewMutation.data

  return (
    <PageFrame>
      <PageHeading eyebrow="Study planning" title="AI Study Assistant" description="Describe your proposed study session or booking plan to get concise, practical feedback before you reserve." />
      <div className="mx-auto flex max-w-4xl flex-col gap-5">

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6" aria-labelledby="study-session-form-title">
          <div className="max-w-2xl">
            <h2 id="study-session-form-title" className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white"><Sparkles size={18} className="text-blue-700 dark:text-blue-300" />Your study plan</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Include the date, time, group size, and any room requirements you already know.</p>
          </div>

          <form className="mt-5 max-w-3xl" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Label className="font-semibold text-slate-700 dark:text-slate-200" htmlFor="study-session-description">Study session description</Label>
            <textarea
              id="study-session-description"
              className="mt-2 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-base leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/15 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-900"
              placeholder="For example: I’d like to study with three classmates on Thursday from 1 PM to 3 PM. We need a quiet room with a whiteboard."
              aria-invalid={errors.prompt ? true : undefined}
              aria-describedby={errors.prompt ? 'study-session-error study-session-hint' : 'study-session-hint'}
              disabled={reviewMutation.isPending}
              {...register('prompt')}
            />
            <div className="mt-2 flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-start">
              <p id="study-session-hint" className="text-slate-500 dark:text-slate-400">Use 20–2000 characters. The review is based only on the details you provide.</p>
              <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400" aria-label={`${promptLength} of 2000 characters`}>{promptLength}/2000</span>
            </div>
            {errors.prompt && <p id="study-session-error" className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">{errors.prompt.message}</p>}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="min-h-11 gap-2 bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500" type="submit" disabled={reviewMutation.isPending}>
                {reviewMutation.isPending && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />}
                {reviewMutation.isPending ? 'Reviewing your plan…' : 'Review study plan'}
              </Button>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">This feature reviews your plan. It does not check real room availability.</p>
            </div>
          </form>
        </section>

        {reviewMutation.isError && (
          <section className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert" aria-labelledby="review-error-title">
            <h2 id="review-error-title" className="font-semibold">Unable to get your review</h2>
            <p className="mt-1 text-sm leading-6">{reviewMutation.error.message || 'The review service is temporarily unavailable. Please try again shortly.'}</p>
          </section>
        )}

        {review && (
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6" aria-labelledby="review-results-title" aria-live="polite">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-700 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Your review</p>
                <h2 id="review-results-title" className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Study plan feedback</h2>
              </div>
              <span className={`inline-flex min-h-8 w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold ${readinessCopy[review.readiness].className}`}>
                {readinessCopy[review.readiness].label}
              </span>
            </div>
            <div className="grid gap-6 pt-5 md:grid-cols-2">
              <section className="md:col-span-2" aria-labelledby="review-summary-title">
                <h3 id="review-summary-title" className="text-sm font-semibold text-slate-900 dark:text-white">Summary</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">{review.summary}</p>
              </section>
              <ReviewList title="Strengths" items={review.strengths} />
              <ReviewList title="Suggestions to improve" items={review.improvements} />
            </div>
            <Link to="/rooms" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">Browse study rooms <ArrowRight size={16} /></Link>
          </section>
        )}
      </div>
    </PageFrame>
  )
}

export default AiReviewPage
