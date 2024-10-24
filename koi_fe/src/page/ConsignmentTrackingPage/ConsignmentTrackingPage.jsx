import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuery } from "@apollo/client";
import { GET_TRACKING_REQUEST } from "../../page/api/Queries/tracking"; // Import GraphQL query

const ConsignmentTrackingPage = () => {
  // Sử dụng Apollo Client để fetch data từ GraphQL
  const userId = localStorage.getItem("id");

  const { data, loading, error } = useQuery(GET_TRACKING_REQUEST, {
    variables: { userId },
  });
  console.log(userId);

  // Xử lý khi đang load hoặc có lỗi
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Đã xảy ra lỗi: {error.message}</p>;

  // Kiểm tra nếu không có dữ liệu hoặc không có đơn ký gửi
  const consignments =
    data.requests.length > 0
      ? data.requests.map((request) => ({
          name: request.consignment.name,
          date: request.createAt,
          address: "N/A", // Dữ liệu địa chỉ chưa có trong truy vấn, có thể cần sửa đổi nếu muốn lấy từ nơi khác
          estimatedValue: request.consignment.estimatedPrice,
          confirmedValue: request.consignment.price || null,
          status: request.status,
          buyer: null, // Dữ liệu người mua chưa có trong truy vấn
        }))
      : [];

  // Hàm xử lý thay đổi tình trạng đơn hàng (giả lập)
  const updateStatus = (index, newStatus) => {
    const updatedConsignments = consignments.map((consignment, i) => {
      if (i === index) {
        return {
          ...consignment,
          status: newStatus,
        };
      }
      return consignment;
    });
    // Cần thay thế bằng mutation nếu cập nhật trên server
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
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
              {/* Hiển thị "Không có đơn ký gửi nào" khi không có đơn hàng */}
              {consignments.length > 0 ? (
                consignments.map((consignment, index) => (
                  <tr key={index}>
                    <td>{consignment.name}</td>
                    <td>{new Date(consignment.date).toLocaleDateString()}</td>
                    <td>{consignment.address}</td>
                    <td>
                      {consignment.confirmedValue ? (
                        <span>{consignment.confirmedValue} VND</span>
                      ) : (
                        <span className="text-muted">
                          {consignment.estimatedValue} VND (Dự kiến)
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          consignment.status === "Đã hoàn thành"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {consignment.status}
                      </span>
                    </td>
                    <td>
                      {/* Hiển thị nút cập nhật trạng thái khi đơn hàng đã có người mua */}
                      {consignment.buyer &&
                        consignment.status === "Đang chờ xác nhận" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              updateStatus(index, "Đang giao hàng")
                            }
                          >
                            Xác nhận đơn hàng
                          </button>
                        )}
                      {consignment.buyer &&
                        consignment.status === "Đang giao hàng" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateStatus(index, "Đã hoàn thành")}
                          >
                            Hoàn thành đơn hàng
                          </button>
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
        </div>
      </div>
    </div>
  );
};

export default ConsignmentTrackingPage;
