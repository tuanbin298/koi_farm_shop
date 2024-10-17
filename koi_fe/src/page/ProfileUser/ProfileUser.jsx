import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileUser.css';
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../api/Mutations/user";

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(localStorage.getItem("name") || "");
  const [newEmail, setNewEmail] = useState(localStorage.getItem("email") || "");
  const [newPhone, setNewPhone] = useState(localStorage.getItem("phone") || "");
  const [newAddress, setNewAddress] = useState(localStorage.getItem("address") || "");
  const [errors, setErrors] = useState({}); // Lưu các lỗi của form

  const [updateUserProfile, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_PROFILE);

  const handleEditClick = () => setIsEditing(true);

  // Kiểm tra lỗi của form
  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let formErrors = {};

    if (!newEmail.trim()) {
      formErrors.email = "Email không được bỏ trống.";
    } else if (!emailPattern.test(newEmail)) {
      formErrors.email = "Email không hợp lệ. @gmail.com";
    }

    if (!newName.trim()) formErrors.name = "Tên không được bỏ trống.";
    if (!newPhone.trim()) formErrors.phone = "Điện thoại không được bỏ trống.";
    if (!newAddress.trim()) formErrors.address = "Địa chỉ không được bỏ trống.";

    setErrors(formErrors);

    // Trả về true nếu không có lỗi nào
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      alert("Vui lòng sửa các lỗi trước khi lưu.");
      return;
    }

    try {
      const variables = {
        where: { id: localStorage.getItem("id") }, // Lấy ID từ localStorage
        data: {
          name: newName,
          email: newEmail,
          phone: newPhone,
          address: newAddress,
        },
      };

      const result = await updateUserProfile({ variables });

      if (result.data.updateUser) {
        // Cập nhật lại localStorage nếu thành công
        localStorage.setItem("name", result.data.updateUser.name);
        localStorage.setItem("email", result.data.updateUser.email);
        localStorage.setItem("phone", result.data.updateUser.phone);
        localStorage.setItem("address", result.data.updateUser.address);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin.");
    }
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
          {isEditing ? (
            <div>
              <p>
                <strong>Tên tài khoản:</strong>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-control mt-2"
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </p>
              <p>
                <strong>Email:</strong>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="form-control mt-2"
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </p>
              <p>
                <strong>Điện thoại:</strong>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="form-control mt-2"
                />
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
              </p>
              <p>
                <strong>Địa chỉ:</strong>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="form-control mt-2"
                />
                {errors.address && <p className="text-danger">{errors.address}</p>}
              </p>
              <button onClick={handleSaveChanges} className="btn btn-primary mt-2">
                Lưu
              </button>
              {updateLoading && <p>Đang cập nhật...</p>}
              {updateError && <p className="text-danger">Lỗi: {updateError.message}</p>}
            </div>
          ) : (
            <div>
              <p><strong>Tên tài khoản:</strong> {newName}</p>
              <p><strong>Email:</strong> {newEmail}</p>
              <p><strong>Điện thoại:</strong> {newPhone}</p>
              <p><strong>Địa chỉ:</strong> {newAddress}</p>
              <button onClick={handleEditClick} className="btn btn-secondary mt-2">
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
