import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Box, Typography } from "@mui/material";

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
    <Box
      sx={{
        marginLeft: "25%",
        marginRight: "10%",
        marginTop: "5%",
        backgroundColor: "#f9f9f9",
        padding: 3,
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: "black" }}>
        Thêm Người Dùng
      </Typography>

      <Form onSubmit={handleFormSubmit}>
        <Box
          component="div"
          sx={{
            padding: "30px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label style={{ fontWeight: "bold" }}>Tên:</Form.Label>
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
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label style={{ fontWeight: "bold" }}>Email:</Form.Label>
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
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Số điện thoại:
                </Form.Label>
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
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formAddress">
                <Form.Label style={{ fontWeight: "bold" }}>Địa chỉ:</Form.Label>
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
            <Col md={6}>
              <Form.Group controlId="formRole">
                <Form.Label style={{ fontWeight: "bold" }}>Vai trò:</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn vai trò</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Quản Lý</option>
                  <option value="employee">Nhân Viên</option>
                  <option value="customer">Khách Hàng</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              type="submit"
              className="w-50"
              sx={{
                backgroundColor: "#4287f5",
                color: "write",
                "&:hover": {
                  backgroundColor: "#357ae8",
                },
              }}
            >
              Thêm Người Dùng
            </Button>
          </div>
        </Box>
      </Form>
    </Box>
  );
};

export default AddUser;
