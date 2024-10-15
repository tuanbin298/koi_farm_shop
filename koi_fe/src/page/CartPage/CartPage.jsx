import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField, Box, Typography, Button
} from '@mui/material';
import { FaArrowLeft } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
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
  const [isLoading] = useState(false); // Loading state
  const [deleteError] = useState(null); // Error state

  // Xoá sản phẩm khỏi giỏ hàng
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
    } catch (err) {
      console.error("Delete fail: ", err)
    }
  };

  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);

  const { loading, error, data, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });

  useEffect(() => {
    refetchItems(); // Cập nhật danh sách khi component được render
  }, [refetchItems]);

  // Tính tổng giá tiền
  data?.cartItems?.forEach((cartItem) => {
    totalPrice += cartItem.product[0].price;
  });

  // Toggle ký gửi nuôi
  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p>Lỗi khi tải giỏ hàng!</p>;

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
          <h3>Danh sách sản phẩm</h3>

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
                {data?.cartItems?.map((cartItem) => (
                  cartItem && cartItem.product[0] && (
                    <React.Fragment key={cartItem.id}>
                      <TableRow>
                        <TableCell>
                          <Image
                            width={200}
                            src={cartItem.product[0].image?.publicUrl || ''}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {cartItem.product[0].name}
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={depositFields[cartItem.id] || false}
                            onChange={() => handleDepositToggle(cartItem.id)}
                          />
                          <p>Ký gửi nuôi</p>
                        </TableCell>
                        <TableCell align="center">
                          {formatMoney(cartItem.product[0].price)}
                          <Button
                            variant="contained"
                            color="error"
                            style={{ marginLeft: "15%" }}
                            onClick={() => handleDelete(cartItem.id)}
                            disabled={isLoading} // Khoá nút khi đang xoá
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>

                      {depositFields[cartItem.id] && (
                        <TableRow>
                          <TableCell colSpan={5} className="deposit-fields">
                            <div className="deposit-fields-container">
                              <TextField
                                label="Ngày kết thúc"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                className="deposit-input"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {deleteError && (
            <p style={{ color: 'red' }}>Lỗi: {deleteError}</p> // Hiển thị lỗi nếu có
          )}

          <Box display="flex" flexDirection="column" alignItems="flex-end" padding={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng tiền
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {formatMoney(totalPrice)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="success">
              <Link to="/checkout">Tiến hành thanh toán <FaShoppingCart /></Link>
            </Button>
          </Box>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
