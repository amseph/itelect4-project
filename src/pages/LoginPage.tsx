import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '../api/client'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      const reply = await loginUser({ email: email.trim(), password })
      setSession(reply.token, reply.user.name)
      navigate('/reservations', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="grid min-h-[calc(100vh-4.5rem)] place-items-center px-4 py-10 sm:px-6">
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8" aria-labelledby="login-title">
      <div className="mb-6"><span className="mb-4 grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><LogIn size={20} /></span><p className="text-sm font-medium text-blue-700 dark:text-blue-300">Campus Study Rooms</p><h1 id="login-title" className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Welcome back</h1><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Log in to manage reservations and review your study plans.</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div><label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Email address</label><input id="login-email" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.currentTarget.value)} /></div>
        <div><label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Password</label><div className="relative"><input id="login-password" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.currentTarget.value)} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        {errorMessage && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert">{errorMessage}</p>}
        <button className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">New to campus rooms? <Link className="font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300" to="/register">Create an account</Link></p>
    </section>
  </main>
}

export default LoginPage
