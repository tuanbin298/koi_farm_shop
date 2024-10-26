import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField, Box, Typography, Button, Pagination
} from '@mui/material';
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Image } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART_ITEMS } from '../api/Queries/cartItem';
import { DELETE_CART_ITEM } from '../api/Mutations/deletecartItem';
import { formatMoney } from "../../utils/formatMoney";
import './CartPage.css';

const CartPage = () => {
  const userId = localStorage.getItem("id");
  let totalPrice = 0;

  const [depositFields, setDepositFields] = useState({});
  const [isLoading] = useState(false);
  const [deleteError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const itemsPerPage = 3; // Items per page

  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);

  const { loading, error, data, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });
  console.log(data);

  useEffect(() => {
    refetchItems();
  }, [refetchItems]);

  // Calculate the total price
  data?.cartItems?.forEach((cartItem) => {
    if (cartItem.product.length > 0) {
      totalPrice += cartItem.product[0].price;
    } else if (cartItem.consignmentProduct) {
      totalPrice += cartItem.consignmentProduct[0].price;
    }
  });

  // Handle delete cart item
  const handleDelete = async (cartItemId) => {
    try {
      await deleteCartItem({
        variables: {
          where: {
            id: cartItemId,
          }
        }
      });

      refetchItems();
      window.dispatchEvent(new Event("cartUpdated"));  // Custom event
    } catch (err) {
      console.error("Delete fail: ", err);
    }
  };

  // Handle deposit toggle
  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Handle pagination page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Pagination logic - slice the data to show items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = data?.cartItems?.slice(startIndex, endIndex) || [];

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p>Lỗi khi tải giỏ hàng!</p>;
  // Xử lý tiếp tục đến trang dịch vụ ký gửi
  const handleProceedToFishCareService = () => {
    const selectedProducts = data?.cartItems?.filter(item => depositFields[item.id]) || [];
    return (
      <Link to="/fishcareservice" state={{ selectedProducts }}> {/* Truyền sản phẩm đã chọn */}
        <Button variant="contained" color="primary">
          Tiếp tục Ký gửi
        </Button>
      </Link>
    );
  };
  return (
    <div className="cart-container">
      <section className="back-button-section">
        <div className="icon-container">
          <FaArrowLeft className="icon" />
        </div>
        <span className="back-button-text">
          <Link to="/koiList">Tiếp tục mua hàng / Quay lại trang chủ</Link>
        </span>
      </section>

      <main className="cart-content">
        <section>
          <h2>Giỏ hàng</h2>
          <TableContainer component={Paper}>
            <Table aria-label="cart table">
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="center">Ký gửi nuôi</TableCell>
                  <TableCell align="center">Thành tiền (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems.map((cartItem) => (
                  cartItem && (
                    <React.Fragment key={cartItem.id}>
                      <TableRow>
                        <TableCell>
                          <Image
                            width={200}
                            src={cartItem.product.length > 0
                              ? cartItem.product[0].image?.publicUrl || ''
                              : cartItem.consignmentProduct[0]?.photo?.image?.publicUrl || ''}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {cartItem.product.length > 0
                            ? cartItem.product[0]?.name
                            : cartItem.consignmentProduct[0]?.name}
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={depositFields[cartItem.id] || false}
                            onChange={() => handleDepositToggle(cartItem.id)}
                          />
                          <p>Ký gửi nuôi</p>
                        </TableCell>
                        <TableCell align="center">
                          {formatMoney(cartItem.product.length > 0
                            ? cartItem.product[0]?.price
                            : cartItem.consignmentProduct[0]?.price)}
                          <Button
                            variant="contained"
                            color="error"
                            style={{ marginLeft: "15%" }}
                            onClick={() => handleDelete(cartItem.id)}
                            disabled={isLoading}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                ))}

              </TableBody>
            </Table>
          </TableContainer>

          {deleteError && (
            <p style={{ color: 'red' }}>Lỗi: {deleteError}</p>
          )}

          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil((data?.cartItems?.length || 0) / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end" padding={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng tiền
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {formatMoney(totalPrice)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            {Object.values(depositFields).some((isSelected) => isSelected) ? (
              handleProceedToFishCareService() // Gọi hàm để lấy liên kết với sản phẩm đã chọn
            ) : (
              <Button variant="contained" color="success">
                {data.cartItems.length <= 0 ?
                  (<Link to="/cart">Tiến hành thanh toán <FaShoppingCart /></Link>) :
                  (<Link to="/checkout">Tiến hành thanh toán <FaShoppingCart /></Link>)}
              </Button>
            )}
          </Box>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
