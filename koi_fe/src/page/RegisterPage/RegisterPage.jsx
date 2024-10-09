import React, { useState } from "react";
import './RegisterPage.css'; 
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { gql, useMutation } from "@apollo/client";

// GraphQL mutation
const REGISTER_MUTATION = gql`
mutation Mutation($data: UserCreateInput!) {
  createUser(data: $data) {
    id
    name
    email
    password {
      isSet
    }
    phone
  }
}
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [register, { loading, error, data }] = useMutation(REGISTER_MUTATION);

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); // Clear the error when input is changed
  };

  // Validate form fields
  const validate = () => {
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "Tên không được bỏ trống";
    } else if (formData.name.length < 2) {
      errors.name = "Tên phải có ít nhất 2 ký tự";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email không được bỏ trống";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    {/* phần sđt này Đăng sẽ sửa sau */}

    // const phonePattern = /^[0-9]{10,11}$/;
    // if (!formData.phone.trim()) {
    //   errors.phone = "Số điện thoại không được bỏ trống";
    // } else if (!phonePattern.test(formData.phone)) {
    //   errors.phone = "Số điện thoại phải là 10-11 chữ số";
    // }

    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được bỏ trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send the form data to the GraphQL API
        const response = await register({
          variables: {
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password, // Only send the password field
            },
          },
        });
        console.log("Account registered successfully:", response.data);

        // Redirect to home page after successful registration
        navigate("/login"); // Programmatic navigation to the home page
      } catch (err) {
        console.error("Error registering account:", err);
      }
    } else {
      setErrors(validationErrors); // Update errors if validation fails
    }
  };

  return (
    <div className="registration-form">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và Tên*"
            className={errors.name ? "input-error" : ""}
          />
          <span className={`tooltip-error ${errors.name ? "visible" : ""}`}>
            {errors.name}
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

        {/* Optional confirm password field */}
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
          />
          {/* No validation or errors displayed for confirmPassword */}
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {error && <p className="error-message">Đã xảy ra lỗi: {error.message}</p>}

        <p className="login-redirect">
          Bạn đã có tài khoản đăng nhập <Link to="/login">Tại đây</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
