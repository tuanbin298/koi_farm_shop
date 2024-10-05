import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField
} from '@mui/material';
import './CartPage.css';
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Flex, Radio, Slider } from 'antd';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FaShoppingCart } from "react-icons/fa";
import { Image } from 'antd';
const CartPage = () => {
  // Define products dynamically
  const products = [
    { id: 1, image: 'src/assets/kohaku.jpg',name: 'Cá koi showa sanshoku', quantity: 3, price: 2500000, total: 7500000 },
    { id: 2, image: 'src/assets/kohaku.jpg',name: 'Cá koi kohaku', quantity: 2, price: 3000000, total: 6000000 }
  ];

  // Manage deposit fields state
  const [depositFields, setDepositFields] = useState({});

  // Toggle deposit fields visibility for each product
  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Render table rows
  return (
    <div className="cart-container">
      <section className="back-button-section">
      <div className="icon-container">
        <FaArrowLeft className="icon" />
      </div>
      <span className="back-button-text"><Link to="/productList">Tiếp tục mua hàng/Quay lại trang chủ</Link></span>
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
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="center">Ký gửi nuôi</TableCell>
                  <TableCell align="center">Giá/Sản phẩm (VND)</TableCell>
                  <TableCell align="center">Thành tiền (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Image
                          width={200}
                          src={product.image}
                        />
                          {product.name}
                        </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={depositFields[product.id] || false}
                          onChange={() => handleDepositToggle(product.id)}
                        />
                        <p>Ký gửi nuôi</p>
                      </TableCell>
                      <TableCell align="center">{product.price.toLocaleString()}</TableCell>
                      <TableCell align="center">{product.total.toLocaleString()}</TableCell>
                    </TableRow>
                    {depositFields[product.id] && (
                      <TableRow>
                        <TableCell colSpan={5} className="deposit-fields">
                          <div className="deposit-fields-container">
                            <TextField
                              label="Số lượng ký gửi"
                              type="number"
                              InputProps={{ inputProps: { min: 0, max: product.quantity } }}
                              variant="outlined"
                              className="deposit-input"
                            />                           
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
      display="flex" // Enables flexbox layout
      flexDirection="column" // Stack items vertically
      alignItems="flex-end" // Center-aligns items horizontally
      justifyContent="center" // Center-aligns items vertically
      padding={2} // Adds padding around the section
    >
      {/* Total label */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Tổng tiền
      </Typography>

      {/* Total price */}
      <Typography variant="h5" color="textSecondary">
        5.000.000 đ
      </Typography>
    </Box>
    <Box>
      <Flex justify='flex-end'>
      <Button variant="contained" color="success">Tiến hành thanh toán <FaShoppingCart /></Button>
      </Flex>  
    </Box>
        </section>
      </main>

    </div>
  );
};

export default CartPage;
