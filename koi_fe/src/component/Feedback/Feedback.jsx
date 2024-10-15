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
  {
    rating: 5,
    name: "Vũ Thị H",
    comment: " Tôi sẽ quay lại lần nữa.",
    date: "06/10/2024",
  },
];

const FeedbackSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedbackPerPage = 3; // Số feedback hiển thị trên một trang

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbackData.length - feedbackPerPage : prevIndex - feedbackPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + feedbackPerPage >= feedbackData.length ? 0 : prevIndex + feedbackPerPage
    );
  };

  return (
    <Container className="feedback-slider my-5">
      <h2 className="text-center mb-4">Đánh Giá Dịch Vụ</h2>

      <div className="feedback-section">
        {feedbackData.slice(currentIndex, currentIndex + feedbackPerPage).map((feedback, index) => (
          <Card key={index} className="feedback-card">
            <Card.Body>
              <div className="d-flex justify-content-center mb-2">
                {[...Array(feedback.rating)].map((_, idx) => (
                  <FaStar key={idx} color="#ffc107" />
                ))}
              </div>
              <Card.Title>{feedback.name}</Card.Title>
              <Card.Text>"{feedback.comment}"</Card.Text>
              <Card.Footer className="text-muted">{feedback.date}</Card.Footer>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Button variant="light" onClick={handlePrev} className="feedback-nav-btn left">
        <FaChevronLeft />
      </Button>

      <Button variant="light" onClick={handleNext} className="feedback-nav-btn right">
        <FaChevronRight />
      </Button>
    </Container>
  );
};

export default FeedbackSlider;