import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MUTATION_LOGIN } from "../api/Mutations/user";
import { useMutation } from "@apollo/client";

const Login = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); // Clear the error when input is changed
  };

  const validate = () => {
    let errors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email.trim()) {
      errors.email = "Email không được bỏ trống";
    } else if (!emailPattern.test(input.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!input.password.trim()) {
      errors.password = "Mật khẩu không được bỏ trống";
    } else if (input.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return errors;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await login();
      if (response.data.authenticateUserWithPassword.sessionToken) {
        const { sessionToken, item } =
          response.data.authenticateUserWithPassword;
        localStorage.setItem("sessionToken", sessionToken);
        localStorage.setItem("id", item.id);
        localStorage.setItem("name", item.name);
        localStorage.setItem("email", item.email);
        localStorage.setItem("phone", item.phone);
        localStorage.setItem("address", item.address);

        // Dispatch storage event to trigger the listener
        window.dispatchEvent(new Event("storage"));

        navigate("/", { state: { fromLogin: true } });
      } else if (response.data.authenticateUserWithPassword.message) {
        setErrorMsg(response.data.authenticateUserWithPassword.message);
      }
    } catch (error) {
      setErrorMsg("An error occured, Please try again !");
    }
  }

  const [login] = useMutation(MUTATION_LOGIN, {
    variables: input,
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-lg-3 col-md-4 col-sm-6">
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {/* Name Input */}

          <div className="form-group mb-3">
            <label htmlFor="name">
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="name">
              Mật Khẩu<span className="text-danger">*</span>
            </label>
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={input.password}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100">
            Đăng nhập
          </button>
        </form>
        <a href="/forgot-password" className="forgot-password">
          Quên mật khẩu?
        </a>
        <div className="text-center mt-3">
          <p className="register-redirect">
            Bạn chưa có tài khoản đăng ký{" "}
            <Link to="/register" className="text-danger">
              Tại đây
            </Link>
          </p>
        </div>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
