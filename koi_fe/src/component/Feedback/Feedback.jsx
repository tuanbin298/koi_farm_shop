import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "./Feedback.css";
import { GET_FEEDBACK } from "../../page/api/Queries/feedback";
import { useQuery } from "@apollo/client";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { formatDate, formatTime } from "../../utils/formatDateTime";

const FeedbackSlider = () => {
  const {
    data,
    loading: feedbackLoading,
    error: feedbackError,
  } = useQuery(GET_FEEDBACK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedbackPerPage = 3; // Number of feedback items displayed per page
  const totalFeedbacks = data?.feedbacks.length || 0;

  // Navigation logic with boundary checks
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - feedbackPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + feedbackPerPage, totalFeedbacks - feedbackPerPage)
    );
  };

  if (feedbackLoading) return <p>Đang tải đánh giá...</p>;
  if (feedbackError) return <p>Lỗi tải đánh giá</p>;

  // Check if there are no feedbacks in the database
  if (totalFeedbacks === 0) {
    return (
      <Container className="feedback-slider my-5">
        <h2 className="text-center mb-4">Đánh Giá Dịch Vụ</h2>
        <Card className="feedback-card empty-feedback">
          <Card.Body>
            <Card.Text className="text-center">
              Không có đánh giá nào.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Slice data to show current feedbacks based on the currentIndex
  const currentFeedbacks = data.feedbacks.slice(
    currentIndex,
    currentIndex + feedbackPerPage
  );

  // Calculate how many placeholders are needed to display a full row of 3 feedback cards
  const placeholdersNeeded = feedbackPerPage - currentFeedbacks.length;

  return (
    <Container className="feedback-slider my-5">
      <h2 className="text-center mb-4">Đánh Giá Dịch Vụ</h2>

      <div className="feedback-section">
        {currentFeedbacks.map((feedback, index) => (
          <Card key={index} className="feedback-card">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                {[...Array(feedback.rating)].map((_, idx) => (
                  <FaStar key={idx} color="#ffc107" />
                ))}
              </div>
              <Card.Title>
                <AccountCircleOutlinedIcon />
                Người dùng
              </Card.Title>
              <Card.Text>"{feedback.comment}"</Card.Text>
              <Card.Footer className="text-muted">
                {formatDate(feedback.createdAt.split("T")[0])} |{" "}
                {formatTime(feedback.createdAt)}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))}

        {/* Add placeholder cards if there are fewer than 3 feedbacks on the current page */}
        {Array.from({ length: placeholdersNeeded }).map((_, idx) => (
          <Card
            key={`placeholder-${idx}`}
            className="feedback-card empty-feedback"
          >
            <Card.Body>
              <Card.Text className="text-center">
                Không có đánh giá nào.
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Disable buttons when at the beginning or end of the data */}
      <Button
        variant="light"
        onClick={handlePrev}
        className="feedback-nav-btn left"
        disabled={currentIndex === 0} // Disable if at the first page
      >
        <FaChevronLeft />
      </Button>

      <Button
        variant="light"
        onClick={handleNext}
        className="feedback-nav-btn right"
        disabled={currentIndex + feedbackPerPage >= totalFeedbacks} // Disable if at the last page
      >
        <FaChevronRight />
      </Button>
    </Container>
  );
};

export default FeedbackSlider;
