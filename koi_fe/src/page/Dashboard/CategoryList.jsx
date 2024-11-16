import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, Button } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Query to fetch fish categories (replace with your actual GraphQL query)
import { GET_CATEGORY } from "../api/Queries/category";

export default function FishCategoryList() {
  const { data: getCategories, error, loading } = useQuery(GET_CATEGORY);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography>Error loading categories: {error.message}</Typography>;

  const categories = getCategories?.categories || [];

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

  // Update `selectAll` state based on the selection
  useEffect(() => {
    setSelectAll(
      selectedCategories.length === categories.length && categories.length > 0
    );
  }, [selectedCategories, categories]);

  // Placeholder delete function
  const handleDelete = () => {
    console.log("Deleting categories with IDs:", selectedCategories);

    // Here you would call your delete mutation and refetch the data.
    setSelectedCategories([]); // Reset selection after deletion
    setSelectAll(false);
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
            Delete Selected
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
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
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
    </>
  );
}
