import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField
} from '@mui/material';
import './CartPage.css';
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FaShoppingCart } from "react-icons/fa";
import { Image } from 'antd';
import { useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from '../api/Queries/cartItem';
import { formatMoney } from "../../utils/formatMoney";
import {Flex} from "antd"
const CartPage = () => {
  const userId = localStorage.getItem("id");
  let totalPrice = 0;
  const [depositFields, setDepositFields] = useState({});

  const { loading, error, data, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
      },
    },
  });
  //refetch when a new item is added
  useEffect(() => {
    refetchItems();
  }, [refetchItems]);
  //calculate total price in the cart
  data?.cartItems?.map((cartItem) => (
    totalPrice = totalPrice + cartItem.product[0].price
  ));

  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Handle loading and error states
  if (loading) return <p>Loading cart items...</p>;
  if (error) return <p>Error loading cart items!</p>;

  return (
    <div className="cart-container">
      <section className="back-button-section">
        <div className="icon-container">
          <FaArrowLeft className="icon" />
        </div>
        <span className="back-button-text">
          <Link to="/koiList">Tiếp tục mua hàng/Quay lại trang chủ</Link>
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
                {/* Directly iterate over cartItems and access `publicUrl` inline */}
                {data?.cartItems?.map((cartItem) => (
                  cartItem && cartItem.product[0] && (
                    <React.Fragment key={cartItem.id}>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {/* Access publicUrl directly */}
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
                          >
                            xoá
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

          <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center" padding={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng tiền
            </Typography>
            <Typography variant="h5" color="textSecondary">
              {formatMoney(totalPrice)}
            </Typography>
          </Box>

          <Box>
            <Flex justify="flex-end">
            <Button variant="contained" color="success">
              <Link to="/checkout">Tiến hành thanh toán <FaShoppingCart /></Link>
            </Button>
            </Flex>
          </Box>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
