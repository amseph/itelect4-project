import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const [name, setName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.currentTarget.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setErrorMessage('Please enter your name to continue.')
      return
    }

    login(trimmedName)
    navigate('/reservations')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Campus Study Room Reservation System</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Login</h1>
        <form className="mt-5 max-w-md" onSubmit={handleSubmit} noValidate>
          <Label className="mb-2 block font-semibold text-slate-600 dark:text-slate-300" htmlFor="login-name">Name</Label>
          <Input id="login-name" className="min-h-11 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500" type="text" value={name} onChange={handleNameChange} aria-invalid={errorMessage ? true : undefined} aria-describedby={errorMessage ? 'login-name-error' : undefined} />
          {errorMessage && <p id="login-name-error" className="mt-2 text-sm text-red-700 dark:text-red-300">{errorMessage}</p>}
          <Button className="mt-4 min-h-11 bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900" type="submit">Continue</Button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
