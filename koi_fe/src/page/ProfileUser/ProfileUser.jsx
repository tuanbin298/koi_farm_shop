import React from "react";
import './ProfileUser.css';

const ProfileUser = () => {
  return (
    <div className="profile-container">
      <div className="profile-left">
        <h2>THÔNG TIN TÀI KHOẢN</h2>
        <p>Xin chào, {localStorage.getItem("userName")} !</p>
        
        <table>
          <thead>
            <tr>
              <th>Đơn hàng</th>
              <th>Ngày</th>
              <th>Địa chỉ</th>
              <th>Giá trị đơn hàng</th>
              <th>Tình trạng đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="no-orders">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="profile-right">
        <h3>TÀI KHOẢN CỦA TÔI</h3>
        <p><strong>Tên tài khoản:</strong>{localStorage.getItem("userName")}</p>
        <p><strong>Email:</strong> </p>
        <p><strong>Điện thoại:</strong> </p>
        <p><strong>Địa chỉ:</strong> </p>
        <button className="address-btn">Sửa địa chỉ </button>
      </div>
    </div>
  );
}

export default ProfileUser;
