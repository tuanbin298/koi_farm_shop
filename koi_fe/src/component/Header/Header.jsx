import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/Logo/Logo.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY } from "../../page/api/Queries/category";
import { GET_CART_ITEMS } from "../../page/api/Queries/cartItem";
import { useApolloClient } from "@apollo/client";

export default function Header() {
  const client = useApolloClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Cá Koi Nhật dropdown control
  const [kiguiDropdownOpen, setKiguiDropdownOpen] = useState(false); // Ký gửi dropdown control
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  // Fetching data for fish types using Apollo's useQuery
  const { data, loading, error } = useQuery(GET_CATEGORY);
  const UserId = localStorage.getItem("id");

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
    refetch: refetchItems,
  } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: {
          id: {
            equals: UserId,
          },
        },
      },
    },
    fetchPolicy: "network-only", // Bắt buộc lấy dữ liệu mới nhất từ server
  });

  useEffect(() => {
    if (cartData && cartData.cartItems) {
      const itemCount = loggedIn
        ? cartData?.cartItems?.reduce(
            (total, item) => total + (item.quantity || 1),
            0
          ) || 0
        : 0;
      setCartItemCount(itemCount);
    } else {
      setCartItemCount(0);
    }
  }, [cartData]);

  useEffect(() => {
    const handleCartUpdate = () => {
      refetchItems();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [refetchItems]);
  // Tính tổng số lượng sản phẩm trong giỏ hàng

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
    localStorage.removeItem("totalCarePrice");
    localStorage.removeItem("depositsArray");
    setLoggedIn(false);
    setAnchorEl(null);
    client.clearStore();
    navigate("/login");
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
                  <MenuItem onClick={() => navigate("/profile")}>
                    Thông tin cá nhân
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

            <Link to="/consignmentList" className="linkForm">
              Koi Ký Gửi
            </Link>

            <Link to="/news" className="linkForm">
              Tin tức
            </Link>
          </nav>

          <div className="header_mid-search"></div>
        </div>
        <div className="header_bottom"></div>
      </header>
    </div>
  );
}
