import React, { useState } from "react";
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
  CircularProgress,
  Checkbox
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation } from "@apollo/client";

import { GET_PROFILE_ADMIN } from "../api/Queries/user";
import { UPDATE_USER } from "../api/Mutations/user";

const UserList = () => {
  // Query
  const { loading, error, data, refetch } = useQuery(GET_PROFILE_ADMIN);

  const users = data?.users || [];
  console.log(users)
  // Mutation
  const [updateUser] = useMutation(UPDATE_USER);

  // State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  // Handle
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

    if (selectedUser.name !== originalUser.name)
      updates.name = selectedUser.name;
    if (selectedUser.email !== originalUser.email)
      updates.email = selectedUser.email;
    if (selectedUser.address !== originalUser.address)
      updates.address = selectedUser.address;
    if (selectedUser.phone !== originalUser.phone)
      updates.phone = selectedUser.phone;

    if (Object.keys(updates).length > 0) {
      try {
        await updateUser({
          variables: {
            id: selectedUser.id,
            data: updates,
          },
        });

        await refetch();
        toast.success("Cập nhật người dùng thành công");
        handleCloseModal();
      } catch (error) {
        toast.error("Lỗi cập nhật người dùng!");
        console.error("Đã xảy ra lỗi khi cập nhật người dùng :", err);
      }
    } else {
      toast("Không có gì thay đổi");
      handleCloseModal();
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", marginTop: 4 }}
      >
        Error loading articles: {error.message}
      </Typography>
    );


    // When check one checkbox
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // When check all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      const allUserIds = users.map((user) => user.id);
      setSelectedUsers(allUserIds);
    }
    setSelectAll(!selectAll);
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Danh sách người dùng
        </Typography>
        {selectedUsers.length > 0 && (
          <Button
            variant="contained"
            color="error"
          >
            Xoá sản phẩm
          </Button>
        )}
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tên Khách Hàng
                </TableCell>
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      handleCheckboxChange(user.id);
                    }}
                    
                    color="primary"
                  />
                </TableCell>
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
                  Chi Tiết người dùng
                </Typography>
                {isEditing ? (
                  <>
                    {/* Name */}
                    <TextField
                      label="Tên khách hàng"
                      name="name"
                      value={selectedUser.name}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Email */}
                    <TextField
                      label="Email"
                      name="email"
                      value={selectedUser.email}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Phone */}
                    <TextField
                      label="Số điện thoại"
                      name="phone"
                      value={selectedUser.phone}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Address */}
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
    </>
  );
};

export default UserList;
