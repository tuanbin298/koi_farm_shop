import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";

import { MUTATION_CATEGORY } from "../../api/Mutations/category";
import { GET_CATEGORY } from "../../api/Queries/category";

export default function CreateCategoryForm({ setSelectedSection }) {
  // Query
  const { data, refetch: refetchCategory } = useQuery(GET_CATEGORY);

  // Mutation
  const [category] = useMutation(MUTATION_CATEGORY);

  // State
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  // Handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await category({
        variables: {
          data: {
            name: categoryData.name,
            description: categoryData.description,
          },
        },
      });

      await refetchCategory();
      toast.success("Thêm loại thành công");
      setTimeout(() => {
        setSelectedSection("category");
      }, 1000);
    } catch (err) {
      toast.error("Lỗi tạo loại!");
      console.error("Đã xảy ra lỗi khi tạo loại:", err);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Box sx={{ display: "flex", marginLeft: "15%" }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, padding: 5, marginRight: "10%" }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Thêm Phân Loại
          </Typography>

          <Paper elevation={3} sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              {/* Tên Phân Loại */}
              <TextField
                fullWidth
                label="Tên Phân Loại"
                variant="outlined"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* Mô Tả */}
              <TextField
                fullWidth
                label="Mô Tả"
                variant="outlined"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#4287f5",
                }}
              >
                Thêm Phân Loại
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
