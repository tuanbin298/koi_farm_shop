import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileUser.css'; 

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(localStorage.getItem("address") || "");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveAddress = () => {
    localStorage.setItem("address", newAddress);
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">THÔNG TIN TÀI KHOẢN</h2>
          <p>Xin chào, {localStorage.getItem("name")}!</p>

          <table className="table table-bordered">
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
                <td colSpan="5" className="text-center">No orders found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h3 className="text-center mb-4">TÀI KHOẢN CỦA TÔI</h3>
          <p><strong>Tên tài khoản:</strong> {localStorage.getItem("name")}</p>
          <p><strong>Email:</strong> {localStorage.getItem("email")}</p>
          <p><strong>Điện thoại:</strong> {localStorage.getItem("phone")}</p>

          <p>
            <strong>Địa chỉ:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="form-control mt-2"
              />
            ) : (
              <span>{newAddress}</span>
            )}
          </p>

          {isEditing ? (
            <button className="btn btn-custom mt-2" onClick={handleSaveAddress}>
              Lưu địa chỉ
            </button>
          ) : (
            <button className="btn btn-custom mt-2" onClick={handleEditClick}>
              Sửa địa chỉ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
