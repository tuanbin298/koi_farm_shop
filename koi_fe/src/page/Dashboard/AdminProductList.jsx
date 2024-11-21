import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";
import {
  MenuItem,
  Box,
  Typography,
  Checkbox,
  Button,
  Pagination,
  Modal,
  TextField,
  Select,
  CircularProgress,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import toast, { Toaster } from "react-hot-toast";
import { Image } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { formatMoney } from "../../utils/formatMoney";

import { GET_ALL_PRODUCTS_ADMIN } from "../api/Queries/product";
import { GET_CATEGORY } from "../api/Queries/category";
import { UPDATE_PRODUCT } from "../api/Mutations/updateproduct";
import { DELETE_PRODUCTS } from "../api/Queries/product";
import { GET_PROFILE } from "../api/Queries/user";

export default function AdminProductList() {
  const userId = localStorage.getItem("id");
  // Query
  const {
    data: getProducts,
    refetch: refetchProducts,
    error,
    loading,
  } = useQuery(GET_ALL_PRODUCTS_ADMIN);

  const { data: categoryData, loading: loadingCategories } =
    useQuery(GET_CATEGORY);
  
  const {data: user} = useQuery(GET_PROFILE, {
    variables:{
      where:{
        id: userId
      }
    }
  })
  
  
  const products = getProducts?.products || [];
  const categories = categoryData?.categories || [];

  // Mutation
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProducts] = useMutation(DELETE_PRODUCTS);

  // State
  const [selectAll, setSelectAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = products.slice(startIndex, endIndex) || [];

  // Handle
  const handlePageChange = (event, value) => setPage(value);
  // When check one checkbox
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      alert("Hãy chọn sản phẩm để xoá");
      return;
    }

    try {
      // Call delete mutation
      await deleteProducts({
        variables: {
          where: selectedProducts.map((id) => ({ id })),
        },
      });

      await refetchProducts();
      setSelectedProducts([]);
      toast.success("Xoá sản phẩm thành công");
    } catch (error) {
      toast.error("Lỗi xoá sản phẩm!");
      console.error("Đã xảy ra lỗi khi xoá sản phẩm :", err);
    }
  };

  // When check all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const allProductIds = products.map((product) => product.id);
      setSelectedProducts(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSaveChange = () => {
    if (!isEditing) {
      setOriginalProduct({ ...selectedProduct }); // Lưu giá trị ban đầu khi bắt đầu chỉnh sửa
    } else {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    const dataToUpdate = {};
    if (selectedProduct.name !== originalProduct.name) {
      dataToUpdate.name = selectedProduct.name;
    }
    if (selectedProduct.category?.id !== originalProduct.category?.id) {
      dataToUpdate.category = { connect: { id: selectedProduct.category.id } };
    }
    if (selectedProduct.birth !== originalProduct.birth) {
      dataToUpdate.birth = selectedProduct.birth;
    }
    if (selectedProduct.description !== originalProduct.description) {
      dataToUpdate.description = selectedProduct.description;
    }
    if (selectedProduct.origin !== originalProduct.origin) {
      dataToUpdate.origin = selectedProduct.origin;
    }
    if (selectedProduct.price !== originalProduct.price) {
      dataToUpdate.price = parseInt(selectedProduct.price, 10);
    }
    if (selectedProduct.sex !== originalProduct.sex) {
      dataToUpdate.sex = selectedProduct.sex;
    }
    if (selectedProduct.size !== originalProduct.size) {
      dataToUpdate.size = selectedProduct.size;
    }
    if (selectedProduct.generic !== originalProduct.generic) {
      dataToUpdate.generic = selectedProduct.generic;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      try {
        await updateProduct({
          variables: {
            where: { id: selectedProduct.id },
            data: dataToUpdate,
          },
        });

        await refetchProducts();
        toast.success("Cập nhật sản phẩm thành công");
        handleCloseModal();
      } catch (error) {
        toast.error("Lỗi cập nhật sản phẩm!");
        console.error("Đã xảy ra lỗi khi cập nhật sản phẩm :", error);
      }
    } else {
      toast("Không có gì thay đổi");
      handleCloseModal();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => {
      if (name === "category") {
        // Find category base on id
        const selectedCategory = categories.find((cat) => cat.id === value);
        return {
          ...prevProduct,
          category: selectedCategory || prevProduct.category,
        };
      } else {
        return {
          ...prevProduct,
          [name]: value,
        };
      }
    });
  };

  useEffect(() => {
    setSelectAll(
      selectedProducts.length === products.length && products.length > 0
    );
  }, [selectedProducts, products]);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setOriginalProduct({ ...product });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
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
        Lỗi tải sản phẩm: {error.message}
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
          Danh sách sản phẩm <ListAltIcon />
        </Typography>
        {selectedProducts.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelectedProducts}
          >
            Xoá sản phẩm
          </Button>
        )}
      </Box>

      <TableContainer
        component={Paper}
        sx={{ marginLeft: "15%", marginTop: "2%", width: "85%" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              
                {user.user.role.name === "Admin"?
                (<TableCell padding="checkbox">
                  <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedProducts.length > 0 &&
                    selectedProducts.length < products.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
                </TableCell>): <TableCell></TableCell>} 
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá sản phẩm</TableCell>
              <TableCell>Kích thước</TableCell>
              <TableCell>Chủng loại</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(product)}
                style={{ cursor: "pointer" }}
              >
                {user.user.role.name === "Admin"?
                (<TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      handleCheckboxChange(product.id);
                    }}
                    disabled={product.status === "Có sẵn" ? false : true}
                    color="primary"
                  />
                </TableCell>):
                (<TableCell></TableCell>)}
                
                <TableCell>
                  <Image
                    width={100}
                    src={product.photo?.image?.publicUrl || ""}
                    preview={false}
                  />{" "}
                  {product.name}
                </TableCell>
                <TableCell>{formatMoney(product.price)}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.generic}</TableCell>
                <TableCell>{product?.category?.name}</TableCell>
                <TableCell>{product?.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          display="flex"
          justifyContent="center"
          marginTop={2}
          sx={{
            marginBottom: "2%",
          }}
        >
          <Pagination
            count={Math.ceil(products.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </TableContainer>

      {/* Modal for Product Details */}
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
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              maxHeight: "70vh", // Chiều cao tối đa
            }}
          >
            {selectedProduct && (
              <>
                <Typography
                  id="modal-title"
                  variant="h5"
                  component="h2"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Chi Tiết Sản Phẩm
                </Typography>
                {isEditing ? (
                  <>
                    <Box
                      component="img"
                      src={selectedProduct.photo?.image?.publicUrl}
                      alt={selectedProduct.name}
                      sx={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                        mb: 2,
                      }}
                    />
                    <TextField
                      label="Tên"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Giá"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Select
                      label="Loại"
                      name="category"
                      value={selectedProduct.category?.id || ""}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "category", value: e.target.value },
                        })
                      }
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>

                  <TextField
                    label="Mô tả"
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Chủng loại"
                    name="generic"
                    value={selectedProduct.generic}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Trạng thái"
                    name="status"
                    value={selectedProduct.status}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Nguồn cung"
                    name="origin"
                    value={selectedProduct.origin}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={selectedProduct.photo?.image?.publicUrl}
                    alt={selectedProduct.name}
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />
                  <Typography>
                    <strong>Tên:</strong> {selectedProduct.name}
                  </Typography>
                  <Typography>
                    <strong>Giá:</strong> {formatMoney(selectedProduct.price)}
                  </Typography>
                  <Typography>
                    <strong>Kích thước:</strong> {selectedProduct.size}
                  </Typography>
                  <Typography>
                    <strong>Loại:</strong>{" "}
                    {selectedProduct?.category?.name || "Chưa cập nhật"}
                  </Typography>
                  <Typography>
                    <strong>Mô tả:</strong>{" "}
                    {selectedProduct.description || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Chủng loại:</strong>{" "}
                    {selectedProduct.generic || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Trạng thái:</strong> {selectedProduct.status}
                  </Typography>
                  <Typography>
                    <strong>Nguồn cung:</strong>{" "}
                    {selectedProduct.origin || "Không có"}
                  </Typography>
                </>
              )}
              {user.user.role.name==="Admin"?
              (<Box
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
              </Box>):
            (<></>)}
              
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
