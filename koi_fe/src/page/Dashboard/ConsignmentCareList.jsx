import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box, Typography, Checkbox, Button, Modal } from "@mui/material";
import { GET_ALL_FISH_CARE_ADMIN } from "../api/Queries/fishcare";
import { formatMoney } from "../../utils/formatMoney";
import { formatDate, formatTime } from "../../utils/formatDateTime";

export default function ConsignmentCareList() {
  const { data, error, loading } = useQuery(GET_ALL_FISH_CARE_ADMIN);
  const [selectedConsignments, setSelectedConsignments] = useState([]);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const consignments = data?.consigmentRaisings || [];

  const handleCheckboxChange = (consignmentId) => {
    setSelectedConsignments((prevSelected) =>
      prevSelected.includes(consignmentId)
        ? prevSelected.filter((id) => id !== consignmentId)
        : [...prevSelected, consignmentId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedConsignments.length === consignments.length) {
      setSelectedConsignments([]); // Bỏ chọn tất cả
    } else {
      setSelectedConsignments(consignments.map((c) => c.id)); // Chọn tất cả
    }
  };

  const handleRowClick = (consignment) => {
    setSelectedConsignment(consignment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedConsignment(null);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading consignments</Typography>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">
          Danh sách yêu cầu ký gửi <ListAltIcon />
        </Typography>
        {selectedConsignments.length > 0 && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Selected
          </Button>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedConsignments.length === consignments.length}
                  indeterminate={
                    selectedConsignments.length > 0 &&
                    selectedConsignments.length < consignments.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
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
            {consignments.map((consignment, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(consignment)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedConsignments.includes(consignment.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(consignment.id);
                    }}
                    color="primary"
                  />
                </TableCell>
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

      {/* Modal */}
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
            p: 4,
            borderRadius: 2,
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

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông Tin Cá
                </Typography>
                {selectedConsignment.product?.image?.publicUrl && (
                  <Box
                    component="img"
                    src={selectedConsignment.product.image.publicUrl}
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông Tin Ký Gửi
                </Typography>
                <Typography>
                  <strong>Ngày | Giờ Ký Gửi:</strong>{" "}
                  {formatDate(
                    selectedConsignment.consignmentDate.split("T")[0]
                  )}{" "}
                  {" | "} {formatTime(selectedConsignment.consignmentDate)}
                </Typography>
                <Typography>
                  <strong>Ngày | Giờ Kết Thúc:</strong>{" "}
                  {formatDate(selectedConsignment.returnDate.split("T")[0])}{" "}
                  {" | "} {formatTime(selectedConsignment.returnDate)}
                </Typography>
                <Typography>
                  <strong>Giá Tiền:</strong>{" "}
                  {selectedConsignment.consignmentPrice
                    ? `${formatMoney(selectedConsignment.consignmentPrice)}`
                    : "Chưa cập nhật"}
                </Typography>
                <Typography>
                  <strong>Trạng Thái:</strong>{" "}
                  {selectedConsignment.status || "Chưa cập nhật"}
                </Typography>
              </Box>
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
      </Modal>
    </>
  );
}
