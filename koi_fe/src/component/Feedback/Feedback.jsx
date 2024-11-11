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
  const [animationClass, setAnimationClass] = useState(""); // Trạng thái hiệu ứng
  const feedbackPerPage = 1;
  const autoSlideInterval = 5000;
  const totalFeedbacks = data?.feedbacks?.length || 0;

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [currentIndex, totalFeedbacks]);

  const handlePrev = () => {
    setAnimationClass("slide-out-right"); // Hiệu ứng khi chuyển về trái
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? totalFeedbacks - 1 : prevIndex - 1
      );
      setAnimationClass("slide-in-left"); // Hiệu ứng khi chuyển vào từ trái
    }, 300);
  };

  const handleNext = () => {
    setAnimationClass("slide-out-left"); // Hiệu ứng khi chuyển về phải
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalFeedbacks);
      setAnimationClass("slide-in-right"); // Hiệu ứng khi chuyển vào từ phải
    }, 300);
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

  const currentFeedback = data.feedbacks?.[currentIndex] || {};

  return (
    <Container className="feedback-slider my-5">
      <h2 className="text-center mb-4">Khách Hàng Nói Về Chúng Tôi</h2>
      <Card className={`feedback-card ${animationClass}`}>
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
      >
        <FaChevronLeft />
      </Button>
      <Button
        variant="light"
        onClick={handleNext}
        className="feedback-nav-btn right"
      >
        <FaChevronRight />
      </Button>
    </Container>
  );
};

export default FeedbackSlider;
