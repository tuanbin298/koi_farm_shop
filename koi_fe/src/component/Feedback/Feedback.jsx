import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const feedbackData = [
  {
    name: "Nguyen Van A",
    comment: "Dịch vụ rất tốt! Tôi rất hài lòng với cá Koi mua ở đây.",
    date: "01/10/2024",
  },
  {
    name: "Tran Thi B",
    comment: "Cá khỏe mạnh, đội ngũ chăm sóc chuyên nghiệp.",
    date: "02/10/2024",
  },
  {
    name: "Le Van C",
    comment: "Tuyệt vời! Tôi đã có những trải nghiệm thú vị với cá Koi.",
    date: "03/10/2024",
  },
  {
    name: "Pham Minh D",
    comment: "Dịch vụ ổn nhưng có thể cải thiện thời gian giao hàng.",
    date: "04/10/2024",
  },
  {
    name: "Vu Thi E",
    comment: "Rất đáng tiền! Tôi sẽ quay lại lần nữa.",
    date: "05/10/2024",
  },
];

const Feedback = () => {
  return (
    <Container className="my-5"> {/* Margin added for spacing */}
      <h2 className="text-center mb-4">Đánh giá của khách hàng</h2> {/* Centered title with spacing */}
      <Row className="justify-content-center"> {/* Center the row */}
        {feedbackData.map((feedback, index) => (
          <Col md={6} lg={4} key={index} className="mb-4"> {/* Columns responsive and centered */}
            <Card className="h-100"> {/* Full height card to keep uniform */}
              <Card.Body>
                <Card.Title className="text-center">{feedback.name}</Card.Title>
                <Card.Text className="text-center">
                  {feedback.comment}
                </Card.Text>
                <Card.Footer className="text-muted text-center">
                  {feedback.date}
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Feedback;
