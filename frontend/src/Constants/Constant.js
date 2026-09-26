import { Slide } from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";
const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
            setCart(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(error);
            setCart([]);
        }
    }
}
const getWishList = async (setProceed, setWishlistData, authToken) => {
    if (setProceed) {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_WISHLIST}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
            setWishlistData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(error);
            setWishlistData([]);
        }
    }
}
const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
        setOpenAlert(false)
    }
    else {
        toast.error("User is already logged of", { autoClose: 500, theme: 'colored' })
    }
}

const handleClickOpen = (setOpenAlert) => {
    setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
    setOpenAlert(false);
};
const getAllProducts = async (setData) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_FETCH_PRODUCT);
        setData(Array.isArray(data) ? data : []);
    } catch (error) {
        console.log(error);
        setData([]);
    }
}

const getSingleProduct = async (setProduct, id, setLoading) => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`);
        setProduct(data && typeof data === 'object' ? data : {});
    } catch (error) {
        console.log(error);
        setProduct({});
    } finally {
        if (setLoading) setLoading(false);
    }
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});





export { getCart, getWishList, handleClickOpen, handleClose, handleLogOut, getAllProducts, getSingleProduct, Transition }