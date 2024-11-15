import React, { useState, useEffect } from "react";
import { GET_ALL_CONSIGNMENT_SALES_ADMIN } from "../api/Queries/consignment";
import { useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Checkbox, Button, Modal } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { formatMoney } from "../../utils/formatMoney";

export default function ConsignmentList() {
  const {
    data: getConsignments,
    error,
    loading,
  } = useQuery(GET_ALL_CONSIGNMENT_SALES_ADMIN);
  const [selectedConsignments, setSelectedConsignments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const consignments = getConsignments?.consignmentSales || [];

  const handleCheckboxChange = (consignmentId) => {
    setSelectedConsignments((prevSelected) => {
      if (prevSelected.includes(consignmentId)) {
        return prevSelected.filter((id) => id !== consignmentId);
      } else {
        return [...prevSelected, consignmentId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedConsignments([]);
    } else {
      const allConsignmentIds = consignments.map(
        (consignment) => consignment.id
      );
      setSelectedConsignments(allConsignmentIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(
      selectedConsignments.length === consignments.length &&
        consignments.length > 0
    );
  }, [selectedConsignments, consignments]);

  const handleDelete = () => {
    console.log("Deleting consignments with IDs:", selectedConsignments);
    const updatedConsignments = consignments.filter(
      (consignment) => !selectedConsignments.includes(consignment.id)
    );
    getConsignments.consignmentSales = updatedConsignments;
    setSelectedConsignments([]);
    setSelectAll(false);
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
          marginLeft: "15%",
          marginTop: "5%",
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
                    selectedConsignments.length > 0 &&
                    selectedConsignments.length < consignments.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
              <TableCell>Ngày ký gửi</TableCell>
              <TableCell>Tên cá ký gửi</TableCell>
              <TableCell>Người gửi</TableCell>
              <TableCell>Nhân viên xử lý</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consignments.map((consignment) => (
              <TableRow
                key={consignment.id}
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
                <TableCell component="th" scope="row">
                  {consignment.request?.createAt}
                </TableCell>
                <TableCell>{consignment.name}</TableCell>
                <TableCell>
                  {consignment.request?.user?.name || "Không rõ"}
                </TableCell>
                <TableCell>
                  {consignment.request?.staff?.name || "Chưa xử lý"}
                </TableCell>
                <TableCell>{consignment.request?.description}</TableCell>
                <TableCell>{consignment.request?.status}</TableCell>
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
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Chi tiết Cá Koi
          </Typography>
          {selectedConsignment && (
            <Box>
              {/* Hình ảnh */}
              {selectedConsignment.photo?.image?.publicUrl && (
                <Box
                  component="img"
                  src={selectedConsignment.photo.image.publicUrl}
                  alt={selectedConsignment.name}
                  sx={{
                    width: "100%",
                    maxHeight: 250, // Giới hạn chiều cao
                    objectFit: "contain", // Đảm bảo ảnh không bị biến dạng
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              )}

              {/* Thông tin chi tiết */}
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Ngày ký gửi:</strong>{" "}
                {selectedConsignment.request?.createAt}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tên cá ký gửi:</strong> {selectedConsignment.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Năm sinh:</strong>{" "}
                {selectedConsignment.birth || "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Giới tính:</strong>{" "}
                {selectedConsignment.sex || "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Kích thước:</strong>{" "}
                {selectedConsignment.size || "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Lịch sử bệnh:</strong>{" "}
                {selectedConsignment.medical || "Không có"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Loại:</strong>{" "}
                {selectedConsignment.category || "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Giá từ trang trại:</strong>{" "}
                {selectedConsignment.price
                  ? `${formatMoney(selectedConsignment.price)}`
                  : "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mô tả:</strong>{" "}
                {selectedConsignment.description || "Không có"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Người gửi:</strong>{" "}
                {selectedConsignment.request?.user?.name || "Không rõ"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Nhân viên xử lý:</strong>{" "}
                {selectedConsignment.request?.staff?.name || "Chưa xử lý"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Trạng thái:</strong>{" "}
                {selectedConsignment.request?.status || "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Giá xác định từ hệ thống:</strong>{" "}
                {selectedConsignment.estimatedPrice
                  ? `${selectedConsignment.estimatedPrice}`
                  : "Chưa cập nhật"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Trạng thái đơn hàng:</strong>{" "}
                {selectedConsignment.status || "Chưa cập nhật"}
              </Typography>

              {/* Lịch sử trạng thái */}
              {selectedConsignment.request?.statusHistory?.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                  >
                    Lịch sử trạng thái:
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    {selectedConsignment.request.statusHistory.map(
                      (history) => (
                        <Box key={history.id} sx={{ mb: 1 }}>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Thời gian:</strong> {history.changeTime}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Người thay đổi:</strong>{" "}
                            {history.changedBy?.name || "Không rõ"}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Trạng thái:</strong> {history.status}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
