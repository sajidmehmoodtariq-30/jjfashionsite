import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, InputAdornment, TextField, Button, Box, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, CircularProgress
} from '@mui/material';
import { AiOutlineSearch, AiFillDelete, AiOutlineEdit, AiOutlineCloudUpload } from 'react-icons/ai';
import { MdCategory, MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Transition } from '../../../Constants/Constant';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const authToken = localStorage.getItem('Authorization');

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        type: 'all',
        image: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const url = process.env.REACT_APP_ADMIN_GET_CATEGORY || 'http://localhost:5000/api/category/fetchcategories';
            const { data } = await axios.get(url);
            setCategories(data || []);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load categories", { autoClose: 1000, theme: 'colored' });
        }
    };

    const handleOnchange = (e) => {
        setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    };

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
                setCategoryForm(prev => ({ ...prev, image: data.url }));
                toast.success("Image uploaded to Cloudinary!", { autoClose: 1000, theme: 'colored' });
            } else {
                toast.error("Cloudinary upload failed", { autoClose: 1000, theme: 'colored' });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error uploading image to Cloudinary", { autoClose: 1000, theme: 'colored' });
        } finally {
            setUploading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.name) {
            toast.error("Category name is required", { autoClose: 1000, theme: 'colored' });
            return;
        }
        try {
            const addUrl = process.env.REACT_APP_ADMIN_ADD_CATEGORY || 'http://localhost:5000/api/category/addcategory';
            const { data } = await axios.post(addUrl, categoryForm, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                toast.success("Category added successfully", { autoClose: 1000, theme: 'colored' });
                setOpenAdd(false);
                setCategoryForm({ name: '', type: 'all', image: '', description: '' });
                fetchCategories();
            }
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Failed to add category";
            toast.error(msg, { autoClose: 1000, theme: 'colored' });
        }
    };

    const handleEditOpen = (cat) => {
        setSelectedCategory(cat);
        setCategoryForm({
            name: cat.name,
            type: cat.type || 'all',
            image: cat.image || '',
            description: cat.description || ''
        });
        setOpenEdit(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateUrl = `${process.env.REACT_APP_ADMIN_UPDATE_CATEGORY || 'http://localhost:5000/api/category/updatecategory'}/${selectedCategory._id}`;
            const { data } = await axios.put(updateUrl, categoryForm, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                toast.success("Category updated successfully", { autoClose: 1000, theme: 'colored' });
                setOpenEdit(false);
                fetchCategories();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update category", { autoClose: 1000, theme: 'colored' });
        }
    };

    const handleDeleteOpen = (cat) => {
        setSelectedCategory(cat);
        setOpenDelete(true);
    };

    const handleDeleteSubmit = async () => {
        try {
            const deleteUrl = `${process.env.REACT_APP_ADMIN_DELETE_CATEGORY || 'http://localhost:5000/api/category/deletecategory'}/${selectedCategory._id}`;
            const { data } = await axios.delete(deleteUrl, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                toast.success("Category deleted successfully", { autoClose: 1000, theme: 'colored' });
                setOpenDelete(false);
                fetchCategories();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete category", { autoClose: 1000, theme: 'colored' });
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeDropdown = ['all', 'watches', 'perfumes', 'cloths', 'shoe', 'electronics', 'book', 'jewelery'];

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3, marginTop: 3 }}>
                <TextField
                    id="search-category"
                    type="search"
                    label="Search Categories"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: 350, sm: 500, md: 800 } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AiOutlineSearch />
                            </InputAdornment>
                        ),
                    }}
                />
            </Container>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "20px 0" }}>
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">Manage Categories</Typography>
                <Button variant='contained' endIcon={<MdCategory />} onClick={() => {
                    setCategoryForm({ name: '', type: 'all', image: '', description: '' });
                    setOpenAdd(true);
                }}>
                    Add Category
                </Button>
            </Box>
            <Divider sx={{ mb: 4 }} />

            <Paper style={{ overflow: "auto", maxHeight: "500px" }}>
                <TableContainer sx={{ maxHeight: '500px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ color: "#1976d2", fontWeight: 'bold' }}>Image</TableCell>
                                <TableCell align="center" style={{ color: "#1976d2", fontWeight: 'bold' }}>Category Name</TableCell>
                                <TableCell align="center" style={{ color: "#1976d2", fontWeight: 'bold' }}>Product Type</TableCell>
                                <TableCell align="center" style={{ color: "#1976d2", fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="center" style={{ color: "#1976d2", fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1">No categories found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell align="center">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                                            ) : (
                                                <div style={{ width: "60px", height: "60px", backgroundColor: "#eee", display: "inline-block", borderRadius: "8px", lineHeight: "60px" }}>No Img</div>
                                            )}
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>{cat.name}</TableCell>
                                        <TableCell align="center">{cat.type}</TableCell>
                                        <TableCell align="center">{cat.description || '-'}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleEditOpen(cat)}>
                                                <AiOutlineEdit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteOpen(cat)}>
                                                <AiFillDelete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Category Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} keepMounted TransitionComponent={Transition} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}>Add New Category</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleAddSubmit} style={{ marginTop: 10 }}>
                        <TextField label="Category Name" name="name" value={categoryForm.name} onChange={handleOnchange} variant="outlined" fullWidth required sx={{ mb: 2 }} />
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="type-select-label">Product Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                value={categoryForm.type}
                                label="Product Type"
                                name="type"
                                onChange={handleOnchange}
                            >
                                {typeDropdown.map(item => (
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Image Upload field */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                            <TextField label="Image URL (Cloudinary)" name="image" value={categoryForm.image} onChange={handleOnchange} variant="outlined" fullWidth />
                            <Button variant="outlined" component="label" endIcon={uploading ? <CircularProgress size={18} /> : <AiOutlineCloudUpload />} disabled={uploading}>
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                            </Button>
                        </Box>

                        {categoryForm.image && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <img src={categoryForm.image} alt="Preview" style={{ maxHeight: 100, borderRadius: 8 }} />
                            </Box>
                        )}

                        <TextField label="Description" name="description" value={categoryForm.description} onChange={handleOnchange} variant="outlined" multiline rows={3} fullWidth />

                        <DialogActions sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="error" onClick={() => setOpenAdd(false)} endIcon={<MdOutlineCancel />}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary" endIcon={<MdCategory />}>Save Category</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} keepMounted TransitionComponent={Transition} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}>Edit Category</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditSubmit} style={{ marginTop: 10 }}>
                        <TextField label="Category Name" name="name" value={categoryForm.name} onChange={handleOnchange} variant="outlined" fullWidth required sx={{ mb: 2 }} />
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="edit-type-select-label">Product Type</InputLabel>
                            <Select
                                labelId="edit-type-select-label"
                                value={categoryForm.type}
                                label="Product Type"
                                name="type"
                                onChange={handleOnchange}
                            >
                                {typeDropdown.map(item => (
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                            <TextField label="Image URL (Cloudinary)" name="image" value={categoryForm.image} onChange={handleOnchange} variant="outlined" fullWidth />
                            <Button variant="outlined" component="label" endIcon={uploading ? <CircularProgress size={18} /> : <AiOutlineCloudUpload />} disabled={uploading}>
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                            </Button>
                        </Box>

                        {categoryForm.image && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <img src={categoryForm.image} alt="Preview" style={{ maxHeight: 100, borderRadius: 8 }} />
                            </Box>
                        )}

                        <TextField label="Description" name="description" value={categoryForm.description} onChange={handleOnchange} variant="outlined" multiline rows={3} fullWidth />

                        <DialogActions sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="error" onClick={() => setOpenEdit(false)} endIcon={<MdOutlineCancel />}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary" endIcon={<AiOutlineEdit />}>Update Category</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete category <b>{selectedCategory?.name}</b>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDeleteSubmit}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CategoryTable;
