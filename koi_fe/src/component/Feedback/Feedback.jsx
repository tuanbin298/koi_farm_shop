import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "./Feedback.css";

const feedbackData = [
  {
    rating: 5,
    name: "Nguyễn Văn A",
    comment: "Dịch vụ rất tốt! Tôi rất hài lòng với cá Koi mua ở đây.",
    date: "01/10/2024",
  },
  {
    rating: 5,
    name: "Trần Thị B",
    comment: "Cá khỏe mạnh, đội ngũ chăm sóc chuyên nghiệp.",
    date: "02/10/2024",
  },
  {
    rating: 5,
    name: "Lê Văn C",
    comment: "Tuyệt vời! Tôi đã có những trải nghiệm thú vị với cá Koi.",
    date: "03/10/2024",
  },
  {
    rating: 3,
    name: "Phạm Minh D",
    comment: "Dịch vụ ổn nhưng có thể cải thiện thời gian giao hàng.",
    date: "04/10/2024",
  },
  {
    rating: 5,
    name: "Vũ Thị E",
    comment: "Rất đáng tiền! Tôi sẽ quay lại lần nữa.",
    date: "05/10/2024",
  },
];

const FeedbackSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbackData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === feedbackData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentFeedback = feedbackData[currentIndex];

  return (
    <Container className="position-relative my-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Khách Hàng Nói Về Chúng Tôi</h2>

      {/* Card hiển thị feedback */}
      <Card className="text-center">
        <Card.Body>
        <div className="d-flex justify-content-center mb-2">
            {[...Array(currentFeedback.rating)].map((_, index) => (
              <FaStar key={index} color="#ffc107" />
            ))}
          </div>
          <Card.Title>{currentFeedback.name}</Card.Title>
          <Card.Text>"{currentFeedback.comment}"</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">{currentFeedback.date}</Card.Footer>
      </Card>

      {/* Nút điều hướng trái */}
      <Button
        variant="light"
        onClick={handlePrev}
        className="feedback-nav-btn left"
      >
        <FaChevronLeft />
      </Button>

      {/* Nút điều hướng phải */}
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
