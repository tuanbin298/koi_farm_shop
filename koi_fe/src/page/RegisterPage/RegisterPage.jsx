import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_MUTATION } from "../api/Mutations/user";
import { GET_ROLE_BY_NAME } from "../api/Queries/role";
import { MUTATION_REGISTER_EMAIL } from "../api/Mutations/mail";

const RegisterPage = () => {
  // Take role "khách hàng" to connect with user
  const {
    data: roleData,
    loading: roleLoading,
    error: roleError,
  } = useQuery(GET_ROLE_BY_NAME, {
    variables: {
      where: {
        name: {
          equals: "Khách hàng",
        },
      },
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const [registerEmail] = useMutation(MUTATION_REGISTER_EMAIL);

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

    if (!formData.address.trim()) {
      errors.address = "Địa chỉ không được bỏ trống";
    }

    const phonePattern = /(03|05|07|08|09|01[2|6|8|9])([0-9]{8})\b/;
    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được bỏ trống";
    } else if (!phonePattern.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được bỏ trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Mật khẩu nhập lại không được bỏ trống";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
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
              address: formData.address,
              password: formData.password,
              role: {
                connect: {
                  id: roleData.roles[0].id,
                },
              },
            },
          },
        });
        console.log("Account registered successfully:", response.data);

        // Send mail when user registe success
        if (response.data.createUser) {
          try {
            await registerEmail({
              variables: {
                to: response.data.createUser.email,
                userId: response.data.createUser.id,
              },
            });
          } catch (err) {
            console.log("Lỗi gửi thông báo: ", err);
          }
        }

        navigate("/login");
      } catch (err) {
        console.error("Error registering account:", err);
      }
    } else {
      setErrors(validationErrors); // Update errors if validation fails
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-lg-3 col-md-4 col-sm-6">
        <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group mb-3">
            <label htmlFor="name">
              Họ và Tên<span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và Tên"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* Email Input */}
          <div className="form-group mb-3">
            <label htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Phone Input */}
          <div className="form-group mb-3">
            <label htmlFor="phone">
              Số điện thoại<span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          {/* Address Input */}
          <div className="form-group mb-3">
            <label htmlFor="address">
              Địa chỉ<span className="text-danger">*</span>
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group mb-3">
            <label htmlFor="password">
              Mật khẩu<span className="text-danger">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-danger mt-3">Đã xảy ra lỗi: {error.message}</p>
          )}

          {/* Login Redirect */}
          <p className="text-center mt-3">
            Bạn đã có tài khoản? Đăng nhập{" "}
            <Link to="/login" className="text-danger">
              tại đây
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
