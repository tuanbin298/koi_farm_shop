import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Card, CardContent, Grid } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts';
import { GET_ALL_ORDERS } from '../api/Queries/order';
import { GET_ALL_PRODUCTS_ADMIN } from '../api/Queries/product';
import { useMutation, useQuery } from '@apollo/client';
import { formatMoney } from '../../utils/formatMoney';

const drawerWidth = 240;



export default function DashboardOverview() {
    const [openDropdown, setOpenDropdown] = useState({});
    const {data:getOrders,loading,error, refetch:refetchOrders} = useQuery(GET_ALL_ORDERS);
    const {
        data:getAllProducts,
        refetch:refetchAllProducts
    } = useQuery(GET_ALL_PRODUCTS_ADMIN)
    //Tổng doanh thu
    let totalPrice = 0;
    //Tổng sản phẩm
    let totalProductSold = 0;
    //Tổng đơn 
    let totalOrders = 0;

    let totalProducts = getAllProducts?.products?.length
    const monthlyRevenue = Array(12).fill(0);
    const revenueGrowth = Array(12).fill(0);
    console.log(monthlyRevenue)

    //Calculate total profit for each month
    if (getOrders && getOrders.orders) {
        getOrders.orders.forEach((order) => {
            totalPrice += order.price;
            totalProductSold += order.items.length;

            //monthly profit
            const orderDate = new Date(order.createAt);
            console.log(orderDate.getMonth())
            const month = orderDate.getMonth();
            monthlyRevenue[month] += order.price;
        });
        totalOrders = getOrders.orders.length;
    }
    console.log(monthlyRevenue)
    for (let i = 1; i < 12; i++) {
        const previousMonthRevenue = monthlyRevenue[i - 1];
        const currentMonthRevenue = monthlyRevenue[i];

        if (previousMonthRevenue > 0 && currentMonthRevenue > 0) {
            //growth algorithm
            revenueGrowth[i] = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        }
        else{
            revenueGrowth[i] = 0;
        }
    }
    //Bar chart's months
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const handleToggle = (itemText) => {
        setOpenDropdown((prev) => ({
            ...prev,
            [itemText]: !prev[itemText]
        }));
    };

    useEffect(()=>{
        refetchOrders()
    }, [refetchOrders])

    useEffect(() => {
        refetchAllProducts()
    }, [refetchAllProducts])
    return (
        <>
        
            <Box sx={{ display: 'flex', marginLeft:"15%" }}>


                <Box component="main" sx={{ flexGrow: 1, padding: 5, marginRight: "10%" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h4">Tổng quan</Typography>
                    </Box>

                    {/* Cards Grid */}
                    <Grid container spacing={3}>
                        {/* Revenue Card */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px" }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" sx={{ marginBottom: "5%" }}>
                                        <TimelineIcon fontSize="large" />
                                        <Typography variant="subtitle1">Tổng doanh thu</Typography>
                                    </Box>
                                    <Typography variant="h4" component="div">{formatMoney(totalPrice)}</Typography>
                                    {/* <Box display="flex" alignItems="center">
                                        <Typography color="success.main" variant="body2" sx={{ ml: 0.5 }}>
                                            15% increase vs last month
                                        </Typography>
                                    </Box> */}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Products Sold Card */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px" }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" sx={{ marginBottom: "5%" }}>
                                        <PointOfSaleIcon fontSize="large" />
                                        <Typography variant="subtitle1">Tổng sản phẩm bán</Typography>
                                    </Box>
                                    <Typography variant="h4" component="div">{totalProductSold} Sản Phẩm</Typography>
                                    {/* <Box display="flex" alignItems="center">
                                        <Typography color="error.main" variant="body2">
                                            5% decrease vs last month
                                        </Typography>
                                    </Box> */}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Orders Card */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px" }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" sx={{ marginBottom: "5%" }}>
                                        <CreditScoreIcon fontSize="large" />
                                        <Typography variant="subtitle1">Tổng đơn hàng</Typography>
                                    </Box>
                                    <Typography variant="h4" component="div">{totalOrders} Đơn</Typography>
                                    {/* <Box display="flex" alignItems="center">
                                        <Typography color="success.main" variant="body2">
                                            12% increase vs last month
                                        </Typography>
                                    </Box> */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px" }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" sx={{ marginBottom: "5%" }}>
                                        <Inventory2Icon fontSize="large" />
                                        <Typography variant="subtitle1">Tổng sản phẩm trong trang trại</Typography>
                                    </Box>
                                    <Typography variant="h4" component="div">{totalProducts} Sản Phẩm</Typography>
                                    {/* <Box display="flex" alignItems="center">
                                        <Typography color="error.main" variant="body2">
                                            5% decrease vs last month
                                        </Typography>
                                    </Box> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px",
                                    width:"120%",
                                    paddingLeft:"10%"
                                 }}>
                                <CardContent>
                                        <Typography variant="h4">Doanh thu theo thời gian</Typography>
                                        <BarChart
                                            xAxis={[{
                                                scaleType: 'band',
                                                data: months
                                            }]}
                                            series={[{
                                                data: monthlyRevenue
                                            }]}
                                            width={800}
                                            height={500}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            {/* <Grid item xs={4}>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <ListItem>
                                        <ListItemText primary="Đơn hàng 1" secondary="Jan 9, 2014" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Đơn hàng 2" secondary="Jan 7, 2014" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Đơn hàng 3" secondary="July 20, 2014" />
                                    </ListItem>
                                </List>
                            </Grid> */}
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                        <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ borderRadius: "5%", padding: "5px",
                                    width:"120%",
                                    paddingLeft:"10%"
                                 }}>
                                    <CardContent>
                                        <Typography variant="h4">Tăng trưởng doanh thu (%)</Typography>
                                        <LineChart
                                            xAxis={[{
                                                scaleType: 'band',
                                                data: months // Bỏ qua tháng 1 vì không có dữ liệu tăng trưởng
                                            }]}
                                            series={[{
                                                data: revenueGrowth// Bỏ qua tháng 1 vì không có dữ liệu tăng trưởng
                                            }]}
                                            width={800}
                                            height={400}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
