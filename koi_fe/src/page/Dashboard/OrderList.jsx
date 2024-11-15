import React, { useState, useEffect } from 'react';
import { GET_ALL_ORDERS } from '../api/Queries/order';
import { useQuery } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function OrderList() {
    const { data: getOrders, error, loading } = useQuery(GET_ALL_ORDERS);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const orders = getOrders?.orders || [];

    const handleCheckboxChange = (orderId) => {
        setSelectedOrders((prevSelected) => {
            if (prevSelected.includes(orderId)) {
                return prevSelected.filter(id => id !== orderId);
            } else {
                return [...prevSelected, orderId];
            }
        });
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedOrders([]);
        } else {
            const allOrderIds = orders.map(order => order.id);
            setSelectedOrders(allOrderIds);
        }
        setSelectAll(!selectAll);
    };

    
    useEffect(() => {
        setSelectAll(selectedOrders.length === orders.length && orders.length > 0);
    }, [selectedOrders, orders]);

    const handleDelete = () => {
        console.log('Deleting orders with IDs:', selectedOrders);

       
        const updatedOrders = orders.filter(order => !selectedOrders.includes(order.id));
        getOrders.orders = updatedOrders;
        setSelectedOrders([]);
        setSelectAll(false);
    };

    return (
        <>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', mb: 2, marginLeft: "15%",
                marginTop: "5%"
            }}>
                <Typography variant="h4">Danh sách đơn hàng <ListAltIcon /></Typography>
                {selectedOrders.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete Selected
                    </Button>
                )}
            </Box>
            <TableContainer component={Paper} sx={{
                marginLeft: "15%",
                marginTop: "2%",
                width: "85%"
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectAll}
                                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                                    onChange={handleSelectAllChange}
                                    color="primary"
                                />
                            </TableCell>
                            <TableCell>Ngày đặt hàng</TableCell>
                            <TableCell>Phương thức thanh toán</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => handleCheckboxChange(order.id)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {order.createAt}
                                </TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>{order.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
