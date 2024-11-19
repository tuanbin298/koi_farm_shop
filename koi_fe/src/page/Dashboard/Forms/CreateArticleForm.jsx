22:41 T2
Nguyễn
Tuấn Nguyễn
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { MUTATION_ARTICLE } from "../../api/Mutations/article";
import { useMutation } from "@apollo/client";

const CreateArticleForm = ({ onSubmit }) => {
  const [article] = useMutation(MUTATION_ARTICLE);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    links: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await article({
        variables: {
          name: formData.name,
          content: formData.content,
          links: formData.links,
          image: formData.image,
        },
      });
    } catch (err) {
      console.log(err);
    }
    alert("Tạo tin tức thành công");

    // setFormData({ name: "", content: "", links: "", image: "" });
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
            {/* Name */}
            <TextField
              fullWidth
              label="Tiêu đề"
              variant="outlined"
              name="name"
              value={formData.name}
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

            {/* Links */}
            <TextField
              fullWidth
              label="Đường dẫn"
              variant="outlined"
              name="links"
              value={formData.links}
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