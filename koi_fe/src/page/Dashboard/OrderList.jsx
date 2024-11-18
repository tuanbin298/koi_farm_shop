import React, { useState, useEffect } from "react";
import { GET_ALL_ORDERS } from "../api/Queries/order";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, Button } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import { formatMoney } from "../../utils/formatMoney";
import { Modal } from "react-bootstrap"; // Import Modal từ react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; // Đảm bảo cài bootstrap

export default function OrderList() {
  const { data: getOrders, error, loading } = useQuery(GET_ALL_ORDERS);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [expandedOrder, setExpandedOrder] = useState(null); // Đơn hàng được chọn để hiển thị chi tiết
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái modal

  const orders = getOrders?.orders || [];
  console.log(orders);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const allOrderIds = orders.map((order) => order.id);
      setSelectedOrders(allOrderIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowClick = (order) => {
    setExpandedOrder(order); // Gán chi tiết đơn hàng
    setShowModal(true); // Hiển thị modal
  };

  const closeModal = () => {
    setShowModal(false);
    setExpandedOrder(null); // Reset chi tiết đơn hàng khi đóng modal
  };

  const handleDelete = () => {
    console.log("Deleting orders with IDs:", selectedOrders);

    const updatedOrders = orders.filter(
      (order) => !selectedOrders.includes(order.id)
    );
    getOrders.orders = updatedOrders;
    setSelectedOrders([]);
    setSelectAll(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          marginLeft: "15%",
          marginTop: "5%",
        }}
      >
        <Typography variant="h4">
          Danh sách đơn hàng <ListAltIcon />
        </Typography>
        {selectedOrders.length > 0 && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Selected
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          marginLeft: "15%",
          marginTop: "2%",
          width: "85%",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedOrders.length > 0 &&
                    selectedOrders.length < orders.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
              <TableCell>Ngày | Giờ đặt hàng</TableCell>
              <TableCell>Phương thức thanh toán</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Tổng giá</TableCell>
              <TableCell>Địa chỉ giao hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(order)} // Gắn sự kiện click
                style={{ cursor: "pointer" }} // Thêm style cho hàng có thể click
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleCheckboxChange(order.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatDate(order.createAt.split("T")[0])} {" | "}{" "}
                  {formatTime(order.createAt)}
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatMoney(order.price)}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal for Detailed View */}
      {expandedOrder && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <style>
              {`
              table {
                border-collapse: collapse;
                width: 100%;
              }
              table, th, td {
                border: 1px solid #dee2e6;
              }
            `}
            </style>
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
                    {/* Lọc ra các item không có consignmentSale */}
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
                          {/* Chỉ hiển thị ngày nếu có consignmentRaising */}
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
                          <td>
                            {item.consignmentRaising
                              ? item.consignmentRaising.status
                              : item.status || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            )}
            {/* Bảng Cá Ký Gửi Bán - chỉ hiển thị nếu có consignmentSale */}
            {expandedOrder.items.some((item) => item.consignmentSale) && (
              <>
                <h5>Cá Koi Ký Gửi Bán</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tên cá </th>
                      <th>Giá (VNĐ)</th>
                      <th>Trạng Thái </th>
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
        </Modal>
      )}
    </>
  );
}
