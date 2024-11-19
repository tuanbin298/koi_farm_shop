import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, 
  Button,
  Modal,
  TextField
 } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import UpdateIcon from "@mui/icons-material/Update";

// Query to fetch fish categories (replace with your actual GraphQL query)
import { GET_CATEGORY } from "../api/Queries/category";

export default function FishCategoryList() {
  const { data: getCategories, error, loading } = useQuery(GET_CATEGORY);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalCategory, setOriginalCategory] = useState(null);

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography>Error loading categories: {error.message}</Typography>;

  const categories = getCategories?.categories || [];
// Update `selectAll` state based on the selection
useEffect(() => {
  setSelectAll(
    selectedCategories.length === categories.length && categories.length > 0
  );
}, [selectedCategories, categories]);
  // Handle individual checkbox toggle
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  // Handle select all toggle
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
    setSelectedCategory(category)
    setOriginalCategory({...category})
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setSelectedCategory(null)
    setOpenModal(false)
    setIsEditing(false);
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalCategory({ ...selectedCategory });
    } 
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };
  return (
    <>
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
                onClick={()=>handleRowClick(category)}
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
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Mô tả"
                    name="description"
                    value={selectedCategory.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2,
                      
                     }}
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
                <Button variant="contained" onClick={handleEditToggle}>
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
