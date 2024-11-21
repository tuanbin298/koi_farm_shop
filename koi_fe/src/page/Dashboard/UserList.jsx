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
  Checkbox,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation } from "@apollo/client";

import { GET_PROFILE_ADMIN, GET_PROFILE } from "../api/Queries/user";
import { UPDATE_USER } from "../api/Mutations/user";

const UserList = () => {
  const userId = localStorage.getItem("id");
  // Query
  const { loading, error, data, refetch } = useQuery(GET_PROFILE_ADMIN);
  const { data: userData } = useQuery(GET_PROFILE, {
    variables: {
      where: {
        id: userId,
      },
    },
  });
  const users = data?.users || [];
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
        Lỗi tải bải viết: {error.message}
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
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          marginLeft: "15%",
          marginTop: "5%",
        }}
      >
        <Typography variant="h4">
          Danh sách người dùng <ListAltIcon />
        </Typography>
        {selectedUsers.length > 0 && (
          <Button variant="contained" color="error">
            Xoá người dùng
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          marginLeft: "15%",
          marginTop: "2%",
          width: "85%",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {userData.user.role.name === "Admin" ? (
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
              ) : (
                <TableCell></TableCell>
              )}

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
                {userData.user.role.name === "Admin" ? (
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
                ) : (
                  <TableCell></TableCell>
                )}

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
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Button
              onClick={handleCloseModal}
              variant="text"
              sx={{ textTransform: "none", color: "red" }}
            >
              <CloseIcon />
              Đóng
            </Button>
          </Box>
          <Box
            sx={{
              overflowY: "auto",
              maxHeight: "70vh", // Chiều cao tối đa
            }}
          >
            {selectedUser && (
              <Box sx={{ p: 2 }}>
                <Typography
                  id="modal-title"
                  variant="h4"
                  component="h5"
                  sx={{ mb: 2 }}
                >
                  Chi Tiết Người Dùng
                </Typography>
                {isEditing ? (
                  <>
                    {/* Editable Fields */}
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
                    {/* Read-Only Display */}
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
                {userData.user.role.name === "Admin" ||
                userId === selectedUser.id ? (
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
                ) : (
                  <></>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
    )
};

export default UserList;
