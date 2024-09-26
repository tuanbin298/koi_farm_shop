import React, { useState } from "react";
import './RegisterPage.css'; 
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); // Xóa lỗi khi người dùng nhập liệu
  };

  // Kiểm tra hợp lệ các trường form
  const validate = () => {
    let errors = {};

    // Kiểm tra họ tên
    if (!formData.firstName.trim()) {
      errors.firstName = "Tên không được bỏ trống";
    } else if (formData.firstName.length < 2) {
      errors.firstName = "Tên phải có ít nhất 2 ký tự";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Họ không được bỏ trống";
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Họ phải có ít nhất 2 ký tự";
    }

    // Kiểm tra email hợp lệ
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email không được bỏ trống";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Kiểm tra số điện thoại
    const phonePattern = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được bỏ trống";
    } else if (!phonePattern.test(formData.phone)) {
      errors.phone = "Số điện thoại phải là 10-11 chữ số";
    }

    // Kiểm tra mật khẩu
    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được bỏ trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return errors;
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully:", formData);
      // Gửi dữ liệu API hoặc thực hiện hành động khác tại đây
    } else {
      setErrors(validationErrors); // Cập nhật tất cả các lỗi khi có
    }
  };

  return (
    <div className="registration-form">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Họ*"
            className={errors.firstName ? "input-error" : ""}
          />
          <span
            className={`tooltip-error ${errors.firstName ? "visible" : ""}`}
          >
            {errors.firstName}
          </span>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tên*"
            className={errors.lastName ? "input-error" : ""}
          />
          <span className={`tooltip-error ${errors.lastName ? "visible" : ""}`}>
            {errors.lastName}
          </span>
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email*"
            className={errors.email ? "input-error" : ""}
          />
          <span className={`tooltip-error ${errors.email ? "visible" : ""}`}>
            {errors.email}
          </span>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại*"
            className={errors.phone ? "input-error" : ""}
          />
          <span className={`tooltip-error ${errors.phone ? "visible" : ""}`}>
            {errors.phone}
          </span>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu*"
            className={errors.password ? "input-error" : ""}
          />
          <span className={`tooltip-error ${errors.password ? "visible" : ""}`}>
            {errors.password}
          </span>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu*"
            className={errors.confirmPassword ? "input-error" : ""}
          />
          <span
            className={`tooltip-error ${
              errors.confirmPassword ? "visible" : ""
            }`}
          >
            {errors.confirmPassword}
          </span>
        </div>

        <button type="submit" className="register-button">
          Đăng ký
        </button>

        <p className="login-redirect">
          Bạn đã có tài khoản đăng nhập <Link to="/login">Tại đây</Link>
        </p>
      </form>

      
    </div>
  );
};

export default RegisterPage;
