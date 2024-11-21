import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Pagination,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORY } from "../api/Queries/category";
import { UPDATE_CATEGORY } from "../api/Mutations/category";
import { DELETE_CATEGORY } from "../api/Mutations/category";
import { GET_PROFILE } from "../api/Queries/user";
export default function CategoryList() {
  const userId = localStorage.getItem("id");
  // Query
  const {
    data: getCategories,
    error,
    loading,
    refetch,
  } = useQuery(GET_CATEGORY);
  const { data: userData } = useQuery(GET_PROFILE, {
    variables: {
      where: {
        id: userId,
      },
    },
  });
  const categories = getCategories?.categories || [];

  // Mutation
  const [deleteCategories] = useMutation(DELETE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

  // State
  const [selectAll, setSelectAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalCategory, setOriginalCategory] = useState(null);

  useEffect(() => {
    setSelectAll(
      selectedCategories.length === categories.length && categories.length > 0
    );
  }, [selectedCategories, categories]);

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = categories.slice(startIndex, endIndex) || [];

  // Handle
  const handlePageChange = (event, value) => setPage(value);
  // When check one checkbox
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedCategories([]);
    } else {
      const allCategoryIds = categories.map((category) => category.id);
      setSelectedCategories(allCategoryIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowClick = (category) => {
    setSelectedCategory(category);
    setOriginalCategory({ ...category });
    setOpenModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
    setOriginalCategory(null);
  };

  const handleInputChange = (field, value) => {
    setSelectedCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChange = () => {
    if (!isEditing) {
      setOriginalCategory({ ...selectedCategory });
    } else {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    if (!selectedCategory || !originalCategory) return;

    const categoryId = selectedCategory.id;
    const dataToUpdate = {};

    if (selectedCategory.name !== originalCategory.name) {
      dataToUpdate.name = selectedCategory.name;
    }
    if (selectedCategory.description !== originalCategory.description) {
      dataToUpdate.description = selectedCategory.description;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      try {
        await updateCategory({
          variables: {
            where: { id: categoryId },
            data: dataToUpdate,
          },
        });

        await refetch();
        toast.success("Cập nhật thành công");
        handleCloseModal();
      } catch (error) {
        toast.error("Lỗi cập nhật!");
        console.error("Đã xảy ra lỗi khi cập nhật:", err);
      }
    } else {
      toast("Không có gì thay đổi");
      handleCloseModal();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategories({
        variables: {
          where: selectedCategories.map((id) => ({ id })),
        },
      });

      await refetch();
      toast.success("Xóa thành công");
      setSelectedCategories([]);
      setSelectAll(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa phân loại!");
      console.error("Đã xảy ra lỗi khi xóa phân loại:", error);
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
        Lỗi tải: {error.message}
      </Typography>
    );

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
          Danh sách phân loại cá <ListAltIcon />
        </Typography>
        {selectedCategories.length > 0 && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xoá phân loại
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {userData.user.role.name === "Admin" ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    indeterminate={
                      selectedCategories.length > 0 &&
                      selectedCategories.length < categories.length
                    }
                    onChange={handleSelectAllChange}
                    color="primary"
                  />
                </TableCell>
              ) : (
                <TableCell></TableCell>
              )}

              <TableCell>Tên phân loại</TableCell>
              <TableCell>Mô tả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((category) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(category)}
                style={{ cursor: "pointer" }}
              >
                {userData.user.role.name === "Admin" ? (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleCheckboxChange(category.id)}
                      color="primary"
                    />
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}

                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>
                  {category.description || "Không có mô tả"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          display="flex"
          justifyContent="center"
          marginTop={2}
          sx={{
            marginBottom: "2%",
          }}
        >
          <Pagination
            count={Math.ceil(categories.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </TableContainer>

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
          {/* Nút Đóng */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Button
              variant="text"
              onClick={handleCloseModal}
              sx={{ textTransform: "none", color: "red", fontWeight: "bold" }}
            >
              <CloseIcon />
              Đóng
            </Button>
          </Box>
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              maxHeight: "70vh", // Chiều cao tối đa
            }}
          >
            {selectedCategory && (
              <>
                <Typography
                  id="modal-title"
                  variant="h4"
                  component="h2"
                  sx={{ mb: 2 }}
                >
                  Chi Tiết phân loại
                </Typography>
                {isEditing ? (
                  <>
                    {/* Name */}
                    <TextField
                      label="Tên"
                      name="name"
                      value={selectedCategory.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Category */}
                    <TextField
                      label="Mô tả"
                      name="description"
                      value={selectedCategory.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography>
                      <strong>Tên:</strong> {selectedCategory.name}
                    </Typography>
                    <Typography>
                      <strong>Mô tả:</strong> {selectedCategory.description}
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
                  <Button variant="contained" onClick={handleSaveChange}>
                    <UpdateIcon />
                    {isEditing ? "Lưu" : "Cập Nhật"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
