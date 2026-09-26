import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, CssBaseline, Typography, Avatar } from '@mui/material';
import { MdLockOutline } from 'react-icons/md';
import CopyRight from '../../../Components/CopyRight/CopyRight';

const AdminRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth) {
      navigate("/admin/home");
    }
  }, []);

  return (
    <>
      <Container component="main" maxWidth="xs" sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffff',
            padding: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#f59e0b' }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" color="#0f172a" sx={{ mb: 1 }}>
            Admin Registration Disabled
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Only the single Super Admin account is permitted on this system. New admin registration is disabled for security.
          </Typography>
          <Button
            component={Link}
            to="/admin/login"
            fullWidth
            variant="contained"
            sx={{ py: 1.2, fontWeight: 'bold' }}
          >
            Go To Admin Login
          </Button>
        </Box>
      </Container>
      <CopyRight />
    </>
  );
};

export default AdminRegister;