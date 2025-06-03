import { Box, Typography, Paper, Container } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background:
          'linear-gradient(135deg, #d1fae5 0%, #bfdbfe 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 6 },
            border: '1px solid',
            borderColor: 'success.light',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={1}
          >
            <LoginIcon color="success" fontSize="large" />
            <Typography
              variant="h3"
              fontWeight={800}
              color="success.main"
            >
              Sign in
            </Typography>
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            mb={4}
          >
            Welcome back! Please sign in to your account.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mb={3}
          >
            Or{' '}
            <Link
              href="/signup"
              style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              create a new account
            </Link>
          </Typography>
          <Box width="100%" mb={2}>
            <LoginForm />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}