import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";

import { formatMoney } from "../../utils/formatMoney";
import { formatDate, formatTime } from "../../utils/formatDateTime";

import { GET_ALL_CONSIGNMENT_SALES_ADMIN } from "../api/Queries/consignment";
import { UPDATE_CONSIGNMENT_PRODUCT_ADMIN } from "../api/Mutations/updateproduct";

export default function ConsignmentSaleList() {
  const { data, error, loading, refetch } = useQuery(
    GET_ALL_CONSIGNMENT_SALES_ADMIN
  );
  const [updateConsignmentSale, { loading: updating }] = useMutation(
    UPDATE_CONSIGNMENT_PRODUCT_ADMIN
  );

  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [originalConsignment, setOriginalConsignment] = useState(null);
  const [selectedConsignments, setSelectedConsignments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const consignments = data?.consignmentSales || [];

  const handleCheckboxChange = (id) => {
    setSelectedConsignments((prev) =>
      prev.includes(id)
        ? prev.filter((consignmentId) => consignmentId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedConsignments([]);
    } else {
      setSelectedConsignments(consignments.map((c) => c.id));
    }
    setSelectAll(!selectAll);
  };

  const handleRowClick = (consignment) => {
    setSelectedConsignment(consignment);
    setOriginalConsignment({ ...consignment });
    setOpenModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedConsignment(null);
    setOriginalConsignment(null);
  };

  const handleInputChange = (field, value) => {
    setSelectedConsignment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSaveChange = () => {
    if (!isEditing) {
      setOriginalConsignment({ ...selectedConsignment }); // Lưu giá trị ban đầu khi bắt đầu chỉnh sửa
    } else {
      saveChanges(); // Gọi hàm thực hiện cập nhật khi nhấn "Lưu"
    }
    setIsEditing(!isEditing);
  };
  const saveChanges = async () => {
    if (!selectedConsignment || !originalConsignment) return;

    const consignmentId = selectedConsignment.id;
    const requestId = selectedConsignment.request?.id;
    const dataToUpdate = {};

    if (selectedConsignment.price !== originalConsignment.price) {
      dataToUpdate.price = parseInt(selectedConsignment.price, 10);
    }
    if (
      selectedConsignment.request?.status !==
      originalConsignment.request?.status
    ) {
      dataToUpdate.statusRequest = selectedConsignment.request?.status;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }

    try {
      await updateConsignmentSale({
        variables: {
          consignmentId,
          requestId,
          newPrice: dataToUpdate.price,
          newStatus: dataToUpdate.statusRequest,
        },
      });
      alert("Cập nhật thành công!");
      setOpenModal(false);
      refetch();
    } catch (error) {
      console.error("Error updating consignment:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      console.log("Deleting selected consignments:", selectedConsignments);
      // TODO: Implement delete mutation here
      refetch();
    } catch (error) {
      console.error("Error deleting consignments:", error);
      alert("Đã xảy ra lỗi khi xóa.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading consignments</Typography>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          ml: "15%",
          mt: "5%",
        }}
      >
        <Typography variant="h4">
          Danh sách yêu cầu ký gửi <ListAltIcon />
        </Typography>
        {selectedConsignments.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
          >
            Xóa đã chọn
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
              <TableCell>Ngày | Giờ ký gửi</TableCell>
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
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(consignment)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedConsignments.includes(consignment.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      handleCheckboxChange(consignment.id);
                    }}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(consignment.request?.createAt)} |{" "}
                  {formatTime(consignment.request?.createAt)}
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
            boxShadow: 24,
            borderRadius: 2,
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          {/* Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Button
              onClick={handleCloseModal}
              variant="text"
              sx={{ color: "red", textTransform: "none" }}
            >
              <CloseIcon />
              Đóng
            </Button>
          </Box>

          {selectedConsignment && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Chi Tiết Yêu Cầu Ký Gửi Bán
              </Typography>

              {/* Editable Fields */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông Tin Cá
                </Typography>
                {selectedConsignment.photo?.image?.publicUrl && (
                  <Box
                    component="img"
                    src={selectedConsignment.photo.image.publicUrl}
                    alt={selectedConsignment.name}
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  />
                )}
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
                  <strong>Mô tả:</strong>{" "}
                  {selectedConsignment.description || "Không có"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Trạng thái:</strong>{" "}
                  {selectedConsignment.status || "Chưa cập nhật"}
                </Typography>
              </Box>

              {/* Consignment Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông Tin Ký Gửi
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Người gửi:</strong>{" "}
                  {selectedConsignment.request?.user?.name || "Không rõ"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Ngày | Giờ ký gửi:</strong>{" "}
                  {formatDate(selectedConsignment.request?.createAt)} |{" "}
                  {formatTime(selectedConsignment.request?.createAt)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Nhân viên xử lý:</strong>{" "}
                  {selectedConsignment.request?.staff?.name || "Chưa xử lý"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Giá xác định từ hệ thống:</strong>{" "}
                  {selectedConsignment.estimatedPrice
                    ? `${formatMoney(
                        selectedConsignment.estimatedPrice.split(" - ")[0]
                      )} - ${formatMoney(
                        selectedConsignment.estimatedPrice.split(" - ")[1]
                      )}`
                    : "Chưa cập nhật"}
                </Typography>
                {isEditing ? (
                  <>
                    {/* Editable Fields */}
                    <TextField
                      label="Giá tiền"
                      fullWidth
                      value={selectedConsignment.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="status-label" shrink>
                        Trạng thái yêu cầu
                      </InputLabel>
                      <Select
                        labelId="status-label"
                        value={selectedConsignment.request?.status || ""}
                        onChange={(e) =>
                          handleInputChange("request", {
                            ...selectedConsignment.request,
                            status: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="Chờ phê duyệt">Chờ phê duyệt</MenuItem>
                        <MenuItem value="Hủy phê duyệt">Hủy phê duyệt</MenuItem>
                        <MenuItem value="Xác nhận phê duyệt">
                          Xác nhận phê duyệt
                        </MenuItem>
                        <MenuItem value="Xác nhận giao dịch">
                          Xác nhận giao dịch
                        </MenuItem>
                        <MenuItem value="Huỷ giao dịch">Huỷ giao dịch</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <>
                    {/* Read-Only Display */}
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Giá tiền:</strong>{" "}
                      {formatMoney(selectedConsignment.price || 0)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Trạng thái yêu cầu:</strong>{" "}
                      {selectedConsignment.request?.status || "Không rõ"}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Status History */}
              {selectedConsignment.request?.statusHistory?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                  >
                    Lịch sử trạng thái:
                  </Typography>
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxHeight: 200, // Scrollable if content exceeds height
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <Table
                      stickyHeader
                      size="small"
                      aria-label="status history table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Thời gian</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Người thay đổi</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Trạng thái</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedConsignment.request.statusHistory.map(
                          (history) => (
                            <TableRow key={history.id}>
                              <TableCell>
                                {formatDate(history.changeTime)} |{" "}
                                {formatTime(history.changeTime)}
                              </TableCell>
                              <TableCell>
                                {history.changedBy?.name || "Không rõ"}
                              </TableCell>
                              <TableCell>{history.status}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                  borderTop: "1px solid #ddd",
                }}
              >
                <Button variant="contained" onClick={handleSaveChange}>
                  <UpdateIcon />
                  {isEditing ? "Lưu" : "Cập Nhật"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
