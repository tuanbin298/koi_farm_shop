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
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Modal,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { formatMoney } from "../../utils/formatMoney";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";

export default function ConsignmentSaleList() {
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

  const [editableData, setEditableData] = useState({
    consignmentPrice: "",
    status: "",
  });

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

  const handleInputChange = (field, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
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
    setEditableData({
      consignmentPrice: consignment.price || "",
      status: consignment.request?.status || "",
    });
    setOpenModal(true);
  };
  const handleUpdate = () => {
    console.log("Dữ liệu đã chỉnh sửa:", editableData);

    // Thêm API hoặc logic cập nhật

    handleCloseModal();
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
                  {formatDate(consignment.request?.createAt.split("T")[0])}{" "}
                  {" | "} {formatTime(consignment.request?.createAt)}
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
                  Chi Tiết Yêu Cầu Ký Gửi Bán
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {/* Hình ảnh */}
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
                {/* Thông tin Ký gửi */}
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
                    {formatDate(
                      selectedConsignment.request?.createAt.split("T")[0]
                    )}{" "}
                    {" | "} {formatTime(selectedConsignment.request?.createAt)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Nhân viên xử lý:</strong>{" "}
                    {selectedConsignment.request?.staff?.name || "Chưa xử lý"}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Giá xác định từ hệ thống:</strong>{" "}
                    {formatMoney(
                      selectedConsignment.estimatedPrice.split(" - ")[0]
                    )}{" "}
                    -{" "}
                    {formatMoney(
                      selectedConsignment.estimatedPrice.split(" - ")[1]
                    )}
                  </Typography>
                  <TextField
                    label="Giá tiền"
                    value={editableData.consignmentPrice || ""}
                    sx={{
                      mb: 3,
                      "& .MuiInputBase-root": {
                        height: "40px",
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange("consignmentPrice", e.target.value)
                    }
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="status-label" shrink>
                      Trạng thái đơn hàng
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      label="Trạng thái đơn hàng"
                      value={editableData.status || ""}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
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
                </Box>

                {/* Lịch sử trạng thái */}
                <Box sx={{ mb: 2 }}>
                  {selectedConsignment.request?.statusHistory?.length > 0 && (
                    <>
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
                                    {formatDate(
                                      history.changeTime.split("T")[0]
                                    )}{" "}
                                    {" | "}
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
                    </>
                  )}
                </Box>
              </>
            )}
            {/* Nút Cập Nhật */}
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
                sx={{ textTransform: "none", fontWeight: "bold" }}
                onClick={() => console.log("Cập nhật thông tin")}
              >
                <UpdateIcon />
                Cập Nhật
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
