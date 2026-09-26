import '../Login/login.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { MdLockOutline } from 'react-icons/md'
import { Box, Container } from '@mui/system'
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';



const Register = () => {

  const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate()
  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth) {
      navigate("/")
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    let phoneRegex = /^(\+92\s?\d{10}|03\d{9}|\d{10})$/;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let cleanPhone = (credentials.phoneNumber || '').trim();
    if (cleanPhone.startsWith('03')) {
      cleanPhone = '+92 ' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('+92') && !cleanPhone.startsWith('+92 ')) {
      cleanPhone = '+92 ' + cleanPhone.slice(3);
    } else if (/^\d{10}$/.test(cleanPhone)) {
      cleanPhone = '+92 ' + cleanPhone;
    }

    try {
      if (!credentials.email && !credentials.firstName && !credentials.password && !credentials.phoneNumber && !credentials.lastName) {
        toast.error("All fields are required", { autoClose: 1000, theme: 'colored' })
      }
      else if (credentials.firstName.length < 1 || credentials.lastName.length < 1) {
        toast.error("Please enter valid name", { autoClose: 1000, theme: 'colored' })
      }
      else if (emailRegex.test(credentials.email)===false) {
        toast.error("Please enter valid email", { autoClose: 1000, theme: 'colored' })
      }
      else if (!phoneRegex.test((credentials.phoneNumber || '').trim())) {
        toast.error("Please enter a valid phone number in format: +92 XXXXXXXXXX", { autoClose: 2000, theme: 'colored' })
      }
      else if (credentials.password.length < 5) {
        toast.error("Please enter password with at least 5 characters", { autoClose: 1000, theme: 'colored' })
      }
      else if (credentials.email && credentials.firstName && credentials.lastName && credentials.phoneNumber && credentials.password) {
        const sendAuth = await axios.post(`${process.env.REACT_APP_REGISTER}`,
          {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
            phoneNumber: cleanPhone,
            password: credentials.password,
          })
        const receive = await sendAuth.data
        if (receive.success === true) {
          toast.success("Registered Successfully", { autoClose: 1000, theme: 'colored' })
          localStorage.setItem('Authorization', receive.authToken)
          navigate('/')
        }
        else {
          toast.error("Something went wrong, Please try again", { autoClose: 1000, theme: 'colored' })
          navigate('/')
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.error;
      const msg = Array.isArray(errMsg) ? errMsg[0]?.msg : (typeof errMsg === 'string' ? errMsg : "Registration failed. Please check your details.");
      toast.error(msg, { autoClose: 2000, theme: 'colored' })
    }
  }


  return (
    <>
      <Container component="main" maxWidth="xs" sx={{ marginBottom: 10 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={credentials.firstName}
                  onChange={handleOnChange}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={credentials.lastName}
                  onChange={handleOnChange}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={credentials.email}
                  onChange={handleOnChange}
                  autoComplete="email"

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Contact Number"
                  name="phoneNumber"
                  placeholder="+92 3001234567"
                  helperText="Format: +92 XXXXXXXXXX (e.g. +92 3001234567)"
                  value={credentials.phoneNumber}
                  onChange={handleOnChange}
                  type="tel"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
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
                  value={credentials.password}
                  onChange={handleOnChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?
                <Link to='/login' style={{ color: '#1976d2', marginLeft: 3 }}>
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <CopyRight />
    </>
  )
}

export default Register