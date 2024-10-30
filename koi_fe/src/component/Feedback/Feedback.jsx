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
    data: data,
    loading: feedbackLoading,
    error: feedbackError,
  } = useQuery(GET_FEEDBACK, {});
  console.log(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const feedbackPerPage = 3; // Số feedback hiển thị trên một trang

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, (data.feedbacks.length || 0) - feedbackPerPage)
        : prevIndex - feedbackPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + feedbackPerPage >= (data.feedbacks.length || 0)
        ? 0
        : prevIndex + feedbackPerPage
    );
  };

  if (feedbackLoading) return <p>Đang tải đánh giá...</p>;
  if (feedbackError) return <p>Lỗi tải đánh giá</p>;

  return (
    <Container className="feedback-slider my-5">
      <h2 className="text-center mb-4">Đánh Giá Dịch Vụ</h2>

      <div className="feedback-section">
        {data.feedbacks
          .slice(currentIndex, currentIndex + feedbackPerPage)
          .map((feedback, index) => (
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
                  {formatDate(feedback.createdAt.split("T")[0])}
                  {" | "}
                  {formatTime(feedback.createdAt)}
                </Card.Footer>
              </Card.Body>
            </Card>
          ))}
      </div>

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
