import React, { useState } from "react";
import { GET_ORDERS } from "../api/Queries/order";
import { useQuery, useMutation } from "@apollo/client";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Card,
} from "react-bootstrap";
import { formatMoney } from "../../utils/formatMoney";
import "./KoiFishOrdersPage.css";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { CREATE_FEEDBACK } from "../api/Mutations/feedback";
import { UPDATE_ORDER_STATUS } from "../api/Mutations/order";
import toast from "react-hot-toast";

const KoiFishOrdersPage = () => {
  const userId = localStorage.getItem("id");
  const { loading, error, data, refetch } = useQuery(GET_ORDERS, {
    variables: {
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
      },
    },
  });

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState({ comment: "" });
  const [rating, setRating] = useState(0);
  const [createFeedback] = useMutation(CREATE_FEEDBACK);
  const [updateOrder] = useMutation(UPDATE_ORDER_STATUS);

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

  const handleOrderReceived = async (orderId) => {
    try {
      const response = await updateOrder({
        variables: {
          where: { id: orderId },
          data: { status: "Hoàn thành đơn hàng" },
        },
      });

      if (response?.data?.updateOrder) {
        alert("Cập nhật trạng thái thành công!");
        refetch();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
    }
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
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Failed to load orders</Alert>;

  const orders = data.orders;

  const hasCompletedOrder = orders.some(
    (order) => order.status === "Hoàn thành đơn hàng"
  );

  return (
    <div className="order container mt-4">
      <h2>ĐƠN HÀNG CỦA BẠN</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày mua</th>
            <th>Tổng tiền đơn hàng(VNĐ)</th>
            <th>Trạng thái</th>
            <th>Chi tiết đơn</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Không có đơn hàng nào.
              </td>
            </tr>
          ) : (
            orders.map((order, index) => {
              const totalPrice = order.items.reduce((sum, item) => {
                const fishPrice = item.product?.price || 0;
                const consignmentRaisingPrice =
                  item.consignmentRaising?.consignmentPrice || 0;
                const consignmentSalePrice = item.consignmentSale?.price || 0;
                return (
                  sum +
                  fishPrice +
                  consignmentRaisingPrice +
                  consignmentSalePrice
                );
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
            })
          )}
        </tbody>
      </Table>

      {/* Modal for Detailed View */}
      {expandedOrder && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
            {/* Bảng Chi tiết đơn hàng */}
            {expandedOrder.items.some((item) => !item.consignmentSale) && (
              <>
                <h5>Cá Koi Trang Trại</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tên cá</th>
                      <th>Giá (VNĐ)</th>
                      {/* Chỉ hiển thị cột ngày nếu có consignmentRaising */}
                      {expandedOrder.items.some(
                        (item) => item.consignmentRaising
                      ) && (
                        <>
                          <th>Ngày bắt đầu ký gửi nuôi</th>
                          <th>Ngày kết thúc ký gửi nuôi</th>
                          <th>Giá ký gửi nuôi (VNĐ)</th>
                        </>
                      )}
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expandedOrder.items
                      .filter((item) => !item.consignmentSale)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product?.name || "-"}</td>
                          <td>
                            {item.product?.price
                              ? formatMoney(item.product.price)
                              : "-"}
                          </td>
                          {expandedOrder.items.some(
                            (item) => item.consignmentRaising
                          ) ? (
                            <>
                              <td>
                                {item.consignmentRaising?.consignmentDate
                                  ? new Date(
                                      item.consignmentRaising.consignmentDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>
                                {item.consignmentRaising?.returnDate
                                  ? new Date(
                                      item.consignmentRaising.returnDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>
                                {item.consignmentRaising?.consignmentPrice
                                  ? formatMoney(
                                      item.consignmentRaising.consignmentPrice
                                    )
                                  : "-"}
                              </td>
                            </>
                          ) : null}
                          <td>{item.status || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            )}
            {expandedOrder.items.some((item) => item.consignmentSale) && (
              <>
                <h5>Cá Koi Ký Gửi Bán</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tên cá </th>
                      <th>Giá (VNĐ)</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expandedOrder.items
                      .filter((item) => item.consignmentSale)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.consignmentSale.name || "-"}</td>
                          <td>
                            {item.consignmentSale.price
                              ? formatMoney(item.consignmentSale.price)
                              : "-"}
                          </td>
                          <td>{item.status || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                const confirmed = window.confirm(
                  "Bạn có chắc chắn đã nhận được tất cả các con cá trong đơn hàng này chưa?"
                );
                if (confirmed) {
                  handleOrderReceived(expandedOrder.id);
                }
              }}
            >
              Đã nhận đơn hàng
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Feedback Section */}
      {hasCompletedOrder && (
        <Card className="mt-4">
          <Card.Body className="text-center">
            <h3 className="mb-4">Đánh giá của bạn</h3>
            <Form.Group className="mb-4">
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star ${star <= rating ? "star-selected" : ""}`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="feedback" className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={200}
                placeholder="Nhập phản hồi của bạn"
                name="comment"
                value={feedback.comment}
                onChange={handleFeedbackChange}
                style={{ resize: "none", borderRadius: "0.25rem" }}
              />
              <div className="text-muted text-end mt-1">
                {feedback.comment.length} / 200 characters
              </div>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSubmitFeedback}
              className="mt-2 w-100 submit-button"
            >
              <FaPaperPlane style={{ marginRight: "8px" }} />
              Gửi
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default KoiFishOrdersPage;
