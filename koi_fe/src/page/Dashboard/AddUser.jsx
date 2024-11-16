import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const AddUser = () => {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    alert("User added successfully!");
    setUserData({ name: "", email: "", phone: "", address: "", role: "" });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Thêm Người Dùng</h2>
      <Form onSubmit={handleFormSubmit}>
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
                type="text"
                name="role"
                value={userData.role}
                onChange={handleInputChange}
                placeholder="Nhập vai trò"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-50">
            Thêm Người Dùng
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddUser; 