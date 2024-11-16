import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useMutation, gql } from "@apollo/client";

const AddUser = () => {
  // State lưu trữ thông tin người dùng
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  // Sử dụng hook Apollo để gọi mutation
  const [addUser, { loading, error }] = useMutation(ADD_USER);

  // Hàm xử lý khi người dùng thay đổi thông tin trong các input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Hàm xử lý khi form được submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi mutation để thêm người dùng
      const { data } = await addUser({
        variables: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: userData.role,
        },
      });

      console.log("User added successfully:", data.createUser);
      alert("User added successfully!");

      // Reset form sau khi thêm người dùng
      setUserData({ name: "", email: "", phone: "", address: "", role: "" });
    } catch (err) {
      console.error("Error adding user:", err);
      alert("There was an error adding the user.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Thêm Người Dùng</h2>
      <Form onSubmit={handleFormSubmit}>
        {/* Tên và Email */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Tên:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên người dùng"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Số điện thoại và Địa chỉ */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formPhone">
              <Form.Label>Số điện thoại:</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formAddress">
              <Form.Label>Địa chỉ:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="formRole">
              <Form.Label>Vai trò:</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={userData.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
                <option value="customer">Khách hàng</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-50" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm Người Dùng"}
          </Button>
        </div>
      </Form>
      {error && <p className="text-danger">Có lỗi xảy ra: {error.message}</p>}
    </Container>
  );
};

export default AddUser;
