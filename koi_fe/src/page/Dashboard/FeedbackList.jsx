import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Rating,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { GET_FEEDBACK } from "../api/Queries/feedback";
import { formatTime } from "../../utils/formatDateTime";
import UpdateIcon from "@mui/icons-material/Update";
import { DELETE_FEEDBACK } from "../api/Mutations/feedback";

export default function FeedbackList() {
  const {
    data: getFeedbacks,
    error,
    loading,
    refetch,
  } = useQuery(GET_FEEDBACK);
  const [deleteFeedbacks] = useMutation(DELETE_FEEDBACK);

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
    setOriginalFeedback({ ...feedback });
  };

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
      const newSelected = prevSelected.includes(feedbackId)
        ? prevSelected.filter((id) => id !== feedbackId)
        : [...prevSelected, feedbackId];

      // Cập nhật trạng thái `selectAll` dựa trên danh sách mới
      setSelectAll(newSelected.length === feedbacks.length);
      return newSelected;
    });
  };

  // Handle select all toggle
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedFeedbacks([]); // Bỏ chọn tất cả
    } else {
      const allFeedbackIds = feedbacks.map((feedback) => feedback.id);
      setSelectedFeedbacks(allFeedbackIds); // Chọn tất cả
    }
    setSelectAll(!selectAll); // Đảo trạng thái `selectAll`
  };

  // Update selectAll state based on the selection
  useEffect(() => {
    setSelectAll(
      feedbacks.length > 0 && selectedFeedbacks.length === feedbacks.length
    );
  }, [selectedFeedbacks, feedbacks]);

  // Placeholder delete function
  // Inside the component:

  const handleDelete = async () => {
    try {
      await deleteFeedbacks({
        variables: {
          where: selectedFeedbacks.map((id) => ({ id })), // Convert to expected format
        },
      });

      alert("Xóa thành công!");

      // Reset selection and refresh data
      setSelectedFeedbacks([]);
      setSelectAll(false);
      refetch(); // Optional: Refetch the data to update UI
    } catch (error) {
      console.error("Failed to delete feedbacks:", error);
      alert("Đã xảy ra lỗi khi xóa đánh giá.");
    }
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
              <TableRow
                key={feedback.id}
                onClick={() => handleRowClick(feedback)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFeedbacks.includes(feedback.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCheckboxChange(feedback.id)}
                    color="primary"
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
    </Box>
  );
}
