import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import BasicTabs from '../Components/AdminTabs';
import CopyRight from '../../Components/CopyRight/CopyRight'

const AdminHomePage = () => {
    const [user, setUser] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        if (!authToken) {
            toast.error("Please login as Admin", { autoClose: 1000, theme: "colored" });
            navigate('/admin/login');
            return;
        }
        getUser();
    }, []);

    const getUser = async () => {
        try {
            setLoading(true);
            const url = process.env.REACT_APP_ADMIN_GET_ALL_USERS || '/api/admin/getallusers';
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': authToken
                }
            });
            setUser(data || []);
            setAdmin(true);
            setLoading(false);
        } catch (error) {
            console.log("Admin getUser error:", error);
            setLoading(false);
            setAdmin(false);
            const errMsg = error.response?.data?.error || error.response?.data || "Access Denied";
            toast.error(typeof errMsg === 'string' ? errMsg : "Access Denied", { autoClose: 1500, theme: "colored" });
            navigate('/admin/login');
        }
    };

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                    <CircularProgress size={50} color="primary" />
                    <Typography variant="h6" color="textSecondary">Loading Admin Dashboard...</Typography>
                </Box>
            ) : isAdmin ? (
                <Container maxWidth="100%">
                    <h1 style={{ textAlign: "center", margin: "20px 0", color: "#1976d2" }}>Admin Dashboard</h1>
                    <BasicTabs user={user} getUser={getUser} />
                </Container>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                    <Typography variant="h6" color="error">Access Denied. Please sign in with Admin credentials.</Typography>
                </Box>
            )}
            <CopyRight />
        </>
    );
};

export default AdminHomePage;