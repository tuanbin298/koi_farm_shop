import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ConsignmentTrackingPage = ({ userRole }) => {
  // Data cứng với trạng thái và giá trị dự kiến hoặc xác định
  const [consignments, setConsignments] = useState([
    {
      name: "Cá Koi Kohaku",
      date: "2023-10-10T00:00:00.000Z",
      address: "Hà Nội, Việt Nam",
      estimatedValue: "15,000,000",
      confirmedValue: null, // null khi chưa xác nhận
      status: "Đang chờ xác nhận",
      consigner: "consigner123", // ID của người ký gửi
      buyer: null, // null khi chưa có người mua
    },
    {
      name: "Cá Koi Showa",
      date: "2023-09-15T00:00:00.000Z",
      address: "Hồ Chí Minh, Việt Nam",
      estimatedValue: "20,000,000",
      confirmedValue: "20,000,000", // Đã xác nhận
      status: "Đã hoàn thành",
      consigner: "consigner456",
      buyer: "buyer123", // ID của người mua
    },
  ]);

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
    setConsignments(updatedConsignments); // Cập nhật danh sách ký gửi
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
                      {/* Chỉ hiển thị các nút cập nhật trạng thái nếu người dùng là người ký gửi */}
                      {userRole === "consigner" &&
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
                      {userRole === "consigner" &&
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
