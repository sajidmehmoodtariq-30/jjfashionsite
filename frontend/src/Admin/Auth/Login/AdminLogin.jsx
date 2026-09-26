import './login.css'
import { Avatar, Button, CssBaseline, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import CopyRight from '../../../Components/CopyRight/CopyRight'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "admin", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const verifyExistingToken = async () => {
      let auth = localStorage.getItem('Authorization');
      if (auth) {
        try {
          const getUserUrl = process.env.REACT_APP_GET_USER_DETAILS || '/api/auth/getuser';
          const { data } = await axios.get(getUserUrl, {
            headers: { 'Authorization': auth }
          });
          if (data && (data.isAdmin || data.email === 'admin@eshopit.com' || data.email === 'admin')) {
            navigate("/admin/home");
          }
        } catch (e) {
          console.log("Token validation error on AdminLogin:", e);
        }
      }
    };
    verifyExistingToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!credentials.email || !credentials.password) {
        toast.error("Please enter both username and password", { autoClose: 1000, theme: 'colored' });
        return;
      }
      
      const loginUrl = process.env.REACT_APP_ADMIN_LOGIN || '/api/admin/login';
      const { data } = await axios.post(loginUrl, {
        email: credentials.email,
        password: credentials.password
      });

      if (data && data.success === true) {
        toast.success("Admin Logged In Successfully!", { autoClose: 1000, theme: 'colored' });
        localStorage.setItem('Authorization', data.authToken);
        navigate('/admin/home');
      } else {
        toast.error(data.error || "Invalid Admin Credentials", { autoClose: 1000, theme: 'colored' });
      }
    }
    catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.error || "Invalid Admin Credentials";
      toast.error(errMsg, { autoClose: 1000, theme: 'colored' });
    }
  };

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
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" color="#0f172a">
            Admin Portal Sign In
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
            Restricted to Super Admin Only
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or Email"
              value={credentials.email}
              name='email'
              onChange={handleOnChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={credentials.password}
              name='password'
              onChange={handleOnChange}
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                    {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
            >
              Sign In As Admin
            </Button>
          </Box>
        </Box>
      </Container>
      <CopyRight />
    </>
  );
};

export default AdminLogin;