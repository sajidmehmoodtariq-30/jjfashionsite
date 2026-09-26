import './Mobile.css';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import { AiOutlineHome, AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Badge, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition, getCart, getWishList, handleClickOpen, handleClose, handleLogOut } from '../Constants/Constant';

const MobileNavigation = () => {
    const { cart, setCart, wishlistData, setWishlistData } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const navigate = useNavigate();
    let authToken = localStorage.getItem('Authorization');
    let setProceed = authToken !== null ? true : false;

    useEffect(() => {
        getCart(setProceed, setCart, authToken);
        getWishList(setProceed, setWishlistData, authToken);
        if (setProceed) {
            checkAdminStatus();
        } else {
            setIsAdminUser(false);
        }
    }, [authToken]);

    const checkAdminStatus = async () => {
        try {
            const url = process.env.REACT_APP_GET_USER_DETAILS || '/api/auth/getuser';
            const { data } = await axios.get(url, {
                headers: { 'Authorization': authToken }
            });
            if (data && (data.isAdmin || data.email === 'admin@eshopit.com' || data.email === 'admin')) {
                setIsAdminUser(true);
            } else {
                setIsAdminUser(false);
            }
        } catch (e) {
            console.log(e);
            setIsAdminUser(false);
        }
    };

    return (
        <Box className='showMobile'>
            <BottomNavigation className="mobile-bottom-nav" sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', position: 'fixed', bottom: 0, overflowX: 'hidden', height: 64 }}>
                <NavLink to='/' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className='links'>
                        <AiOutlineHome style={{ fontSize: 24 }} />
                    </div>
                </NavLink>

                <NavLink to='/products' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className='links'>
                        <ShoppingBag size={22} />
                    </div>
                </NavLink>

                {isAdminUser ? (
                    <>
                        <NavLink to='/admin/home' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='links' style={{ color: '#f59e0b' }}>
                                <ShieldCheck size={24} />
                            </div>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to='/cart' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='links'>
                                <Badge badgeContent={setProceed && Array.isArray(cart) ? cart.length : 0} color="warning">
                                    <AiOutlineShoppingCart style={{ fontSize: 24 }} />
                                </Badge>
                            </div>
                        </NavLink>

                        <NavLink to='/wishlist' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='links'>
                                <Badge badgeContent={setProceed && Array.isArray(wishlistData) ? wishlistData.length : 0} color="error">
                                    <AiOutlineHeart style={{ fontSize: 24 }} />
                                </Badge>
                            </div>
                        </NavLink>
                    </>
                )}

                {setProceed ? (
                    <>
                        {!isAdminUser && (
                            <NavLink to='/update' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className='links'>
                                    <CgProfile style={{ fontSize: 24 }} />
                                </div>
                            </NavLink>
                        )}
                        <div className='links' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleClickOpen(setOpenAlert)}>
                            <FiLogOut style={{ fontSize: 24 }} />
                        </div>
                    </>
                ) : (
                    <NavLink to='/login' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='links'>
                            <CgProfile style={{ fontSize: 24 }} />
                        </div>
                    </NavLink>
                )}
            </BottomNavigation>

            <Dialog
                open={openAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleClose(setOpenAlert)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h6' fontWeight="700">Do You Want To Logout?</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' endIcon={<FiLogOut />} color='warning' onClick={() => handleLogOut(setProceed, toast, navigate, setOpenAlert)}>Logout</Button>
                    <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={() => handleClose(setOpenAlert)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MobileNavigation;