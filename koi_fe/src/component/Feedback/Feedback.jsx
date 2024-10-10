import React from "react";
import { FaStar } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import "./Feedback.css"; // Optional: for custom styling

const feedbackData = [
  {
    name: "Nguyen Van A",
    rating: 5,
    comment: "Dịch vụ rất tốt! Tôi rất hài lòng với cá Koi mua ở đây.",
    date: "01/10/2024", // Add date for each feedback
  },
  {
    name: "Tran Thi B",
    rating: 4,
    comment: "Cá khỏe mạnh, đội ngũ chăm sóc chuyên nghiệp.",
    date: "02/10/2024",
  },
  {
    name: "Le Van C",
    rating: 5,
    comment: "Tuyệt vời! Tôi đã có những trải nghiệm thú vị với cá Koi.",
    date: "03/10/2024",
  },
  {
    name: "Pham Minh D",
    rating: 3,
    comment: "Dịch vụ ổn nhưng có thể cải thiện thời gian giao hàng.",
    date: "04/10/2024",
  },
  {
    name: "Vu Thi E",
    rating: 5,
    comment: "Rất đáng tiền! Tôi sẽ quay lại lần nữa.",
    date: "05/10/2024",
  },
];

const Feedback = () => {
  return (
    <Container className="feedback-section">
      <h2>Đánh giá của khách hàng</h2>
      <Row>
        {feedbackData.map((feedback, index) => (
          <Col md={4} key={index} className="feedback-card">
            <div className="feedback-content">
              {/* Display 5-star rating */}
              <div className="star-rating">
                {[...Array(5)].map((star, i) => (
                  <FaStar key={i} className={i < feedback.rating ? "star filled" : "star"} />
                ))}
              </div>
              <h5>{feedback.name}</h5>
              <p>{feedback.comment}</p>
              <small>{feedback.date}</small> {/* Display the date of the feedback */}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Feedback;
