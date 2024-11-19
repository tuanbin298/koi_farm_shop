import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";

export const GET_PROFILE_ADMIN = gql`
  query Users {
    users {
      id
      name
      email
      address
      phone
      role {
        id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
      name
      email
      address
      phone
      role {
        id
        name
      }
    }
  }
`;

const UserList = () => {
  const { loading, error, data, refetch } = useQuery(GET_PROFILE_ADMIN);
  const [updateUser] = useMutation(UPDATE_USER);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOriginalUser({ ...user });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalUser({ ...selectedUser });
    } else {
      handleSaveChanges();
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const updates = {};

    if (selectedUser.name !== originalUser.name) updates.name = selectedUser.name;
    if (selectedUser.email !== originalUser.email) updates.email = selectedUser.email;
    if (selectedUser.address !== originalUser.address) updates.address = selectedUser.address;
    if (selectedUser.phone !== originalUser.phone) updates.phone = selectedUser.phone;

    if (Object.keys(updates).length === 0) {
      return;
    }

    try {
      await updateUser({
        variables: {
          id: selectedUser.id,
          data: updates,
        },
      });
      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box
      sx={{
        marginLeft: "20%",
        marginRight: "5%",
        marginTop: "5%",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Danh sách người dùng
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tên Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Vai trò</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => handleRowClick(user)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for User Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          {selectedUser && (
            <>
              <Typography
                id="modal-title"
                variant="h4"
                component="h2"
                sx={{ mb: 2 }}
              >
                Chi Tiết Sản Phẩm
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    label="Tên khách hàng"
                    name="name"
                    value={selectedUser.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Số điện thoại"
                    name="phone"
                    value={selectedUser.phone}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Địa chỉ"
                    name="address"
                    value={selectedUser.address}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>

                 <Typography>
                    <strong>Tên:</strong> {selectedUser.name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {selectedUser.email}
                  </Typography>
                  <Typography>
                    <strong>Số điện thoại:</strong> {selectedUser.phone}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong> {selectedUser.address}
                  </Typography>
                  <Typography>
                    <strong>Vai trò:</strong> {selectedUser.role.name}
                  </Typography>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                  borderTop: "1px solid #ddd",
                }}
              >
                <Button variant="contained" onClick={handleEditToggle}>
                  <UpdateIcon />
                  {isEditing ? "Lưu" : "Cập Nhật"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UserList;
