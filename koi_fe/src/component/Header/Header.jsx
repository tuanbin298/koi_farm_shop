import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/Logo/Logo.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, MenuItem, IconButton, Breadcrumbs, Typography } from "@mui/material";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path
  
  const checkLoginStatus = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    const storedUserName = localStorage.getItem("name");
    
    if (sessionToken) {
      setLoggedIn(true);
      setUserName(storedUserName);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    // Call initially to check login status on component mount
    checkLoginStatus();

    // Add event listener to listen to localStorage changes
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");

    setLoggedIn(false);
    setAnchorEl(null);
    navigate("/login");
  };

  // Helper function to build the breadcrumb based on the current location
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x); // Splits the pathname by "/" and removes empty items
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/" style={{
          textDecoration:"none",
          color:"white"
        }}>Trang chủ</Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // If this is the last item, render it as plain text
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={to} color="text.primary" style={{
              textDecoration:"none",
          color:"white"
            }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link key={to} to={to} >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header_top">
          <div className="header_top-location">
            <LocationOnIcon className="header_top-icon" />
            <span>Thành phố Dĩ An, tỉnh Bình Dương</span>
          </div>

          <div className="header_top-contact">
            <PhoneEnabledIcon className="header_top-icon" />
            <a href="">123457890</a>
          </div>

          <div className="header_top-cart">
            <ShoppingCartIcon className="header_top-icon" />
            <span className="header_top-cart-text"> Giỏ hàng</span>
          </div>

          <div className="header_top-auth">
            {loggedIn ? (
              <>
                <IconButton onClick={handleMenuClick}>
                  <AccountCircleIcon className="header_top-icon" />
                  <span>{userName}</span>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <span>
                <Link to="/login" className="linkForm">
                  Đăng nhập
                </Link>{" "}
                |{" "}
                <Link to="/register" className="linkForm">
                  Đăng ký
                </Link>
              </span>
            )}
          </div>
        </div>

        <div className="header_mid">
          <div className="header_mid-logo">
            <Link to="/">
              <img src={logo} alt="Ca Koi Viet Logo" />
            </Link>
          </div>

          <nav className="header_mid-nav">
            <a href="/">Trang chủ</a>
            <a href="/about">Giới thiệu</a>
            <a href="/koi">Cá Koi Nhật</a>
            <a href="/consignment">Ký gửi</a>
            <a href="/news">Tin tức</a>
          </nav>

          <div className="header_mid-search">
            <input type="text" placeholder="Tìm kiếm..." />
            <button>
              <SearchRoundedIcon />
            </button>
          </div>
        </div>

        <div className="header_bottom">
          {generateBreadcrumbs()}
        </div>
      </header>
    </div>
  );
}
