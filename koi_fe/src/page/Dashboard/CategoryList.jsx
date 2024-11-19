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
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORY } from "../api/Queries/category";
import { UPDATE_CATEGORY } from "../api/Mutations/category";
import { DELETE_CATEGORY } from "../api/Mutations/category";

export default function CategoryList() {
  const {
    data: getCategories,
    error,
    loading,
    refetch,
  } = useQuery(GET_CATEGORY);

  const [deleteCategories] = useMutation(DELETE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalCategory, setOriginalCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const categories = getCategories?.categories || [];

  // Update `selectAll` state based on the selection
  useEffect(() => {
    setSelectAll(
      selectedCategories.length === categories.length && categories.length > 0
    );
  }, [selectedCategories, categories]);

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

  // Placeholder delete function
  const handleDelete = () => {
    console.log("Deleting categories with IDs:", selectedCategories);

    // Here you would call your delete mutation and refetch the data.
    setSelectedCategories([]); // Reset selection after deletion
    setSelectAll(false);
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

    if (Object.keys(dataToUpdate).length === 0) {
      alert("No changes to update.");
      return;
    }

    try {
      await updateCategory({
        variables: {
          where: { id: categoryId },
          data: dataToUpdate,
        },
      });
      alert("Cập nhật thành công!");
      setOpenModal(false);
      refetch();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategories({
        variables: {
          where: selectedCategories.map((id) => ({ id })), // Convert to expected format
        },
      });

      alert("Xóa thành công!");
      setSelectedCategories([]); // Reset selected categories
      setSelectAll(false); // Reset selectAll state
      refetch();
    } catch (error) {
      console.error("Error deleting categories:", error);
      alert("Đã xảy ra lỗi khi xóa phân loại.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography>Error loading categories: {error.message}</Typography>;
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
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelectedCategories}
          >
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
              <TableCell>Tên phân loại</TableCell>
              <TableCell>Mô tả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(category)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(category.id)}
                    color="primary"
                  />
                </TableCell>
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
                  <TextField
                    label="Tên"
                    name="name"
                    value={selectedCategory.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
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
      </Modal>
    </>
  );
}
