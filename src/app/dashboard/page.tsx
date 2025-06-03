'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Container } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CelebrationIcon from '@mui/icons-material/Celebration'

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
 
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #d1fae5 0%, #bfdbfe 100%)', p: 2 }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ borderRadius: 4, p: { xs: 3, sm: 6 }, border: '1px solid', borderColor: 'success.light', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CelebrationIcon color="success" fontSize="large" />
            <Typography variant="h3" fontWeight={800} color="success.main">
              Dashboard
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" align="center" mb={4}>
            If you can see this page, your login worked!
          </Typography>

          <Paper elevation={0} sx={{ width: '100%', bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light', p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} color="success.dark" mb={1} display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon color="success" fontSize="small" /> What's Working:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="tRPC API route is responding" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="Login mutation completed successfully" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="Redirect to dashboard worked" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="You are authenticated!" />
              </ListItem>
            </List>
          </Paper>

          <Button
            onClick={() => router.push('/login')}
            variant="contained"
            color="error"
            size="large"
            fullWidth
            sx={{ fontWeight: 700, borderRadius: 3, py: 1.5, mt: 1, boxShadow: 2 }}
          >
            Go Back to Login
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}