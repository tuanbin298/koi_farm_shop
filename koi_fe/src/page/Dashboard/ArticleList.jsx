import React, { useState, useEffect } from "react";
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
  Checkbox,
  Pagination,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";

import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_ARTICLES } from "../api/Queries/articles";
import { UPDATE_ARTICLE, DELETE_ARTICLE } from "../api/Mutations/article";

export default function ArticleList() {
  // Query
  const { data, loading, error, refetch } = useQuery(GET_ALL_ARTICLES);

  const articles = data?.articles || [];

  // Mutation
  const [deleteArcicles] = useMutation(DELETE_ARTICLE);
  const [updateArticle] = useMutation(UPDATE_ARTICLE);

  // State
  const [selectAll, setSelectAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);

  useEffect(() => {
    setSelectAll(
      selectedArticles.length === articles.length && articles.length > 0
    );
  }, [selectedArticles, articles]);

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = articles.slice(startIndex, endIndex) || [];

  // Handle
  const handlePageChange = (event, value) => setPage(value);

  const handleCheckboxChange = (articleId) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

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

  // When check all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedArticles([]);
    } else {
      const allArticleIds = articles.map((article) => article.id);
      setSelectedArticles(allArticleIds);
    }
    setSelectAll(!selectAll);
  };
  const handleSaveChange = () => {
    if (!isEditing) {
      setOriginalArticle({ ...selectedArticle });
    } else {
      saveChanges();
    }

    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    const dataToUpdate = {};
    if (selectedArticle.name !== originalArticle.name) {
      dataToUpdate.name = selectedArticle.name;
    }
    if (selectedArticle.content !== originalArticle.content) {
      dataToUpdate.content = selectedArticle.content;
    }
    if (selectedArticle.links !== originalArticle.links) {
      dataToUpdate.links = selectedArticle.links;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      try {
        await updateArticle({
          variables: {
            where: { id: selectedArticle.id },
            data: dataToUpdate,
          },
        });

        await refetch();
        toast.success("Bài viết đã được cập nhật thành công");
        handleCloseModal();
      } catch (err) {
        Toaster.error("Lỗi cập nhật bài viết!");
        console.error("Đã xảy ra lỗi khi cập nhật bài viết :", err);
      }
    } else {
      toast("Không có gì thay đổi");
      handleCloseModal();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await deleteArcicles({
        variables: {
          where: selectedArticles.map((id) => ({ id })),
        },
      });

      await refetch();
      toast.success("Xóa thành công!");
      setSelectedArticles([]);
      setSelectAll(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa tin tức!");
      console.error("Đã xảy ra lỗi khi xóa tin tức:", error);
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
        Lỗi tải bài viết: {error.message}
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
          Danh sách bài viết <ListAltIcon />
        </Typography>
        {selectedArticles.length > 0 && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xoá Đã Chọn
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
                    selectedArticles.length > 0 &&
                    selectedArticles.length < articles.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Đường dẫn</TableCell>
              <TableCell>Hình ảnh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((article) => (
              <TableRow
                key={article.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(article)}
                style={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedArticles.includes(article.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(article.id)}
                    color="primary"
                  />
                </TableCell>
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

        <Box
          display="flex"
          justifyContent="center"
          marginTop={2}
          sx={{
            marginBottom: "2%",
          }}
        >
          <Pagination
            count={Math.ceil(articles.length / itemsPerPage)}
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
              variant="text"
              onClick={handleCloseModal}
              sx={{ textTransform: "none", color: "red" }}
            >
              <CloseIcon />
              Đóng
            </Button>
          </Box>

          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              maxHeight: "70vh",
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
                  Chi Tiết Bài Viết
                </Typography>
                {isEditing ? (
                  <>
                    {/* Image */}
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

                    {/* Name */}
                    <TextField
                      label="Tiêu đề"
                      name="name"
                      value={selectedArticle.name}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Content */}
                    <TextField
                      label="Nội dung"
                      name="content"
                      value={selectedArticle.content}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    {/* Links */}
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
