import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/Logo/Logo.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {
  Menu,
  MenuItem,
  IconButton,
  Breadcrumbs,
  Typography,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { GET_CATEGORY } from "../../page/api/Queries/category"; // Import the GraphQL query
import { GET_CART_ITEMS } from "../../page/api/Queries/cartItem";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Cá Koi Nhật dropdown control
  const [kiguiDropdownOpen, setKiguiDropdownOpen] = useState(false); // Ký gửi dropdown control

  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  // Fetching data for fish types using Apollo's useQuery
  const { data, loading, error } = useQuery(GET_CATEGORY);
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART_ITEMS, {
    variables: { where: {} }, // Thay đổi điều kiện nếu cần
    fetchPolicy: "network-only", // Bắt buộc lấy dữ liệu mới nhất từ server
  });

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = loggedIn ? (
    cartData?.cartItems?.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    ) || 0):0;

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
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

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
    localStorage.removeItem("cartId");
    setLoggedIn(false);
    setAnchorEl(null);
    navigate("/login");
  };

  // Mapping URL paths to Vietnamese labels
  const breadcrumbMap = {
    "": "Trang chủ", // Empty for homepage
    koiList: "Danh sách Cá Koi",
    sales: "Ký Gửi Bán",
    care: "Ký Gửi Nuôi",
    cart: "Giỏ hàng",
    profile: "Thông tin cá nhân",
    login: "Đăng nhập",
    register: "Đăng ký",
    about: "Giới thiệu",
    news: "Tin tức",
    ProductDetail: "Chi tiết",
    introduce: "Giới thiệu",
  };

  // Function to generate breadcrumbs based on current URL
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
      <Breadcrumbs
        aria-label="breadcrumb"
        style={{
          color: "white",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          {breadcrumbMap[""]}
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const translatedLabel = breadcrumbMap[value] || value;

          return isLast ? (
            <Typography
              key={to}
              color="text.primary"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              {translatedLabel}
            </Typography>
          ) : (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              {translatedLabel}
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
            <div style={{ position: "relative" }}>
              <ShoppingCartIcon className="header_top-icon" />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-9px",
                    backgroundColor: "white",
                    color: "red",
                    borderRadius: "40%",
                    padding: "1px 5px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </div>
            <Link to="/cart">Giỏ hàng</Link>
          </div>

          <div className="header_top-auth">
            {loggedIn ? (
              <>
                <IconButton onClick={handleMenuClick}>
                  <Avatar alt="profile pic" src="src/assets/kohaku.jpg" />
                  <span
                    style={{
                      color: "white",
                    }}
                  >
                    {userName}
                  </span>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/consignment-tracking")}>
                    Theo dõi ký gửi
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
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

        {/* Middle bar with navigation */}
        <div className="header_mid">
          <div className="header_mid-logo">
            <Link to="/">
              <img src={logo} alt="Ca Koi Viet Logo" />
            </Link>
          </div>

          <nav className="header_mid-nav">
            <Link to="/" className="linkForm">
              Trang chủ
            </Link>
            <Link to="/introduce" className="linkForm">
              Giới thiệu
            </Link>

            {/* Dropdown Cá Koi */}
            <div
              className="dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link to="/koiList">Cá Koi Nhật</Link>
              {/* Hiển thị tất cả các loại cá Koi */}
              {dropdownOpen && (
                <div className="dropdown-content">
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div>Error loading data</div>
                  ) : (
                    data?.categories.map((type) => (
                      <Link
                        key={type.id}
                        to={`/koiList/${type.id}`}
                        className="dropdown-item"
                      >
                        {type.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Dropdown Ký gửi */}
            <div
              className="dropdown"
              onMouseEnter={() => setKiguiDropdownOpen(true)}
              onMouseLeave={() => setKiguiDropdownOpen(false)}
            >
              <a href="#">Ký gửi</a>
              {kiguiDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/sales" className="dropdown-item">
                    Ký Gửi Bán
                  </Link>
                  <Link to="/care" className="dropdown-item">
                    Ký Gửi Nuôi
                  </Link>
                </div>
              )}
            </div>

            <Link to="/news" className="linkForm">
              Tin tức
            </Link>
          </nav>

          <div className="header_mid-search">
            <input type="text" placeholder="Tìm kiếm..." />
            <button>
              <SearchRoundedIcon />
            </button>
          </div>
        </div>
        <div className="header_bottom">{generateBreadcrumbs()}</div>
      </header>
    </div>
  );
}
