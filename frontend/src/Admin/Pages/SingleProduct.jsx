import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField, Typography, CircularProgress } from '@mui/material';
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone, AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Transition } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';

const SingleProduct = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [dbCategories, setDbCategories] = useState([]);

    let authToken = localStorage.getItem("Authorization")
    const [productInfo, setProductInfo] = useState({
        name: "",
        image: "",
        price: "",
        rating: "",
        category: "",
        type: "",
        description: "",
        brand: ""
    });

    const { id } = useParams();
    let navigate = useNavigate()

    useEffect(() => {
        getSingleProduct();
        fetchDbCategories();
        window.scroll(0, 0);
    }, []);

    const fetchDbCategories = async () => {
        try {
            const url = process.env.REACT_APP_ADMIN_GET_CATEGORY || 'http://localhost:5000/api/category/fetchcategories';
            const { data } = await axios.get(url);
            setDbCategories(data || []);
        } catch (err) {
            console.log("Error fetching DB categories:", err);
        }
    };

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
            setProductInfo({
                name: data.name || '',
                image: data.image || '',
                price: data.price || '',
                rating: data.rating || '',
                category: data.category || '',
                type: data.type || '',
                description: data.description || '',
                author: data.author || '',
                brand: data.brand || ''
            });
            setProduct(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const handleOnchange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    // Cloudinary File Upload handler
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const uploadUrl = process.env.REACT_APP_UPLOAD_IMAGE || 'http://localhost:5000/api/upload/uploadimage';
            const { data } = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': authToken
                }
            });

            if (data && data.url) {
                setProductInfo(prev => ({ ...prev, image: data.url }));
                toast.success("Image uploaded to Cloudinary!", { autoClose: 1000, theme: 'colored' });
            } else {
                toast.error("Cloudinary upload failed", { autoClose: 1000, theme: 'colored' });
            }
        } catch (err) {
            console.log("Upload error:", err);
            toast.error("Error uploading image to Cloudinary", { autoClose: 1000, theme: 'colored' });
        } finally {
            setUploading(false);
        }
    };

    // Category options populate directly from MongoDB categories + default categories
    const categoryOptions = [];
    dbCategories.forEach(cat => {
        if (cat.name && !categoryOptions.includes(cat.name)) {
            categoryOptions.push(cat.name);
        }
    });

    const defaultCategories = ["Men's Watches", "Women's Watches", "Kids' Watches", "Men's Perfumes", "Women's Perfumes"];
    defaultCategories.forEach(catName => {
        if (!categoryOptions.includes(catName)) {
            categoryOptions.push(catName);
        }
    });

    if (productInfo.category && !categoryOptions.includes(productInfo.category)) {
        categoryOptions.push(productInfo.category);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productInfo.name || !productInfo.image || !productInfo.price || !productInfo.category || !productInfo.description) {
            toast.error("Please fill all required fields", { autoClose: 1000, theme: 'colored' });
            return;
        }

        try {
            const updateUrl = `${process.env.REACT_APP_ADMIN_UPDATE_PRODUCT || 'http://localhost:5000/api/admin/updateproduct'}/${id}`;
            
            const payload = {
                ...productInfo,
                type: productInfo.type || (productInfo.category ? productInfo.category.toLowerCase() : 'watches')
            };

            const { data } = await axios.put(updateUrl, { productDetails: payload }, {
                headers: { 'Authorization': authToken }
            });

            if (data && (data.success === true || data === true)) {
                toast.success("Product updated successfully", { autoClose: 1000, theme: 'colored' });
                getSingleProduct();
            } else {
                toast.error(data?.error || "Failed to update product", { autoClose: 1000, theme: 'colored' });
            }
        } catch (error) {
            console.log("Error updating product:", error);
            toast.error("Something went wrong updating product", { autoClose: 1000, theme: 'colored' });
        }
    };

    const deleteProduct = async () => {
        try {
            const deleteUrl = `${process.env.REACT_APP_ADMIN_DELETE_PRODUCT || 'http://localhost:5000/api/admin/deleteproduct'}/${id}`;
            const { data } = await axios.delete(deleteUrl, {
                headers: { 'Authorization': authToken }
            });

            if (data && (data.success === true || data === true)) {
                toast.success("Product deleted successfully", { autoClose: 1000, theme: 'colored' });
                navigate(-1);
            } else {
                toast.error("Failed to delete product", { autoClose: 1000, theme: 'colored' });
            }
        } catch (error) {
            console.log("Error deleting product:", error);
            toast.error("Error deleting product", { autoClose: 1000, theme: 'colored' });
        }
    };

    return (
        <>
            <Container sx={{ width: "100%", marginBottom: 5 }}>
                {loading ? (
                    <section style={{ display: 'flex', flexWrap: "wrap", width: "100%", justifyContent: "space-around", alignItems: 'center' }}>
                        <Skeleton variant='rectangular' height={200} width="200px" />
                        <Skeleton variant='text' height={400} width={700} />
                    </section>
                ) : (
                    <Box sx={{ width: "100%", display: 'flex', flexWrap: "wrap", alignItems: "center", justifyContent: "space-around" }}>
                        <div className='detail-img-box' >
                            <img alt={productInfo.name} src={productInfo.image} className='detail-img' style={{ maxHeight: 250, objectFit: 'contain' }} />
                        </div>
                        <div>
                            <Typography variant='h4'>{productInfo.name}</Typography>
                        </div>
                    </Box>
                )}
                <form autoComplete="off" onSubmit={handleSubmit} style={{ marginTop: 30 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField label="Name" name='name' value={productInfo.name} onChange={handleOnchange} variant="outlined" required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Price" name='price' value={productInfo.price} onChange={handleOnchange} variant="outlined" inputMode='numeric' required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rating (0-5)" name='rating' value={productInfo.rating} onChange={handleOnchange} variant="outlined" inputMode='numeric' fullWidth />
                        </Grid>
                        <Grid item xs={12} >
                            <FormControl fullWidth required>
                                <InputLabel id="category-select-label">Product Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={productInfo.category}
                                    label="Product Category"
                                    name='category'
                                    onChange={handleOnchange}
                                >
                                    {categoryOptions.map(item =>
                                        <MenuItem value={item} key={item}>{item}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Cloudinary Image Input & File Upload */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField label="Image URL (Cloudinary)" name='image' value={productInfo.image} onChange={handleOnchange} variant="outlined" fullWidth />
                                <Button variant="outlined" component="label" endIcon={uploading ? <CircularProgress size={18} /> : <AiOutlineCloudUpload />} disabled={uploading}>
                                    Upload
                                    <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={{ margin: "10px auto" }}>
                            <TextField
                                value={productInfo.description} onChange={handleOnchange}
                                label="Description"
                                multiline
                                sx={{ width: "100%" }}
                                variant="outlined"
                                name='description'
                            />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit'>Save Changes</Button>
                    </Container>
                </form >
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                    <Typography variant='h6'>Delete {productInfo.name}?</Typography>
                    <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                </Box>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            <Typography variant='body1'>Do you want to delete this product?</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteProduct}>Delete</Button>
                        <Button variant='contained' color='primary'
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default SingleProduct