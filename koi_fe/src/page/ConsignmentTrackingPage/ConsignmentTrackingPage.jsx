import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRACKING_REQUEST } from "../../page/api/Queries/tracking";
import {
  CANCEL_REQUEST,
  ACCEPT_REQUEST,
} from "../../page/api/Mutations/request";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";

const ConsignmentTrackingPage = () => {
  const userId = localStorage.getItem("id");
  const { data, loading, error } = useQuery(GET_TRACKING_REQUEST, {
    variables: { userId },
  });

  const [cancelRequest] = useMutation(CANCEL_REQUEST);
  const [acceptRequest] = useMutation(ACCEPT_REQUEST);

  const [showModal, setShowModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Đã xảy ra lỗi: {error.message}</p>;

  const consignments = data.requests.length
    ? data.requests.map((request) => ({
        id: request.id,
        consignmentId: request.consignment.id,
        name: request.consignment.name,
        date: request.createAt,
        address: "", // địa chỉ người mua hàng
        estimatedValue: request.consignment.estimatedPrice,
        confirmedValue: request.consignment.price || null,
        status: request.status,
        consignmentStatus: request.consignment.status,
        buyer: null,
      }))
    : [];

  const updateStatus = (index, newStatus) => {
    consignments[index].status = newStatus;
  };

  const handleCancel = async (index) => {
    const consignment = consignments[index];
    try {
      await cancelRequest({
        variables: { id: consignment.id, status: "Hủy phê duyệt" },
      });
      updateStatus(index, "Hủy phê duyệt");
      alert("Yêu cầu đã được hủy phê duyệt.");
    } catch (err) {
      console.error("Hủy yêu cầu thất bại:", err);
      alert("Có lỗi xảy ra khi hủy yêu cầu.");
    }
  };

  const handleConfirm = async (index) => {
    const consignment = consignments[index];
    try {
      await acceptRequest({
        variables: {
          id: consignment.id,
          status: "Xác nhận phê duyệt",
          consignmentId: consignment.consignmentId,
          consignmentStatus: "Có sẵn",
        },
      });
      updateStatus(index, "Xác nhận phê duyệt", "Có sẵn");
      alert(
        "Yêu cầu đã được xác nhận phê duyệt và trạng thái cập nhật thành 'Có sẵn'."
      );
    } catch (err) {
      console.error("Xác nhận yêu cầu thất bại:", err);
      alert(`Có lỗi xảy ra khi xác nhận yêu cầu. Chi tiết lỗi: ${err.message}`);
    }
  };

  const handleShowDetails = (consignment) => {
    setSelectedConsignment(consignment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedConsignment(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Theo dõi đơn ký gửi</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Tên cá Koi</th>
            <th>Ngày ký gửi</th>
            <th>Địa chỉ giao dịch</th>
            <th>Giá trị ký gửi</th>
            <th>Tình trạng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {consignments.length > 0 ? (
            consignments.map((consignment, index) => (
              <tr
                key={index}
                onClick={() => handleShowDetails(consignment)}
                style={{ cursor: "pointer" }}
              >
                <td>{consignment.name}</td>
                <td>{new Date(consignment.date).toLocaleDateString()}</td>
                <td>{consignment.address}</td>
                <td>
                  {consignment.confirmedValue ? (
                    <span>{consignment.confirmedValue} VND</span>
                  ) : (
                    <span className="text-muted">
                      {consignment.estimatedValue} VND
                      <br /> (Dự kiến)
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      consignment.status === "Đã hoàn thành"
                        ? "bg-success"
                        : consignment.status === "Hủy phê duyệt"
                        ? "bg-danger"
                        : consignment.status === "Xác nhận phê duyệt"
                        ? "bg-primary"
                        : consignment.status === "Xác nhận giao dịch"
                        ? "bg-info"
                        : consignment.status === "Huỷ giao dịch"
                        ? "bg-secondary"
                        : "bg-warning"
                    }`}
                  >
                    {consignment.status}
                  </span>
                </td>
                <td>
                  {consignment.confirmedValue &&
                  consignment.status === "Chờ phê duyệt" ? (
                    <>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Chấp nhận ký gửi</Tooltip>}
                      >
                        <span
                          style={{ cursor: "pointer", color: "#007bff" }}
                          onClick={() => handleConfirm(index)}
                        >
                          Chấp nhận
                        </span>
                      </OverlayTrigger>
                      <span className="mx-2">|</span>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Hủy yêu cầu</Tooltip>}
                      >
                        <span
                          style={{ cursor: "pointer", color: "#dc3545" }}
                          onClick={() => handleCancel(index)}
                        >
                          Hủy
                        </span>
                      </OverlayTrigger>
                    </>
                  ) : (
                    <span className="text-muted">Không có thao tác</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có đơn ký gửi nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Detailed View */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Đơn Ký Gửi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsignment && (
            <>
              <h5>Thông tin Cá</h5>
              <p>
                <strong>Tên:</strong> {selectedConsignment.name}
              </p>
              <p>
                <strong>Giá trị Dự kiến:</strong>{" "}
                {selectedConsignment.estimatedValue} VND
              </p>
              <p>
                <strong>Giá trị Xác nhận:</strong>{" "}
                {selectedConsignment.confirmedValue || "Chưa xác nhận"} VND
              </p>

              <h5>Thông tin Ký Gửi</h5>
              <p>
                <strong>Ngày gửi:</strong>{" "}
                {new Date(selectedConsignment.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Địa chỉ giao dịch:</strong>{" "}
                {selectedConsignment.address || "Chưa có"}
              </p>
              <p>
                <strong>Tình trạng:</strong> {selectedConsignment.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsignmentTrackingPage;
