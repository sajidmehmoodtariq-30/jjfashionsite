import './Desktop.css';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { ShieldCheck } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge, Button, Dialog, DialogActions, DialogContent, Tooltip, Typography } from '@mui/material';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCart, getWishList, handleLogOut, handleClickOpen, handleClose, Transition } from '../Constants/Constant';
import { jjLogo } from '../Assets/Images/Image';

const DesktopNavigation = () => {
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
      const url = process.env.REACT_APP_GET_USER_DETAILS || 'http://localhost:5000/api/auth/getuser';
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
    <>
      <nav className='nav'>
        <Link to='/' className='nav-brand-container'>
          <img src={jjLogo} alt="JJ Fashion Hub" className="brand-logo-img" />
          <div className="brand-title-box">
            <span className="brand-title">JJ FASHION HUB</span>
            <span className="brand-tagline">STYLE FOR EVERY YOU</span>
          </div>
        </Link>

        <div className="nav-items">
          <ul>
            <li className="nav-links">
              <NavLink to='/'>
                <span className='nav-icon-span'>Home</span>
              </NavLink>
            </li>

            <li className="nav-links">
              <NavLink to='/products'>
                <span className='nav-icon-span'>Products</span>
              </NavLink>
            </li>

            {/* If Admin is logged in, replace Cart & Wishlist with Admin Panel links */}
            {isAdminUser ? (
              <>
                <li className="nav-links">
                  <NavLink to='/admin/home'>
                    <span className='nav-icon-span' style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                      <ShieldCheck size={18} style={{ marginRight: 4 }} /> Admin Dashboard
                    </span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-links">
                  <Tooltip title='Cart'>
                    <NavLink to="/cart">
                      <span className='nav-icon-span'>
                        Cart
                        <Badge badgeContent={setProceed ? cart.length : 0} color="warning">
                          <AiOutlineShoppingCart style={{ fontSize: 22 }} />
                        </Badge>
                      </span>
                    </NavLink>
                  </Tooltip>
                </li>

                <li className="nav-links">
                  <Tooltip title='Wishlist'>
                    <NavLink to="/wishlist">
                      <span className='nav-icon-span'>
                        Wishlist
                        <Badge badgeContent={setProceed ? wishlistData.length : 0} color="error">
                          <AiOutlineHeart style={{ fontSize: 22 }} />
                        </Badge>
                      </span>
                    </NavLink>
                  </Tooltip>
                </li>
              </>
            )}

            {setProceed ? (
              <>
                {!isAdminUser && (
                  <li className="nav-links">
                    <Tooltip title='Profile'>
                      <NavLink to='/update'>
                        <span className='nav-icon-span'>
                          <CgProfile style={{ fontSize: 24 }} />
                        </span>
                      </NavLink>
                    </Tooltip>
                  </li>
                )}

                <li style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleClickOpen(setOpenAlert)}>
                  <Button variant='contained' className='logout-btn-gold' endIcon={<FiLogOut />}>
                    <Typography variant='button' fontWeight="700">Logout</Typography>
                  </Button>
                </li>
              </>
            ) : (
              <li className="nav-links">
                <Tooltip title='Login'>
                  <NavLink to='/login'>
                    <span className='nav-icon-span'>
                      <CgProfile style={{ fontSize: 24 }} /> Login
                    </span>
                  </NavLink>
                </Tooltip>
              </li>
            )}
          </ul>
        </div>
      </nav>

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
    </>
  );
};

export default DesktopNavigation;