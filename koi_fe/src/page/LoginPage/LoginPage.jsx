import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MUTATION_LOGIN } from "../api/Mutations/user";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "../../page/api/Queries/cartItem";

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
    setErrors({ ...errors, [name]: "" });
  };

  const [login] = useMutation(MUTATION_LOGIN, {
    variables: input,
  });

  const { refetch: refetchCartItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: {
          id: { equals: localStorage.getItem("id") || "" },
        },
      },
    },
    fetchPolicy: "network-only",
    skip: !localStorage.getItem("id"),
  });

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await login();
      const authData = response.data.authenticateUserWithPassword;
      if (authData?.sessionToken) {
        const { sessionToken, item } = authData;
        const userId = item.id;
        localStorage.setItem("sessionToken", sessionToken);
        localStorage.setItem("id", userId);
        localStorage.setItem("name", item.name);
        localStorage.setItem("email", item.email);
        localStorage.setItem("phone", item.phone);
        localStorage.setItem("address", item.address);

        // Trigger the storage event for consistency
        window.dispatchEvent(new Event("storage"));

        // Refetch cart items after login
        await refetchCartItems({
          where: {
            user: {
              id: { equals: userId },
            },
          },
        });

        if (item.role.name === "Admin" || item.role.name === "Nhân viên") {
          navigate("/Dashboard", { state: { fromLogin: true } });
        } else {
          navigate("/", { state: { fromLogin: true } });
        }
      } else if (authData?.message) {
        setErrorMsg(authData.message);
      }
    } catch (error) {
      setErrorMsg("An error occurred, Please try again!");
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-lg-3 col-md-4 col-sm-6">
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group mb-3">
            <label htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">
              Mật Khẩu<span className="text-danger">*</span>
            </label>
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={input.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100">
            Đăng nhập
          </button>
        </form>
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
