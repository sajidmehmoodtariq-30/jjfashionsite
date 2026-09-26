import React, { useEffect, useState } from 'react';
import { AiOutlineSearch, AiFillDelete, AiOutlineEdit } from 'react-icons/ai';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    InputAdornment,
    TextField,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddProduct from '../AddProduct';

const ProductTable = ({ data, getProductInfo }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');

    const columns = [
        { id: 'image', label: 'Image', minWidth: 80, align: 'center' },
        { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
        { id: 'category', label: 'Category', minWidth: 120, align: 'center' },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'rating', label: 'Rating', minWidth: 80, align: 'center' },
        { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' },
    ];

    const filterData = () => {
        const safeData = Array.isArray(data) ? data : [];
        if (searchTerm === '') {
            return safeData;
        }
        return safeData.filter(
            (item) =>
                !item ? false :
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.price && item.price.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setFilteredData(filterData());
    };

    useEffect(() => {
        setFilteredData(filterData());
    }, [data, searchTerm]);

    const handleDeleteOpen = (prod) => {
        setSelectedProduct(prod);
        setOpenDelete(true);
    };

    const handleDeleteSubmit = async () => {
        if (!selectedProduct) return;
        try {
            const deleteUrl = `${process.env.REACT_APP_ADMIN_DELETE_PRODUCT || '/api/admin/deleteproduct'}/${selectedProduct._id}`;
            const { data } = await axios.delete(deleteUrl, {
                headers: { 'Authorization': authToken }
            });
            if (data && (data.success === true || data === true)) {
                toast.success("Product deleted successfully", { autoClose: 1000, theme: 'colored' });
                setOpenDelete(false);
                if (getProductInfo) getProductInfo();
            } else {
                toast.error("Failed to delete product", { autoClose: 1000, theme: 'colored' });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting product", { autoClose: 1000, theme: 'colored' });
        }
    };

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3, marginTop: 3 }}>
                <TextField
                    id="search-product"
                    type="search"
                    label="Search Products"
                    value={searchTerm}
                    onChange={handleSearch}
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
            <AddProduct getProductInfo={getProductInfo} data={data} />
            <Paper style={{ overflow: "auto", maxHeight: "500px" }}>
                <TableContainer sx={{ maxHeight: '500px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ position: 'sticky', top: 0 }}>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, color: "#1976d2", fontWeight: 'bold' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <Typography variant="body1" color="textSecondary" sx={{ py: 2 }}>
                                            No products found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((prod) => (
                                    <TableRow key={prod._id}>
                                        <TableCell align="center">
                                            <Link to={`/admin/home/product/${prod.type || 'item'}/${prod._id}`}>
                                                <img src={prod.image} alt={prod.name} style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "6px" }} />
                                            </Link>
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center" style={{ fontWeight: '600' }}>
                                            <Link to={`/admin/home/product/${prod.type || 'item'}/${prod._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                {prod.name ? (prod.name.length > 25 ? prod.name.slice(0, 25) + '...' : prod.name) : 'Unnamed'}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            {prod.category || prod.type || '-'}
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                            ₹{prod.price}
                                        </TableCell>
                                        <TableCell align="center">
                                            {prod.rating || 'N/A'} ⭐
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit Product">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/admin/home/product/${prod.type || 'item'}/${prod._id}`)}
                                                >
                                                    <AiOutlineEdit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Product">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteOpen(prod)}
                                                >
                                                    <AiFillDelete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirm Delete Product</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete <b>{selectedProduct?.name}</b>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDeleteSubmit}>Delete Product</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductTable;