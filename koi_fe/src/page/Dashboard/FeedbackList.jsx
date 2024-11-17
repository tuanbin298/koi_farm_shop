import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, Button, Rating } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { GET_FEEDBACK } from "../api/Queries/feedback";

export default function FeedbackList() {
  const { data: getFeedbacks, error, loading } = useQuery(GET_FEEDBACK);

  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Feedbacks default to an empty array if data is not loaded yet
  const feedbacks = getFeedbacks?.feedbacks || [];

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
              <TableRow key={feedback.id}>
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
    </Box>
  );
}
