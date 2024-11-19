// File: src/components/CreateProductForm.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "../../api/Mutations/product";
import { GET_CATEGORY } from "../../api/Queries/category";
import toast, { Toaster } from "react-hot-toast";
import { GET_ALL_PRODUCTS_ADMIN } from "../../api/Queries/product";
export default function CreateProductForm({ setSelectedSection }) {
  const { data: categoryData, loading, error } = useQuery(GET_CATEGORY);
  const {
    data: getProducts,
    refetch: refetchProducts,
  } = useQuery(GET_ALL_PRODUCTS_ADMIN);
  const [createProduct] = useMutation(CREATE_PRODUCT);

  const [productData, setProductData] = useState({
    name: "",
    birth: "",
    sex: "",
    size: "",
    description: "",
    generic: "",
    origin: "",
    category: "",
    status: "",
    price: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };
  const validateForm = () => {
    const newErrors = {};
    const priceRegex = /^\d+(\.\d{1,2})?$/; // Allows only positive numbers with up to two decimals
    const currentYear = new Date().getFullYear(); //Get current year to check validation of birth year
    // Check for empty fields
    //validate name
    if (!productData.name) newErrors.name = "Tên sản phẩm không được để trống";
    //validate birth year
    if (!productData.birth) newErrors.birth = "Năm sinh không được để trống";
    if (parseInt(productData.birth) < 0) newErrors.birth = "Năm sinh không được âm";
    if (parseInt(productData.birth) > currentYear) {
      newErrors.birth = `Năm sinh không được lớn hơn năm hiện tại (${currentYear})`;
    }
    //validate sex
    if (!productData.sex) newErrors.sex = "Giới tính không được để trống";
    //validate product size
    if (!productData.size) newErrors.size = "Kích thước không được để trống";
    //validate price
    if (!productData.price) newErrors.price = "Giá không được để trống";
    else if (!priceRegex.test(productData.price) || parseFloat(productData.price) <= 0) {
      newErrors.price = "Giá không được âm";
    }
    //validate origin
    if (!productData.origin) newErrors.origin = "Nguồn cung không được để trống";
    //validate generic
    if (!productData.generic) newErrors.generic = "Chủng loại không được để trống";
    //validate image
    if (!productData.image) newErrors.image = "Chưa có hình ảnh";
    //validate category
    if (!productData.category) newErrors.category = "Loại không được để trống";
    //validate status
    if (!productData.status) newErrors.status = "Trạng thái không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createProduct({
        variables: {
          name: productData.name,
          birth: parseInt(productData.birth, 10),
          sex: productData.sex,
          size: productData.size,
          description: productData.description,
          generic: productData.generic,
          origin: productData.origin,
          category: { connect: { id: productData.category } },
          status: productData.status,
          price: parseInt(productData.price, 10),
          image: productData.image,
        },
      });
      await refetchProducts();
      toast.success("thêm sản phẩm thành công");
      setSelectedSection("products");
    } catch (err) {
      toast.error("Lỗi tạo sản phẩm!")
      console.error("Đã xảy ra lỗi khi tạo sản phẩm:", err);
    }
    // console.log(productData);
  };

  return (
    <><Toaster position="top-center" reverseOrder={false} />
    <Box sx={{ display: "flex", marginLeft: "15%" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, padding: 5, marginRight: "10%" }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Thêm sản phẩm
        </Typography>

        <Paper elevation={3} sx={{ padding: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
              }}
            >
              {/* Cá Koi Name */}
              <TextField
                fullWidth
                label="Cá Koi"
                variant="outlined"
                name="name"
                value={productData.name}
                onChange={handleChange}
                sx={{ mr: 2 }}
                error={!!errors.name}
                helperText={errors.name}
              />

              {/* Năm Sinh */}
              <TextField
                fullWidth
                type="number"
                label="Năm Sinh"
                variant="outlined"
                name="birth"
                value={productData.birth}
                onChange={handleChange}
                error={!!errors.birth}
                helperText={errors.birth}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
              }}
            >
              {/* Giới Tính */}
              <FormControl fullWidth sx={{ mr: 2 }} error={!!errors.sex}>
                <InputLabel>Giới Tính</InputLabel>
                <Select
                  name="sex"
                  value={productData.sex}
                  onChange={handleChange}
                >
                  <MenuItem value="Đực">Đực</MenuItem>
                  <MenuItem value="Cái">Cái</MenuItem>
                </Select>
              </FormControl>

              {/* Kích Thước */}
              <FormControl fullWidth error={!!errors.size}>
                <InputLabel>Kích Thước</InputLabel>
                <Select
                  name="size"
                  value={productData.size}
                  onChange={handleChange}
                >
                  <MenuItem value="20cm">20cm</MenuItem>
                  <MenuItem value="30cm">30cm</MenuItem>
                  <MenuItem value="40cm">40cm</MenuItem>
                  <MenuItem value="50cm">50cm</MenuItem>
                  <MenuItem value="60cm">60cm</MenuItem>
                  <MenuItem value="70cm">70cm</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Giá */}
            <TextField
              fullWidth
              label="Giá"
              variant="outlined"
              name="price"
              type="number"
              value={productData.price}
              onChange={handleChange}
              sx={{ mb: 2 }}
              error={!!errors.price}
                helperText={errors.price}
            />

            {/* Mô Tả */}
            <TextField
              fullWidth
              label="Mô Tả"
              variant="outlined"
              name="description"
              value={productData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
              }}
            >
              {/* Nguồn Cung */}
              <TextField
                fullWidth
                label="Nguồn Cung"
                variant="outlined"
                name="origin"
                value={productData.origin}
                onChange={handleChange}
                sx={{ mr: 2 }}
                error={!!errors.origin}
                helperText={errors.origin}
              />

              {/* Chủng Loại */}
              <TextField
                fullWidth
                label="Chủng Loại"
                variant="outlined"
                name="generic"
                value={productData.generic}
                onChange={handleChange}
                error={!!errors.generic}
                helperText={errors.generic}
              />
            </Box>

            {/* Hình Ảnh */}
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              Upload Hình Ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {/* Loại */}
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
              <InputLabel>Loại</InputLabel>
              <Select
                name="category"
                value={productData.category}
                onChange={handleChange}
              >
                {loading ? (
                  <MenuItem disabled>Đang tải...</MenuItem>
                ) : error ? (
                  <MenuItem disabled>Lỗi tải danh mục</MenuItem>
                ) : (
                  categoryData?.categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Trạng Thái */}
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.status}>
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                name="status"
                value={productData.status}
                onChange={handleChange}
              >
                <MenuItem value="Có sẵn">Có sẵn</MenuItem>
                <MenuItem value="Không có sẵn">Không có sẵn</MenuItem>
              </Select>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#4287f5",
              }}
            >
              Thêm sản phẩm
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
    </>
  );
}
