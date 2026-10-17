import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      const reply = await loginUser({ email: email.trim(), password })
      setSession(reply.token, reply.user.name)
      navigate('/reservations')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Campus Study Room Reservation System</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Login</h1>
        <form className="mt-5 max-w-md" onSubmit={handleSubmit}>
          <Label className="mb-2 block font-semibold text-slate-600 dark:text-slate-300" htmlFor="login-email">Email</Label>
          <Input id="login-email" className="min-h-11 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
          <Label className="mb-2 mt-4 block font-semibold text-slate-600 dark:text-slate-300" htmlFor="login-password">Password</Label>
          <Input id="login-password" className="min-h-11 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.currentTarget.value)} />
          {errorMessage && <p className="mt-3 text-sm text-red-700 dark:text-red-300" role="alert">{errorMessage}</p>}
          <Button className="mt-4 min-h-11 bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Login'}</Button>
        </form>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">New to the system? <Link className="font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300" to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}

export default LoginPage
