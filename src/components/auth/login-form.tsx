'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/trpc/client'
import { TextField, Button, Alert, Box, CircularProgress } from '@mui/material'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      router.push('/dashboard')
    },
    onError: (error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError('')
    loginMutation.mutate(data)
  }

  return (
    <Box maxWidth={400} mx="auto" bgcolor="white" borderRadius={3} boxShadow={3} p={4} border={1} borderColor="grey.200">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            fullWidth
            size="medium"
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            disabled={isLoading}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            fullWidth
            size="medium"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
            size="large"
            sx={{ fontWeight: 600, py: 1.5, mt: 1 }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}