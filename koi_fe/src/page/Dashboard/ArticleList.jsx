import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { GET_ARTICLES } from "../api/Queries/articles";
import UpdateIcon from "@mui/icons-material/Update";

export default function ArticleList() {
  const { data, loading, error } = useQuery(GET_ARTICLES, {
    variables: { take: 10 },
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalArticle, setOriginalArticle] = useState(null);

  const handleRowClick = (article) => {
    setOpenModal(true);
    setSelectedArticle(article);
    setOriginalArticle({ ...article });
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setOpenModal(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalArticle({ ...selectedArticle });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  console.log(data);

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

  const articles = data?.articles || [];

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
        <Typography variant="h4">Danh sách bài viết</Typography>
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
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Đường dẫn</TableCell>
              <TableCell>Hình ảnh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(article)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{article.name || "Không có tiêu đề"}</TableCell>
                <TableCell>
                  {typeof article.content === "string"
                    ? article.content.slice(0, 100) + "..."
                    : "Không có nội dung"}
                </TableCell>
                <TableCell>
                  {article.links ? (
                    <a
                      href={article.links}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "blue" }}
                    >
                      {article.links}
                    </a>
                  ) : (
                    "Không có đường dẫn"
                  )}
                </TableCell>
                <TableCell>
                  {typeof article.image?.publicUrl === "string" ? (
                    <img
                      src={article.image.publicUrl}
                      alt={article.name || "Hình ảnh"}
                      style={{
                        width: "100px",
                        height: "auto",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    "Không có hình ảnh"
                  )}
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
          {selectedArticle && (
            <>
              <Typography
                id="modal-title"
                variant="h4"
                component="h2"
                sx={{ mb: 2 }}
              >
                Chi Tiết bài viết
              </Typography>
              {isEditing ? (
                <>
                  <Box
                    component="img"
                    src={selectedArticle.image?.publicUrl}
                    alt={selectedArticle.name}
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />
                  <TextField
                    label="Tiêu đề"
                    name="name"
                    value={selectedArticle.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Nội dung"
                    name="content"
                    value={selectedArticle.content}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Đường dẫn"
                    name="links"
                    value={selectedArticle.links}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={selectedArticle.image?.publicUrl}
                    alt={selectedArticle.name}
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />
                  <Typography>
                    <strong>Tiêu đề:</strong> {selectedArticle.name}
                  </Typography>
                  <Typography>
                    <strong>Nội dung</strong> {selectedArticle.content}
                  </Typography>
                  <Typography>
                    <strong>Đường dẫn:</strong> {selectedArticle.links}
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
