import React from "react";
import "./Header.css";
import logo from "../../assets/Logo/Logo.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        {/* Header top */}
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
            <AccountCircleIcon className="header_top-icon" />
            <span><Link to="/login" className="linkForm">Đăng nhập</Link> | <Link to="/register" className="linkForm">Đăng ký</Link></span>
          </div>
        </div>

        {/* Header mid */}
        <div className="header_mid">
          <div className="header_mid-logo">
            <Link to="/"><img src={logo} alt="Ca Koi Viet Logo" /></Link>
          </div>

          <nav className="header_mid-nav">
            <a href="">Trang chủ</a>
            <a href="">Giới thiệu</a>
            <a href="">Cá Koi Nhật</a>
            <a href="">Ký gửi</a>
            <a href="">Tin tức</a>
          </nav>

          <div className="header_mid-search">
            <input type="text" placeholder="Tìm kiếm..." />
            <button>
              <SearchRoundedIcon />
            </button>
          </div>
        </div>

        {/* Header bottom */}
        <div className="header_bottom">
          <span>Trang chủ &gt; Đăng ký tài khoản</span>
        </div>
      </header>
    </div>
  );
}
