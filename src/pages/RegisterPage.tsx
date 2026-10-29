import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { loginUser, registerUser } from '../api/client'
import { useAuthStore } from '../store/authStore'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    if (name.trim().length < 2) { setErrorMessage('Name must be at least 2 characters.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErrorMessage('Enter a valid email address.'); return }
    if (password.length < 8) { setErrorMessage('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setErrorMessage('Passwords do not match.'); return }
    setIsSubmitting(true)
    try {
      await registerUser({ name: name.trim(), email: email.trim(), password })
      const reply = await loginUser({ email: email.trim(), password })
      setSession(reply.token, reply.user.name)
      navigate('/reservations', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className="w-full rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8" aria-labelledby="register-title">
      <div className="mb-6"><h2 id="register-title" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Create your account</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Join Campus Rooms and start booking study spaces.</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div><label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Full name</label><input id="register-name" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type="text" autoComplete="name" minLength={2} required value={name} onChange={(event) => setName(event.currentTarget.value)} /></div>
        <div><label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Email address</label><input id="register-email" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.currentTarget.value)} /></div>
        <div><label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Password</label><div className="relative"><input id="register-password" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.currentTarget.value)} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Use at least 8 characters.</p></div>
        <div><label htmlFor="register-confirm-password" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Confirm password</label><input id="register-confirm-password" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.currentTarget.value)} /></div>
        {errorMessage && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100" role="alert">{errorMessage}</p>}
        <button className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">Already have an account? <Link className="font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300" to="/login">Log in</Link></p>
    </section>
}

export default RegisterPage
