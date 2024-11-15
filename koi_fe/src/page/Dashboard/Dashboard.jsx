import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardOverview from './DashboardOverview';
import OrderList from './OrderList';
import AdminProductList from './AdminProductList';
import UserList from "./UserList";
import AddUser from "./AddUser";

const drawerWidth = 240;

const Dashboard = () => {
    const [selectedSection, setSelectedSection] = useState("overview");
    const [openDropdowns, setOpenDropdowns] = useState({
        orders: false,
        products: false,
        users: false,
    });

    const toggleDropdown = (section) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderContent = () => {
        switch (selectedSection) {
            case "overview":
                return <DashboardOverview />;
            case "orders":
                return <OrderList />;
            case "products":
                return <AdminProductList />;
            case "productDetail1":
                return <DashboardOverview />;
            case "users":
                return <UserList />;
            case "userDetail1":
                return <AddUser />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <Typography sx={{ marginLeft: "5%", fontSize: "25px", color: "red" }}>Dashboard</Typography>
                    <Divider />

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setSelectedSection("overview")}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary="Tổng quan" />
                            </ListItemButton>
                        </ListItem>
                        <Typography sx={{ marginLeft: "5%", fontSize: "25px", color: "red" }}>Chung</Typography>

                        {/* Đơn hàng Dropdown */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => toggleDropdown("orders")}>
                                <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                                <ListItemText primary="Đơn hàng" />
                                {openDropdowns.orders ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={openDropdowns.orders} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedSection("orders")}>
                                        <ListItemText primary="Danh sách đơn hàng" />
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </Collapse>

                        {/* Sản phẩm Dropdown */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => toggleDropdown("products")}>
                                <ListItemIcon><ShoppingBagIcon /></ListItemIcon>
                                <ListItemText primary="Sản phẩm" />
                                {openDropdowns.products ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={openDropdowns.products} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedSection("products")}>
                                        <ListItemText primary="Danh sách sản phẩm" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedSection("productDetail1")}>
                                        <ListItemText primary="Thêm sản phẩm" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>

                        {/* Người dùng Dropdown */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => toggleDropdown("users")}>
                                <ListItemIcon><PersonIcon /></ListItemIcon>
                                <ListItemText primary="Người dùng" />
                                {openDropdowns.users ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={openDropdowns.users} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedSection("users")}>
                                        <ListItemText primary="Danh sách người dùng" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedSection("userDetail1")}>
                                        <ListItemText primary="Thêm người dùng" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>

            {renderContent()}
        </>
    );
};

export default Dashboard;
