import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardOverview from "./DashboardOverview";
import OrderList from "./OrderList";
import AdminProductList from "./AdminProductList";
import ConsignmentSaleList from "./ConsignmentSaleList";
import ConsignmentCareList from "./ConsignmentCareList";
import CreateProductForm from "./Forms/CreateProductForm";
import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import UserList from "./UserList";
import AddUser from "./AddUser";
import CategoryList from "./CategoryList";
import CreateCategoryForm from "./Forms/CreateCategoryForm";
import FeedbackList from "./FeedbackList";
const drawerWidth = 240;

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [openDropdowns, setOpenDropdowns] = useState({
    orders: false,
    products: false,
    users: false,
    consignmentSales: false,
    consignmentCares: false,
    category: false,
  });

  const toggleDropdown = (section) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section],
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
      case "addProduct":
        return <CreateProductForm />;
      case "users":
        return <UserList />;
      case "userDetail1":
        return <AddUser />;
      case "consignmentSales":
        return <ConsignmentSaleList />;
      case "consignmentCares":
        return <ConsignmentCareList />;
      case "category":
        return <CategoryList />;
      case "addCategory":
        return <CreateCategoryForm />;
      case "feedback":
        return <FeedbackList />;
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
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Typography sx={{ marginLeft: "5%", fontSize: "25px", color: "red" }}>
            Dashboard
          </Typography>
          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setSelectedSection("overview")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Tổng quan" />
              </ListItemButton>
            </ListItem>
            <Typography
              sx={{ marginLeft: "5%", fontSize: "25px", color: "red" }}
            >
              Chung
            </Typography>

            {/* Đơn hàng Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDropdown("orders")}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
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
                <ListItemIcon>
                  <ShoppingBagIcon />
                </ListItemIcon>
                <ListItemText primary="Sản phẩm" />
                {openDropdowns.products ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openDropdowns.products} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("products")}
                  >
                    <ListItemText primary="Danh sách sản phẩm" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("addProduct")}
                  >
                    <ListItemText primary="Thêm sản phẩm" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Người dùng Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDropdown("users")}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                  <ListItemButton
                    onClick={() => setSelectedSection("userDetail1")}
                  >
                    <ListItemText primary="Thêm người dùng" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Đơn ký gửi bán Dropdown */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => toggleDropdown("consignmentSales")}
              >
                <ListItemIcon>
                  <AutoStoriesIcon />
                </ListItemIcon>
                <ListItemText primary="Đơn ký gửi" />
                {openDropdowns.consignmentSales ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={openDropdowns.consignmentSales}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("consignmentSales")}
                  >
                    <ListItemText primary="Danh sách ký gửi bán" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("consignmentCares")}
                  >
                    <ListItemText primary="Danh sách ký gửi nuôi" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Phân loại Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDropdown("category")}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Phân loại" />
                {openDropdowns.category ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openDropdowns.category} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("category")}
                  >
                    <ListItemText primary="Danh sách phân loại" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("addCategory")}
                  >
                    <ListItemText primary="Thêm phân loại" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Đánh giá Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDropdown("feedback")}>
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText primary="Đánh giá" />
                {openDropdowns.feedback ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openDropdowns.feedback} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedSection("feedback")}
                  >
                    <ListItemText primary="Danh sách đánh giá" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box
        sx={{
          marginLeft: "15%",
        }}
      >
        <Header />
      </Box>
      <Box sx={{ padding: 3 }}>{renderContent()}</Box>
    </>
  );
};

export default Dashboard;
