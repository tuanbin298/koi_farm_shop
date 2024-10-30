import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./KoiFishOrdersPage.css";
import { CREATE_FEEDBACK } from "../api/Mutations/feedback";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";

const KoiFishOrdersPage = () => {
  const orders = [
    {
      id: 1,
      name: "Cá Koi Nhật",
      purchaseDate: "29/10/2024",
      depositDate: "01/11/2024",
      price: 2000000,
      depositPrice: 500000,
      status: "Đang nuôi ký gửi",
    },
    {
      id: 2,
      name: "Cá Betta Fancy",
      purchaseDate: "28/10/2024",
      depositDate: "30/10/2024",
      price: 500000,
      depositPrice: 100000,
      status: "Đã hoàn thành",
    },
    {
      id: 3,
      name: "Cá Rồng Đỏ",
      purchaseDate: "27/10/2024",
      depositDate: "05/11/2024",
      price: 10000000,
      depositPrice: 2000000,
      status: "Đang nuôi ký gửi",
    },
  ];

  const userId = localStorage.getItem("id");

  const [feedback, setFeedback] = useState({
    comment: "",
  });
  const [rating, setRating] = useState(0);

  const handleFeedbackChange = (e) => {
    setFeedback({ ...feedback, comment: e.target.value });
  };

  const handleRatingChange = (star) => {
    setRating(star);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (feedback.comment.trim() === "") {
      toast.error("Form đánh giá không được rỗng");
      return;
    }

    if (rating == 0) {
      toast.error("Hãy chọn số ngôi sao để đánh giá");
      return;
    }

    try {
      await createFeedback({
        variables: {
          data: {
            comment: feedback.comment,
            user: {
              connect: { id: userId },
            },
            rating: rating,
          },
        },
      });

      toast.success("Gửi đánh giá thành công");
      setFeedback({ comment: "" });
      setRating(0);
    } catch (err) {
      toast.error(`Lỗi khi đánh giá: ${err.message}`);
    }

    console.log("Customer feedback:", feedback);
  };

  const [createFeedback] = useMutation(CREATE_FEEDBACK);

  return (
    <div className="container mt-4">
      <h2>ĐƠN HÀNG CỦA BẠN</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên cá Koi</th>
            <th>
              Ngày mua
              <br />
              Ngày bắt đầu nuôi
            </th>
            <th>Ngày kết thúc</th>
            <th>Giá (VNĐ)</th>
            <th>Giá ký gửi nuôi (VNĐ)</th>
            <th>Trạng thái đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.name}</td>
              <td>{order.purchaseDate}</td>
              <td>{order.depositDate}</td>
              <td>{order.price.toLocaleString()}</td>
              <td>{order.depositPrice.toLocaleString()}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-4 text-center">
        <h3>Đánh giá của bạn</h3>

        <Form.Group>
          <div className="d-flex justify-content-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="star"
                color={star <= rating ? "#FFD700" : "#E0E0E0"}
                onClick={() => handleRatingChange(star)}
                style={{ cursor: "pointer", fontSize: "24px", margin: "2px" }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group controlId="feedback">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nhập phản hồi của bạn"
            name="comment"
            value={feedback.comment}
            onChange={handleFeedbackChange}
            style={{ resize: "none" }}
          />
          <Button
            variant="primary"
            onClick={handleSubmitFeedback}
            className="mt-2"
          >
            Gửi
          </Button>
        </Form.Group>
      </div>
    </div>
  );
};

export default KoiFishOrdersPage;
