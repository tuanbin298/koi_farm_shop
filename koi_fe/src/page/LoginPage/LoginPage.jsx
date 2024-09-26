import React, { useState } from 'react';
import './LoginPage.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Đăng nhập</button>
      </form>
      <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
      <div className="login-link-container">
      <p className="login-redirect ">Bạn chưa có tài khoản đăng ký <a href="/login">Tại đây</a></p>

      </div>
    </div>
  );
};

export default Login;
