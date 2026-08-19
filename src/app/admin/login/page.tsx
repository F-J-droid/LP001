'use client'

import { useState } from 'react'
import { login } from '@/features/admin/actions/auth-actions'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="max-w-md w-full bg-card p-8 border shadow-sm rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground mt-2">Acesso restrito a administradores</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              required 
              className="w-full h-10 px-3 border rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              required 
              className="w-full h-10 px-3 border rounded-md"
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
