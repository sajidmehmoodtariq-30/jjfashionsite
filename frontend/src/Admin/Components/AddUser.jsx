import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { MdOutlineCancel, MdPersonAddAlt1 } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Transition } from '../../Constants/Constant';


const AddUser = ({ getUser }) => {
    const [open, setOpen] = useState(false);
    const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" })
    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        let phoneRegex = /^(\+92\s?\d{10}|03\d{9}|\d{10})$/;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        let cleanPhone = (credentials.phoneNumber || '').toString().trim();
        if (cleanPhone.startsWith('03')) {
            cleanPhone = '+92 ' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('+92') && !cleanPhone.startsWith('+92 ')) {
            cleanPhone = '+92 ' + cleanPhone.slice(3);
        } else if (/^\d{10}$/.test(cleanPhone)) {
            cleanPhone = '+92 ' + cleanPhone;
        }

        try {
            if (!credentials.email && !credentials.firstName && !credentials.password && !credentials.phoneNumber && !credentials.lastName) {
                toast.error("Please Fill the all Fields", { autoClose: 500, theme: 'colored' })
            }
            else if (credentials.firstName.length <= 1 || credentials.lastName.length <= 1) {
                toast.error("Please enter a valid name", { autoClose: 500, theme: 'colored' })
            }
            else if (!emailRegex.test(credentials.email)) {
                toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
            }
            else if (!phoneRegex.test((credentials.phoneNumber || '').toString().trim())) {
                toast.error("Please enter a valid phone number in format: +92 XXXXXXXXXX", { autoClose: 2000, theme: 'colored' })
            }
            else if (credentials.password.length < 5) {
                toast.error("Please enter password with at least 5 characters", { autoClose: 500, theme: 'colored' })
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
                setOpen(false);
                if (receive.success === true) {
                    getUser()
                    toast.success("Registered Successfully", { autoClose: 500, theme: 'colored' })
                    setCredentials({
                        firstName: "",
                        lastName: '',
                        email: "",
                        phoneNumber: '',
                        password: ""
                    })
                }
                else {
                    toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
                }
            }
        } catch (error) {
            toast.error(error.response.data.error, { autoClose: 500, theme: 'colored' })
        }

    }
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "20px 0" }} >
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">Add new user
                </Typography>
                <Button variant='contained' endIcon={<MdPersonAddAlt1 />} onClick={handleClickOpen}>Add</Button>
            </Box>
            <Divider sx={{ mb: 5 }} />
            <Dialog
                open={open}
                onClose={handleClose}
                keepMounted
                TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}> Add new user</DialogTitle>
                <DialogContent>
                    <Box onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                                    type="password"
                                    value={credentials.password}
                                    onChange={handleOnChange}
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                            <Button fullWidth variant='contained' color='error' onClick={handleClose} endIcon={<MdOutlineCancel />}>Cancel</Button>
                            <Button type="submit" onClick={handleSubmit} fullWidth variant="contained" endIcon={<MdPersonAddAlt1 />}>Add</Button>
                        </DialogActions>
                    </Box >
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddUser