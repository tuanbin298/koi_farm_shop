import React from "react";
import "./Footer.css";
import logo from "../../assets/Logo/Logo.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export default function Footer() {
  return (
    <div className="containe">
      {/* Footer */}
      <footer className="footer">
        <div className="footer_content">
          <div className="footer_logo">
            <img src={logo} alt="Ca Koi Viet Logo" />
            <p>
              Cá Koi Việt | Showroom Cá Koi | Chuyên bán cá Koi chuẩn Nhật |
              Thiết kế thi công hồ cá Koi chuyên nghiệp & tiểu cảnh sân vườn |
              Hậu mãi tận tâm chu đáo
            </p>
          </div>

          {/* Footer about us */}
          <div className="footer_about-us">
            <h3>Về chúng tôi</h3>
            <ul>
              <li>Giới thiệu Cá Koi Việt</li>
              <li>Showroom</li>
              <li>Trang trại</li>
              <li>Bán đỏ</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          {/* Footer support */}
          <div className="footer_support">
            <h3>Hỗ trợ</h3>
            <ul>
              <li>Hướng dẫn thanh toán</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách vận chuyển</li>
              <li>Vận chuyển cá Koi toàn quốc</li>
              <li>Chính sách đổi trả hàng</li>
              <li>Chính sách bảo hành</li>
              <li>Bảo mật thông tin khách hàng</li>
            </ul>
          </div>

          {/* Footer contact */}
          <div className="footer_contact">
            <h3>Liên hệ</h3>
            <ul>
              <li>
                <LocationOnIcon />
                <span>
                  C5 C7 đường số 12, P. Hưng Phú 1, Q. Cái Răng, TP Cần Thơ
                </span>
              </li>
              <li>
                <PhoneEnabledIcon />
                <span>1234567890</span>
              </li>
              <li>
                <BookmarkIcon />
                <span>HotroCakoiViet@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Footer bottom */}
          <div className="footer_bottom">
            <p>© Ca Koi Viet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
