import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";

import { GET_ALL_ROLE } from "../../api/Queries/role";
import { REGISTER_MUTATION } from "../../api/Mutations/user";
import { GET_PROFILE_ADMIN } from "../../api/Queries/user";

const AddUser = ({ setSelectedSection }) => {
  // Query
  const { data: roleData, loading, error } = useQuery(GET_ALL_ROLE);
  const { data, refetch: refetchUsers } = useQuery(GET_PROFILE_ADMIN);

  // Mutation
  const [registerData] = useMutation(REGISTER_MUTATION);

  // State
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
  });

  // Handle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerData({
        variables: {
          data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            password: userData.password,
            role: { connect: { id: userData.role } },
          },
        },
      });

      await refetchUsers();
      toast.success("Thêm người dùng thành công");
      setTimeout(() => {
        setSelectedSection("users");
      }, 1000);
    } catch (err) {
      toast.error("Lỗi tạo người dùng!");
      console.error("Đã xảy ra lỗi khi tạo người dùng:", err);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
              {/* Name */}
              <Col md={6}>
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

              {/* Password */}
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Mật khẩu:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              {/* Email */}
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

              {/* Phone */}
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
              {/* Address */}
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Địa chỉ:
                  </Form.Label>
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
                {/* Role */}
                <Form.Group controlId="formRole">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Vai trò:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    {loading ? (
                      <option>Đang tải...</option>
                    ) : error ? (
                      <option>Lỗi khi tải vai trò</option>
                    ) : (
                      roleData?.roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))
                    )}
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
    </>
  );
};

export default AddUser;
