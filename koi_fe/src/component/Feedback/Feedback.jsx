import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";
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
  const feedbackPerPage = 1; // Show only one feedback at a time
  const autoSlideInterval = 5000; // Auto-slide every 5 seconds
  const totalFeedbacks = data?.feedbacks?.length || 0;

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [currentIndex, totalFeedbacks]);

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

  // Ensure we have a valid feedback item
  const currentFeedback = data.feedbacks?.[currentIndex] || {};

  return (
    <Container className="feedback-slider my-5">
      <h2 className="text-center mb-4">Khách Hàng Nói Về Chúng Tôi</h2>

      <Card className="feedback-card">
        <Card.Body>
          <Card.Title className="feedback-title">
            <div className="feedback-user-info">
              <AccountCircleOutlinedIcon />
              <div className="feedback-user-text">
                Khách Hàng {currentFeedback.user?.name || "Ẩn danh"}
              </div>
            </div>
          </Card.Title>
          <div className="d-flex justify-content-center mb-2">
            {/* Ensure feedback rating exists before mapping */}
            {[...Array(currentFeedback.rating || 0)].map((_, idx) => (
              <FaStar key={idx} color="#ffc107" />
            ))}
          </div>
          <Card.Text className="feedback-comment">
            <FaQuoteLeft className="quote-icon" />
            {currentFeedback.comment || "Không có nhận xét nào."}
          </Card.Text>

          <Card.Footer className="text-muted">
            {currentFeedback.createdAt
              ? `${formatDate(
                  currentFeedback.createdAt.split("T")[0]
                )} | ${formatTime(currentFeedback.createdAt)}`
              : "Thời gian không xác định"}
          </Card.Footer>
        </Card.Body>
      </Card>

      <Button
        variant="light"
        onClick={handlePrev}
        className="feedback-nav-btn left"
        disabled={currentIndex === 0}
      >
        <FaChevronLeft />
      </Button>

      <Button
        variant="light"
        onClick={handleNext}
        className="feedback-nav-btn right"
        disabled={currentIndex + feedbackPerPage >= totalFeedbacks}
      >
        <FaChevronRight />
      </Button>
    </Container>
  );
};

export default FeedbackSlider;
