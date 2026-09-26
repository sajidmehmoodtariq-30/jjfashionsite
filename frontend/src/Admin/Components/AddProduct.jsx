import React, { useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, InputLabel, MenuItem, FormControl, Select, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdProductionQuantityLimits } from 'react-icons/md';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const AddProduct = ({ getProductInfo, data }) => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dbCategories, setDbCategories] = useState([]);

    let authToken = localStorage.getItem("Authorization");

    const [productInfo, setProductInfo] = useState({
        name: "",
        image: "",
        price: "",
        rating: "",
        category: "",
        type: "",
        description: "",
        author: "",
        brand: ""
    });

    useEffect(() => {
        fetchDbCategories();
    }, []);

    const fetchDbCategories = async () => {
        try {
            const url = process.env.REACT_APP_ADMIN_GET_CATEGORY || 'http://localhost:5000/api/category/fetchcategories';
            const { data } = await axios.get(url);
            setDbCategories(data || []);
        } catch (error) {
            console.log("Error fetching DB categories:", error);
        }
    };

    const handleOnchange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    // Cloudinary File Upload
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
        } catch (error) {
            console.log("Upload error:", error);
            toast.error("Error uploading image to Cloudinary", { autoClose: 1000, theme: 'colored' });
        } finally {
            setUploading(false);
        }
    };

    const handleClickOpen = () => {
        fetchDbCategories();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!productInfo.name || !productInfo.image || !productInfo.price || !productInfo.category || !productInfo.description) {
                toast.error("Please fill all required fields", { autoClose: 1000, theme: 'colored' });
                return;
            }
            if (productInfo.rating && (productInfo.rating < 0 || productInfo.rating > 5)) {
                toast.error("Please add valid rating (0-5)", { autoClose: 1000, theme: 'colored' });
                return;
            }

            const addUrl = process.env.REACT_APP_ADMIN_ADD_PRODUCT || 'http://localhost:5000/api/admin/addproduct';
            const derivedType = productInfo.category ? productInfo.category.toLowerCase() : 'watches';

            const payload = {
                name: productInfo.name,
                brand: productInfo.brand || '',
                price: productInfo.price,
                category: productInfo.category,
                image: productInfo.image,
                rating: productInfo.rating || 4.5,
                type: derivedType,
                author: productInfo.author || '',
                description: productInfo.description,
            };

            const { data } = await axios.post(addUrl, payload, {
                headers: { 'Authorization': authToken }
            });

            if (data && (data.success === true || data === true)) {
                setOpen(false);
                if (getProductInfo) getProductInfo();
                toast.success("Product added successfully", { autoClose: 1000, theme: 'colored' });
                setProductInfo({
                    name: "",
                    image: "",
                    price: "",
                    rating: "",
                    category: "",
                    type: "",
                    description: "",
                    author: "",
                    brand: ""
                });
            } else {
                toast.error(data?.error || "Something went wrong adding product", { autoClose: 1000, theme: 'colored' });
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add product", { autoClose: 1000, theme: 'colored' });
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

    const shoeBrand = ['adidas', 'hushpuppies', 'nike', 'reebok', 'vans'];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "20px 0" }} >
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">Add new product </Typography>
                <Button variant='contained' endIcon={<MdProductionQuantityLimits />} onClick={handleClickOpen}>Add</Button>
            </Box>
            <Divider sx={{ mb: 5 }} />
            <Dialog
                open={open}
                onClose={handleClose}
                keepMounted
                TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}> Add new product</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField label="Name" name='name' value={productInfo.name} onChange={handleOnchange} variant="outlined" required fullWidth />
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
                                {
                                    productInfo.category === 'book' &&
                                    <Grid item xs={12} >
                                        <TextField label="Author" name='author' value={productInfo.author} onChange={handleOnchange} variant="outlined" required fullWidth />
                                    </Grid>
                                }

                                {/* Cloudinary Image Input & File Upload Button */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField label="Image URL (Cloudinary)" name='image' value={productInfo.image} onChange={handleOnchange} variant="outlined" required fullWidth />
                                        <Button variant="outlined" component="label" endIcon={uploading ? <CircularProgress size={18} /> : <AiOutlineCloudUpload />} disabled={uploading}>
                                            Upload
                                            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                        </Button>
                                    </Box>
                                </Grid>

                                {productInfo.image && (
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={productInfo.image} alt="Preview" style={{ maxHeight: 100, borderRadius: 8 }} />
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6}>
                                    <TextField label="Price" name='price' value={productInfo.price} onChange={handleOnchange} variant="outlined" inputMode='numeric' required fullWidth />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField label="Rating (0-5)" name='rating' value={productInfo.rating} onChange={handleOnchange} variant="outlined" inputMode='numeric' fullWidth />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: "10px auto" }}>
                                    <TextField
                                        value={productInfo.description} onChange={handleOnchange}
                                        label="Description"
                                        multiline
                                        rows={3}
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                        name='description'
                                        required
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>
                            <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                                <Button fullWidth variant='contained' type='reset' color='error' onClick={handleClose} endIcon={<MdOutlineCancel />}>Cancel</Button>
                                <Button type="submit" fullWidth variant="contained" endIcon={<MdProductionQuantityLimits />}>Add</Button>
                            </DialogActions>
                        </form>
                    </Box >
                </DialogContent>
            </Dialog >
        </>
    );
};

export default AddProduct;