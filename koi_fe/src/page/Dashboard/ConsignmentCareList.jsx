import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";

import { Box, Typography, Checkbox, Button, Modal } from "@mui/material";
import { formatMoney } from "../../utils/formatMoney";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import toast, { Toaster } from "react-hot-toast";

import { GET_ALL_FISH_CARE_ADMIN } from "../api/Queries/fishcare";
import { DELETE_CONSIGNMENT_RAISING } from "../api/Mutations/fishcare";

export default function ConsignmentCareList() {
  //Query
  const {
    data: getConsignments,
    error,
    loading,
    refetch,
  } = useQuery(GET_ALL_FISH_CARE_ADMIN);

  //State
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const consignments = getConsignments?.consigmentRaisings || [];

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = consignments.slice(startIndex, endIndex);

  // Handle
  const handlePageChange = (event, value) => setPage(value);

  const handleRowClick = (consignment) => {
    setSelectedConsignment(consignment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedConsignment(null);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", marginTop: 4 }}
      >
        Lỗi tải: {error.message}
      </Typography>
    );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
          Danh sách yêu cầu ký gửi <ListAltIcon />
        </Typography>
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
              <TableCell>Ngày | Giờ ký gửi</TableCell>
              <TableCell>Người ký gửi nuôi</TableCell>
              <TableCell>Cá ký gửi nuôi</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày kết thúc ký gửi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((consignment, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(consignment)}
              >
                <TableCell>
                  {formatDate(consignment.consignmentDate.split("T")[0])}{" "}
                  {" | "} {formatTime(consignment.consignmentDate)}
                </TableCell>
                <TableCell>{consignment.user?.name || "Không rõ"}</TableCell>
                <TableCell>{consignment.product?.name || "Không rõ"}</TableCell>
                <TableCell>
                  {consignment.consignmentPrice
                    ? formatMoney(consignment.consignmentPrice)
                    : "Chưa cập nhật"}
                </TableCell>
                <TableCell>{consignment.status || "Chưa cập nhật"}</TableCell>
                <TableCell>{consignment.description || "Không có"}</TableCell>
                <TableCell>
                  {formatDate(consignment.returnDate.split("T")[0])} {" | "}{" "}
                  {formatTime(consignment.returnDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Nút Đóng */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Button
              variant="text"
              onClick={handleCloseModal}
              sx={{ textTransform: "none", color: "red", fontWeight: "bold" }}
            >
              <CloseIcon />
              Đóng
            </Button>
          </Box>

          {/* Nội dung cuộn */}
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              maxHeight: "70vh", // Chiều cao tối đa
            }}
          >
            {selectedConsignment && (
              <>
                <Typography
                  id="modal-title"
                  variant="h5"
                  component="h2"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Chi Tiết Yêu Cầu Ký Gửi Nuôi
                </Typography>

                {/* Thông Tin Cá */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Thông Tin Cá
                  </Typography>

                  {/* Hiển thị Hình ảnh nếu có */}
                  {selectedConsignment.product?.photo.image?.publicUrl && (
                    <Box
                      component="img"
                      src={selectedConsignment.product.photo.image.publicUrl}
                      alt={selectedConsignment.product.name}
                      sx={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                  )}

                  <Typography>
                    <strong>Tên:</strong>{" "}
                    {selectedConsignment.product?.name || "Không rõ"}
                  </Typography>
                  <Typography>
                    <strong>Loại:</strong>{" "}
                    {selectedConsignment.product?.category?.name ||
                      "Chưa cập nhật"}
                  </Typography>
                  <Typography>
                    <strong>Kích thước:</strong>{" "}
                    {selectedConsignment.product?.size || "Chưa cập nhật"}
                  </Typography>
                  <Typography>
                    <strong>Giới tính:</strong>{" "}
                    {selectedConsignment.product?.sex || "Chưa cập nhật"}
                  </Typography>
                  <Typography>
                    <strong>Mô tả:</strong>{" "}
                    {selectedConsignment.product?.description || "Không có"}
                  </Typography>
                </Box>

                {/* Thông Tin Ký Gửi */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Thông Tin Ký Gửi
                  </Typography>
                  <Typography>
                    <strong>Ngày Ký Gửi:</strong>{" "}
                    {formatDate(
                      selectedConsignment.consignmentDate.split("T")[0]
                    )}{" "}
                    {" | "} {formatTime(selectedConsignment.consignmentDate)}
                  </Typography>
                  <Typography>
                    <strong>Ngày Kết Thúc:</strong>{" "}
                    {formatDate(selectedConsignment.returnDate.split("T")[0])}{" "}
                    {" | "} {formatTime(selectedConsignment.returnDate)}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Giá tiền:</strong>{" "}
                    {formatMoney(selectedConsignment.consignmentPrice)}
                  </Typography>
                </Box>

                {/* Thông Tin Người Yêu Cầu */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Thông Tin Người Yêu Cầu
                  </Typography>
                  <Typography>
                    <strong>Họ Tên:</strong>{" "}
                    {selectedConsignment.user?.name || "Không rõ"}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong>{" "}
                    {selectedConsignment.user?.email || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedConsignment.user?.address || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Số Điện Thoại:</strong>{" "}
                    {selectedConsignment.user?.phone || "Không có"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
