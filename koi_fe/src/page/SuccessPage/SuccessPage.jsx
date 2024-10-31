import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSalesPath = location.state?.from === "/sales";
  const isPaymentPath = location.state?.from === "/payment";

  const goToHome = () => navigate("/");
  const goToTracking = () =>
    navigate(isSalesPath ? "/profile" : isPaymentPath ? "/profile" : "/");

  return (
    <div className="container text-center my-5">
      <h1>
        {isSalesPath
          ? "Yêu cầu ký gửi thành công!"
          : isPaymentPath
          ? "Đặt hàng thành công!"
          : "Thành công!"}
      </h1>
      <p>
        {isSalesPath
          ? "Cảm ơn bạn đã đăng ký ký gửi cá Koi. Chúng tôi sẽ liên hệ với bạn sớm."
          : isPaymentPath
          ? "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn ngay."
          : "Cảm ơn bạn!"}
      </p>

      <div className="mt-4">
        <button onClick={goToHome} className="btn btn-primary me-2 text-white">
          Quay lại trang chủ
        </button>

        {isSalesPath || isPaymentPath ? (
          <button onClick={goToTracking} className="btn btn-success text-white">
            {isSalesPath ? "Theo dõi đơn ký gửi" : "Theo dõi đơn hàng"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SuccessPage;
