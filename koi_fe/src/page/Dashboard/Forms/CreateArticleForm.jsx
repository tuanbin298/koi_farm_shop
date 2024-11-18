import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const CreateArticleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageURL,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ title: "", content: "", link: "", image: "" });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
      <Box
        component="main"
        sx={{ width: "70%", padding: 3, marginLeft: "20%" }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Thêm bài viết mới
        </Typography>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <TextField
              fullWidth
              label="Tiêu đề"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Content */}
            <TextField
              fullWidth
              label="Nội dung"
              variant="outlined"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              required
            />

            {/* Link */}
            <TextField
              fullWidth
              label="Đường dẫn"
              variant="outlined"
              name="link"
              value={formData.link}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            {/* Image Upload */}
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              Upload Hình Ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {/* Preview Image */}
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
              />
            )}

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
              Thêm bài viết
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateArticleForm;
