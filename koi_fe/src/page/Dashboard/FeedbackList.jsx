import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, Button, Rating,
  CircularProgress,
  Modal,
  TextField
 } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { GET_FEEDBACK } from "../api/Queries/feedback";
import { formatTime } from "../../utils/formatDateTime";
import UpdateIcon from "@mui/icons-material/Update";

export default function FeedbackList() {
  const { data: getFeedbacks, error, loading } = useQuery(GET_FEEDBACK);

  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFeedback, setOriginalFeedback] = useState(null);

  
  // Feedbacks default to an empty array if data is not loaded yet
  const feedbacks = getFeedbacks?.feedbacks || [];

  const handleRowClick = (feedback) => {
    setOpenModal(true);
    setSelectedFeedback(feedback);
    setOriginalFeedback({...feedback});
  }

  const handleCloseModal = () => {
    setSelectedFeedback(null);
    setOpenModal(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalFeedback({ ...selectedFeedback });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  // Handle individual checkbox toggle
  const handleCheckboxChange = (feedbackId) => {
    setSelectedFeedbacks((prevSelected) => {
      if (prevSelected.includes(feedbackId)) {
        return prevSelected.filter((id) => id !== feedbackId);
      } else {
        return [...prevSelected, feedbackId];
      }
    });
  };

  // Handle select all toggle
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedFeedbacks([]);
    } else {
      const allFeedbackIds = feedbacks.map((feedback) => feedback.id);
      setSelectedFeedbacks(allFeedbackIds);
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state based on the selection
  useEffect(() => {
    setSelectAll(
      selectedFeedbacks.length === feedbacks.length && feedbacks.length > 0
    );
  }, [selectedFeedbacks, feedbacks]);

  // Placeholder delete function
  const handleDelete = () => {
    console.log("Deleting feedbacks with IDs:", selectedFeedbacks);

    // Reset selection after deletion
    setSelectedFeedbacks([]);
    setSelectAll(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography>Error loading feedbacks: {error.message}</Typography>;

  return (
    <Box>
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
          Danh sách đánh giá <ListAltIcon />
        </Typography>
        {selectedFeedbacks.length > 0 && (
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
        <Table sx={{ minWidth: 650 }} aria-label="feedback table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedFeedbacks.length > 0 &&
                    selectedFeedbacks.length < feedbacks.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
              <TableCell>Người đánh giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Số ngôi sao</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id}
              onClick={()=>handleRowClick(feedback)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFeedbacks.includes(feedback.id)}
                    onChange={() => handleCheckboxChange(feedback.id)}
                  />
                </TableCell>
                <TableCell>{feedback.user?.name || "Unknown User"}</TableCell>
                <TableCell>
                  {feedback.comment || "No comment provided"}
                </TableCell>
                <TableCell>
                  {new Date(feedback.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Rating value={feedback.rating} readOnly />
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
          {selectedFeedback && (
            <>
              <Typography
                id="modal-title"
                variant="h4"
                component="h2"
                sx={{ mb: 2 }}
              >
                Chi Tiết đánh giá
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    label="Người đánh giá"
                    name="name"
                    value={selectedFeedback.user?.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Đánh giá"
                    name="email"
                    value={selectedFeedback.comment}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Thời gian"
                    name="phone"
                    value={formatTime(selectedFeedback.createdAt)}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Số sao"
                    name="phone"
                    value={selectedFeedback.rating}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                 <Typography>
                    <strong>Người đánh giá:</strong> {selectedFeedback.user?.name}
                  </Typography>
                  <Typography>
                    <strong>Đánh giá:</strong> {selectedFeedback.comment}
                  </Typography>
                  <Typography>
                    <strong>Thời gian:</strong> {formatTime(selectedFeedback.createdAt)}
                  </Typography>
                  <Typography>
                    <strong>Số sao:</strong> <Rating value={selectedFeedback.rating} readOnly />
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
    </Box>
  );
}
