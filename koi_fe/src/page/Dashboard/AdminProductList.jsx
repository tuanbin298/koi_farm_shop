import React, { useState, useEffect } from "react";
import { GET_ALL_PRODUCTS_ADMIN } from "../api/Queries/product";
import { useMutation, useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UpdateIcon from "@mui/icons-material/Update";
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
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Image } from "antd";
import { formatMoney } from "../../utils/formatMoney";
import { GET_CATEGORY } from "../api/Queries/category";
import { UPDATE_PRODUCT } from "../api/Mutations/updateproduct";
import { DELETE_PRODUCTS } from "../api/Queries/product";
export default function AdminProductList() {
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const {
    data: getProducts,
    refetch: refetchProducts,
    error,
    loading,
  } = useQuery(GET_ALL_PRODUCTS_ADMIN);

  const { data: categoryData, loading: loadingCategories } =
    useQuery(GET_CATEGORY);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [deleteProducts] = useMutation(DELETE_PRODUCTS)
  const products = getProducts?.products || [];
  const categories = categoryData?.categories || [];
  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = products.slice(startIndex, endIndex) || [];

  const handlePageChange = (event, value) => setPage(value);
  {
    /*When check one checkbox */
  }
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };
  
  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      alert("No products selected for deletion!");
      return;
    }

    try {
      // Call delete mutation
      await deleteProducts({
        variables: {
          where: selectedProducts.map((id) => ({ id })),
        },
      });

      // Refetch products
      await refetchProducts();

      // Clear selected products
      setSelectedProducts([]);

      alert("Selected products deleted successfully!");
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("An error occurred while deleting products.");
    }
  };

  {
    /*When check all checkbox */
  }
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
      saveChanges(); // Gọi hàm thực hiện cập nhật khi nhấn "Lưu"
    }
    setIsEditing(!isEditing);
  };

  // Hàm cập nhật sản phẩm
  const saveChanges = async () => {
    setOpenModal(false);

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
        alert("Sản phẩm đã được cập nhật thành công!");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Ko có gì thay đổi");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => {
      if (name === "category") {
        // Tìm đối tượng category đầy đủ dựa trên id
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
  console.log(selectedProducts)
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading products</Typography>;

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
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedProducts.length > 0 &&
                    selectedProducts.length < products.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      handleCheckboxChange(product.id);
                    }}
                    disabled={product.status === "Có sẵn"?false:true}
                    color="primary"
                  />
                </TableCell>
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
            width: 500,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          {selectedProduct && (
            <>
              <Typography
                id="modal-title"
                variant="h4"
                component="h2"
                sx={{ mb: 2 }}
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
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
