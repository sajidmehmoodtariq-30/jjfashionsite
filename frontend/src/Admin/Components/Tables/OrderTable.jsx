import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Typography,
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Link } from 'react-router-dom';

const OrderTable = ({ orders }) => {
    const [openOrderId, setOpenOrderId] = useState("");
    const safeOrders = Array.isArray(orders) ? orders : [];
    const sortedOrders = [...safeOrders].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return (
        <>
            <Paper
                style={{
                    overflow: "auto",
                    maxHeight: "500px"
                }}
            >
                <TableContainer sx={{ maxHeight: '500px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ position: 'sticky', top: 0 }}>
                            <TableRow>
                                <TableCell />
                                <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>User Name</TableCell>
                                <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Phone Number</TableCell>
                                <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Total Amount</TableCell>
                                <TableCell sx={{ color: "#1976d2", fontWeight: 'bold' }}>Order Created Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" color="textSecondary" sx={{ py: 2 }}>
                                            No orders found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <TableRow>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => setOpenOrderId(openOrderId === order._id ? "" : order._id)}
                                                >
                                                    <MdKeyboardArrowDown />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell component="th" scope="row">
                                                <Link to={`user/${order.user}`}>
                                                    {`${order.userData?.firstName || 'Guest'} ${order.userData?.lastName || ''}`}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`user/${order.user}`}>{order.userData?.userEmail || 'N/A'}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`user/${order.user}`}>{order.userData?.phoneNumber || 'N/A'}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`user/${order.user}`}>₹{order.totalAmount || 0}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`user/${order.user}`}>
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-us', {
                                                        weekday: "long", year: "numeric", month: "short", day: "numeric"
                                                    }) : 'N/A'}
                                                    {" "}
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-US') : ''}
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openOrderId === order._id} timeout="auto" unmountOnExit>
                                                    <div style={{ padding: '10px 0' }}>
                                                        <Typography variant="body2">{`Address: ${order.userData?.address || 'N/A'}`}</Typography>
                                                        <Typography variant="body2">{`Zip Code: ${order.userData?.zipCode || 'N/A'}`}</Typography>
                                                        <Typography variant="body2">{`City: ${order.userData?.city || 'N/A'}`}</Typography>
                                                        <Typography variant="body2">{`State: ${order.userData?.userState || 'N/A'}`}</Typography>
                                                        <Table size="small" aria-label="purchases" sx={{ mt: 1 }}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left" sx={{ color: "#1976d2", fontWeight: 'bold' }}>Product Name</TableCell>
                                                                    <TableCell align="left" sx={{ color: "#1976d2", fontWeight: 'bold' }}>Image</TableCell>
                                                                    <TableCell align="left" sx={{ color: "#1976d2", fontWeight: 'bold' }}>Price</TableCell>
                                                                    <TableCell align="left" sx={{ color: "#1976d2", fontWeight: 'bold' }}>Quantity</TableCell>
                                                                    <TableCell align="left" sx={{ color: "#1976d2", fontWeight: 'bold' }}>Rating</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {Array.isArray(order.productData) && order.productData.map(product => (
                                                                    <TableRow key={product._id || Math.random()}>
                                                                        <TableCell align="left">
                                                                            <Link to={product.productId ? `/admin/home/product/${product.productId.type || 'cloths'}/${product.productId._id}` : '#'}>
                                                                                {product.productId?.name || 'Item Removed'}
                                                                            </Link>
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            {product.productId?.image ? (
                                                                                <img src={product.productId.image} alt={product.productId.name || 'product'} style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                                                                            ) : (
                                                                                <span>No Image</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            ₹{product.productId?.price || 0}
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            {product.quantity || 1}
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            {product.productId?.rating || 'N/A'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default OrderTable;
