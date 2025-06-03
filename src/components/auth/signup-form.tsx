'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/trpc/client'
import { TextField, Button, Alert, Box, CircularProgress } from '@mui/material'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().optional(),
})

type SignupForm = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const signupMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push('/login?message=Registration successful! Please sign in.')
    },
    onError: (error) => {
      setError(error.message)
      setIsLoading(false)
    },
  })

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError('')
    signupMutation.mutate(data)
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
            label="Display Name (Optional)"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            disabled={isLoading}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            {...register('displayName')}
            fullWidth
            size="medium"
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}