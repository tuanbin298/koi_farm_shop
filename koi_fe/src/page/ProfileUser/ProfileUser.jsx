import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileUser.css'; 
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../api/Mutations/user";
import toast, { Toaster } from "react-hot-toast";

const ProfileUser = () => {
  const [selectedTab, setSelectedTab] = useState("accountInfo");
  const [isEditing, setIsEditing] = useState(false);

  const [newName, setNewName] = useState(localStorage.getItem("name") || "");
  const newEmail = localStorage.getItem("email") || ""; // Email cố định, không chỉnh sửa.
  const [newPhone, setNewPhone] = useState(localStorage.getItem("phone") || "");
  const [newAddress, setNewAddress] = useState(localStorage.getItem("address") || ""); // Thêm lại địa chỉ
  const [errors, setErrors] = useState({});

  const [updateUserProfile, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_PROFILE);

  const validateForm = () => {
    let formErrors = {};
    if (!newName.trim()) formErrors.name = "Tên không được bỏ trống.";
    if (!newPhone.trim()) formErrors.phone = "Số điện thoại không được bỏ trống.";
    if (!newAddress.trim()) formErrors.address = "Địa chỉ không được bỏ trống.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng sửa các lỗi trước khi lưu.");
      return;
    }

    try {
      const variables = {
        where: { id: localStorage.getItem("id") },
        data: { name: newName, phone: newPhone, address: newAddress }, 
      };

      const result = await updateUserProfile({ variables });

      if (result.data.updateUser) {
        localStorage.setItem("name", result.data.updateUser.name);
        localStorage.setItem("phone", result.data.updateUser.phone);
        localStorage.setItem("address", result.data.updateUser.address); 
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "accountInfo":
        return (
          <div>
            <h4>Thông Tin Tài Khoản</h4>
            {isEditing ? (
              <div>
                <p>
                  <strong>Email:</strong> {newEmail}
                </p>
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
                <p><strong>Email:</strong> {newEmail}</p>
                <p><strong>Tên tài khoản:</strong> {newName}</p>
                <p><strong>Điện thoại:</strong> {newPhone}</p>
                <p><strong>Địa chỉ:</strong> {newAddress}</p> {/* Hiển thị địa chỉ */}
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary mt-2">
                  Chỉnh sửa
                </button>
              </div>
            )}
          </div>
        );
      case "orders":
        return (
          <div>
            <h4>Đơn Hàng Của Bạn</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Đơn Hàng</th>
                  <th>Ngày</th>
                  <th>Địa Chỉ</th>
                  <th>Giá Trị Đơn Hàng</th>
                  <th>Tình Trạng Đơn Hàng</th>
                  <th>Thông Tin Giao Hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center">Không có đơn hàng.</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "tracking":
        return (
          <div>
            <h4>Theo Dõi Đơn Hàng Ký Gửi Bán</h4>
            <p>Thông tin đơn hàng ký gửi bán sẽ được hiển thị ở đây.</p>
            {/* Thêm nội dung theo dõi đơn hàng ký gửi bán ở đây */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        {/* Menu bên trái */}
        <div className="col-md-3 border-end">
          <h4 className="mt-2">TRANG TÀI KHOẢN</h4>
          <p>Xin chào, <strong className="text-danger">{localStorage.getItem("name")}!</strong></p>
          <ul className="list-unstyled">
            <li className={`mt-3 ${selectedTab === "accountInfo" ? "text-danger" : ""}`}
                onClick={() => setSelectedTab("accountInfo")}>
              Thông tin tài khoản
            </li>
            <li className={`mt-2 ${selectedTab === "orders" ? "text-danger" : ""}`}
                onClick={() => setSelectedTab("orders")}>
              Đơn hàng của bạn
            </li>
            <li className={`mt-2 ${selectedTab === "tracking" ? "text-danger" : ""}`}
                onClick={() => setSelectedTab("tracking")}>
              Đơn hàng ký gửi bán
            </li>
          </ul>
        </div>

        {/* Nội dung bên phải */}
        <div className="col-md-9">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
