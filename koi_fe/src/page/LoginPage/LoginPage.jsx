import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { MUTATION_LOGIN } from "../api/Mutations/user";
import { useMutation } from "@apollo/client";

const Login = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
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
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={input.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <a href="/forgot-password" className="forgot-password">
          Quên mật khẩu?
        </a>
        <div className="register-link-container">
          <p className="register-redirect">
            Bạn chưa có tài khoản đăng ký <Link to="/register" style={{
              color:"#e93131"
            }}>Tại đây</Link>
          </p>
        </div>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
