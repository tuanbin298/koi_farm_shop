// src/page/SuccessPage/SuccessPage.js
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SuccessPage = () => {
  return (
    <div className="container text-center my-5">
      <h1>Đăng ký ký gửi thành công!</h1>
      <p>
        Cảm ơn bạn đã đăng ký ký gửi cá Koi. Chúng tôi sẽ liên hệ với bạn sớm.
      </p>

      <div className="mt-4">
        {/* Nút quay lại trang chủ */}
        <Link to="/" className="btn btn-primary me-2">
          Quay lại trang chủ
        </Link>

        {/* Nút theo dõi đơn ký gửi */}
        <Link to="/consignment-tracking" className="btn btn-success">
          Theo dõi đơn ký gửi
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
