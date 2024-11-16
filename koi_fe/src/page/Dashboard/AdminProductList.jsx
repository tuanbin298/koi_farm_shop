import React, { useState, useEffect } from "react";
import { GET_ALL_PRODUCTS_ADMIN } from "../api/Queries/product";
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
import { Image } from "antd";
import { formatMoney } from "../../utils/formatMoney";

export default function AdminProductList() {
  const {
    data: getProducts,
    error,
    loading,
  } = useQuery(GET_ALL_PRODUCTS_ADMIN);
  console.log(getProducts);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const products = getProducts?.products || [];
  const handleCheckboxChange = (orderId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const allOrderIds = products.map((order) => order.id);
      setSelectedProducts(allOrderIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(
      selectedProducts.length === products.length && products.length > 0
    );
  }, [selectedProducts, products]);

  const handleDelete = () => {
    console.log("Deleting products with IDs:", selectedProducts);

    const updatedproducts = products.filter(
      (order) => !selectedProducts.includes(order.id)
    );
    getProducts.products = updatedproducts;
    setSelectedProducts([]);
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
        {selectedProducts.length > 0 && (
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
                    selectedProducts.length > 0 &&
                    selectedProducts.length < products.length
                  }
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              </TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá sản phẩm</TableCell>
              <TableCell>Chủng loại</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Image
                    width={100}
                    src={product.photo?.image?.publicUrl || ""}
                  />{" "}
                  {product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatMoney(product.price)}
                </TableCell>
                <TableCell>{product.generic}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
