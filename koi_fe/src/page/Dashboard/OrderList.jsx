import React, { useState, useEffect } from "react";
import { GET_ALL_ORDERS } from "../api/Queries/order";
import { UPDATE_ORDER_ITEM_ADMIN } from "../api/Mutations/orderItem";
import { useQuery, useMutation } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import { formatMoney } from "../../utils/formatMoney";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OrderList() {
  const { data: getOrders, error, loading, refetch } = useQuery(GET_ALL_ORDERS);
  const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM_ADMIN);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalOrder, setOriginalOrder] = useState(null);

  const orders = getOrders?.orders || [];
  console.log(orders)
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
    setExpandedOrder(order);
    setShowModal(true);
    setOriginalOrder({ ...order });
  };

  const closeModal = () => {
    setIsEditing(false);
    setShowModal(false);
    setExpandedOrder(null);
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

  const handleSaveChange = async (item) => {
    console.log(item)
    try {
      const { id, status } = item;
      await updateOrderItem({
        variables: {
          data: {
            where: { id: id },
            data: { status: status },
          },
        },
      });
      alert("Cập nhật thành công!");
    } catch (error) {
      console.log(error)
      alert("Cập nhật thất bại!");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Bật chế độ chỉnh sửa
  };

  const handleInputChange = (field, value, item) => {
    setExpandedOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, [field]: value }
          : currentItem
      );
      return { ...prevOrder, items: updatedItems };
    });
  };

  const handleUpdateOrder = async () => {
    try {
      const dataToUpdate = expandedOrder.items.map((item) => ({
        id: item.id,
        status: item.status,
      }));

      await updateOrderItem({
        variables: {
          data: dataToUpdate,
        },
      });

      alert("Cập nhật tất cả trạng thái thành công!");
      closeModal();
    } catch (error) {
      console.error("Error updating order items:", error);
      alert("Đã xảy ra lỗi khi cập nhật đơn hàng.");
    }
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
        <Modal
          show={showModal}
          onHide={closeModal}
          size="xl"
          style={{
            marginTop: "100px",
            marginLeft: "8%",
            maxWidth: "95%",
          }}
        >
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
                th, td {
                  padding: 12px;
                  text-align: left;
                }
                th {
                  background-color: #f8f9fa;
                }
                `}
            </style>

            <Box style={{ marginBottom: "20px" }}>
              {/* Hiển thị Cá Koi Trang Trại */}
              {expandedOrder.items?.filter(
                (item) => !item.consignmentSale && !item.consignmentRaising
              ).length > 0 && (
                <>
                  <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Cá Koi Trang Trại
                  </Typography>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Tên cá</th>
                        <th>Giá (VNĐ)</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedOrder.items
                        .filter(
                          (item) =>
                            !item.consignmentSale && !item.consignmentRaising
                        )
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.product?.name || "-"}</td>
                            <td>
                              {item.product?.price
                                ? formatMoney(item.product.price)
                                : "-"}
                            </td>
                            <td>
                              {isEditing ? (
                                // Khi đang chỉnh sửa, hiển thị dropdown
                                <>
                                  <FormControl fullWidth>
                                    <InputLabel id={`status-label-${item.id}`}>
                                      Trạng thái
                                    </InputLabel>
                                    <Select
                                      labelId={`status-label-${item.id}`}
                                      value={item.status || ""}
                                      label="Trạng thái"
                                      onChange={(e) =>
                                        handleInputChange(
                                          "status",
                                          e.target.value,
                                          item
                                        )
                                      }
                                    >
                                      <MenuItem value="Đang xử lý">
                                        Đang xử lý
                                      </MenuItem>
                                      <MenuItem value="Đang giao hàng">
                                        Đang giao hàng
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </>
                              ) : (
                                // Nếu không phải đang chỉnh sửa, hiển thị trạng thái đơn giản
                                <>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {" "}
                                    {item.status || "Không rõ"}
                                  </Typography>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Box>

            <Box>
              {/* Hiển thị Cá Ký Gửi Bán */}
              {expandedOrder.items?.filter((item) => item.consignmentSale)
                .length > 0 && (
                <>
                  <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Cá Koi Ký Gửi Bán
                  </Typography>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Tên cá</th>
                        <th>Giá (VNĐ)</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedOrder.items
                        .filter((item) => item.consignmentSale)
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.consignmentSale?.name || "-"}</td>
                            <td>
                              {item.consignmentSale?.price
                                ? formatMoney(item.consignmentSale.price)
                                : "-"}
                            </td>
                            <td>
                              {isEditing ? (
                                // Khi đang chỉnh sửa, hiển thị dropdown
                                <>
                                  <FormControl fullWidth>
                                    <InputLabel id={`status-label-${item.id}`}>
                                      Trạng thái
                                    </InputLabel>
                                    <Select
                                      labelId={`status-label-${item.id}`}
                                      value={item.status || ""}
                                      label="Trạng thái"
                                      onChange={(e) =>
                                        handleInputChange(
                                          "status",
                                          e.target.value,
                                          item
                                        )
                                      }
                                    >
                                      <MenuItem value="Đang xử lý">
                                        Đang xử lý
                                      </MenuItem>
                                      <MenuItem value="Đang giao hàng">
                                        Đang giao hàng
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </>
                              ) : (
                                // Nếu không phải đang chỉnh sửa, hiển thị trạng thái đơn giản
                                <>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {" "}
                                    {item.status || "Không rõ"}
                                  </Typography>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Box>

            <Box style={{ marginBottom: "20px" }}>
              {/* Hiển thị Cá Ký Gửi Nuôi */}
              {expandedOrder.items?.filter((item) => item.consignmentRaising)
                .length > 0 && (
                <>
                  <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Cá Koi Ký Gửi Nuôi
                  </Typography>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Tên cá</th>
                        <th>Giá (VNĐ)</th>
                        <th>Ngày bắt đầu ký gửi</th>
                        <th>Ngày kết thúc ký gửi</th>
                        <th>Giá ký gửi nuôi (VNĐ)</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedOrder.items
                        .filter((item) => item.consignmentRaising)
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              {item.consignmentRaising.product?.name || "-"}
                            </td>
                            <td>
                              {item.product?.price
                                ? formatMoney(item.product.price)
                                : "-"}
                            </td>
                            <td>
                              {item.consignmentRaising.consignmentDate
                                ? new Date(
                                    item.consignmentRaising.consignmentDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              {item.consignmentRaising.returnDate
                                ? new Date(
                                    item.consignmentRaising.returnDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              {item.consignmentRaising.consignmentPrice
                                ? formatMoney(
                                    item.consignmentRaising.consignmentPrice
                                  )
                                : "-"}
                            </td>
                            <td>
                              {isEditing ? (
                                // Khi đang chỉnh sửa, hiển thị dropdown
                                <>
                                  <FormControl fullWidth>
                                    <InputLabel id={`status-label-${item.id}`}>
                                      Trạng thái
                                    </InputLabel>
                                    <Select
                                      labelId={`status-label-${item.id}`}
                                      value={item.status || ""}
                                      label="Trạng thái"
                                      onChange={(e) =>
                                        handleInputChange(
                                          "status",
                                          e.target.value,
                                          item
                                        )
                                      }
                                    >
                                      <MenuItem value="Đang xử lý">
                                        Đang xử lý
                                      </MenuItem>
                                      <MenuItem value="Đang chăm sóc">
                                        Đang chăm sóc
                                      </MenuItem>
                                      <MenuItem value="Kết thúc ký gửi">
                                        Kết thúc ký gửi
                                      </MenuItem>
                                      <MenuItem value="Đang giao hàng">
                                        Đang giao hàng
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </>
                              ) : (
                                // Nếu không phải đang chỉnh sửa, hiển thị trạng thái đơn giản
                                <>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {" "}
                                    {item.status || "Không rõ"}
                                  </Typography>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
                borderTop: "1px solid #ddd",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (isEditing) {
                    // Nếu đang ở chế độ chỉnh sửa, bấm Lưu
                    expandedOrder.items.forEach((item) =>
                      handleSaveChange(item)
                    );
                  }
                  // Chuyển chế độ từ chỉnh sửa sang xem hoặc ngược lại
                  setIsEditing(!isEditing);
                }}
                style={{ marginTop: "20px" }}
              >
                {console.log(expandedOrder.items)}
                <UpdateIcon />
                {isEditing ? "Lưu" : "Cập nhật"}
              </Button>
            </Box>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
