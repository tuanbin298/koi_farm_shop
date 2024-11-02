import React, { useState } from 'react';
import { GET_ORDERS } from '../api/Queries/order';
import { gql, useQuery } from '@apollo/client';
import { Table, Collapse, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { formatMoney } from '../../utils/formatMoney';
import "./KoiFishOrdersPage.css";
import { FaStar } from "react-icons/fa";
import { CREATE_FEEDBACK } from "../api/Mutations/feedback";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";

const KoiFishOrdersPage = () => {
  
  const { loading, error, data } = useQuery(GET_ORDERS, {
    variables: { where: {} }, // Adjust filters as needed
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState({ comment: "" });
  const [rating, setRating] = useState(0);
  const [createFeedback] = useMutation(CREATE_FEEDBACK);

  const toggleDetails = (order) => {
    setExpandedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setExpandedOrder(null);
  };

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
  
  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Failed to load orders</Alert>;

  const orders = data.orders;

  return (
    <div className="container mt-4">
      <h2>ĐƠN HÀNG CỦA BẠN</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày mua</th>
            <th>Giá (VNĐ)</th>
            <th>Trạng thái đơn hàng</th>
            <th>Chi tiết đơn</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const totalPrice = order.items.reduce((sum, item) => {
              const fishPrice = item.product.price || 0;
              const consignmentPrice = item.consignmentRaising?.consignmentPrice || 0;
              return sum + fishPrice + consignmentPrice;
            }, 0);

            return (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{new Date(order.createAt).toLocaleDateString()}</td>
                <td>{formatMoney(totalPrice)}</td>
                <td>{order.status}</td>
                <td>
                  <Button variant="link" onClick={() => toggleDetails(order)}>
                    Xem chi tiết
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Detailed View */}
      {expandedOrder && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên cá</th>
                  <th>Giá cá (VNĐ)</th>
                  <th>Ngày bắt đầu ký gửi</th>
                  <th>Ngày kết thúc ký gửi</th>
                  <th>Giá ký gửi (VNĐ)</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {expandedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.product.name || '-'}</td>
                    <td>{item.product.price ? formatMoney(item.product.price) : '-'}</td>
                    <td>
                      {item.consignmentRaising?.consignmentDate
                        ? new Date(item.consignmentRaising.consignmentDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      {item.consignmentRaising?.returnDate
                        ? new Date(item.consignmentRaising.returnDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      {item.consignmentRaising?.consignmentPrice
                        ? formatMoney(item.consignmentRaising.consignmentPrice)
                        : '-'}
                    </td>
                    <td>{item.consignmentRaising?.status || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Feedback Section Outside of Modal */}
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
