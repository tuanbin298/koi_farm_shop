import React, {useState} from 'react'
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./Checkout.css"
import { Button, Flex, Radio,  Space, Image } from 'antd';
import {Link} from "react-router-dom"
import {CREATE_ORDER} from ".././api/Mutations/order"
import {CREATE_ORDER_ITEMS} from ".././api/Mutations/orderItem"
import { useMutation, useQuery } from '@apollo/client';
import { GET_CART_ITEMS } from '../api/Queries/cartItem';
import { DELETE_CART_ITEM } from '../api/Mutations/deletecartItem';
import toast, { Toaster } from "react-hot-toast";
import { formatMoney } from "../../utils/formatMoney";
import { List, ListItem, ListItemText, Divider, Typography, ListItemAvatar, Avatar
  , Pagination
 } from '@mui/material';
export default function Checkout() {
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const userId = localStorage.getItem("id");
  const [orderItemsData, setOrderItemsData] = useState([])
  const { loading, error, data: cartItems, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });

  const [createOrder] = useMutation(CREATE_ORDER);
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS);

  const [name, setName] = useState(localStorage.getItem("name") || '');
  const [email, setEmail] = useState(localStorage.getItem("email") || '');
  const [phone, setPhone] = useState(localStorage.getItem("phone") || '');
  const [address, setAddress] = useState(localStorage.getItem("address") || '');

  const checkoutOption1 = [
    { label: 'Thanh toán bằng thẻ tín dụng', value: 'creditCard' },
    { label: 'Thanh toán khi nhận hàng(đặt cọc 50%)', value: 'cod' }
  ];

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };
  let totalPrice = 0;
  cartItems?.cartItems?.forEach((cartItem) => {
    totalPrice += cartItem.product[0].price;
  });
  const handleCreateOrder = async () => {
    if(cartItems.cartItems.length <= 0){
      toast.error("Lỗi tạo đơn hàng!");
    }
    else{
    try {
      // Create Order
      const { data } = await createOrder({
        variables: {
          data: {
            user: {
              connect: { id: userId },
            },
            price: totalPrice,
            // address: `${orderData.address}, ${orderData.city}, ${orderData.district}, ${orderData.ward}`,
            address: `${orderData.address}, ${orderData.city}, ${orderData.district}, ${orderData.ward}`,
          },
        },
      });

      const orderId = data.createOrder.id;
      // Create Order Items (replace with actual items from cart)
      // setOrderItemsData(cartItems)
      // console.log(cartItems);
      // await createOrderItems({
      //   variables: {
      //     data: cartItems,
      //   },
      // });
      const orderItems = cartItems.cartItems.map((item) => ({
        product: { connect: { id: item.product[0].id } },
        order: { connect: { id: orderId } },
        quantity: 1,
        price: item.product[0].price, // Assuming price is stored in the cart item
      }));

      // Create the order items
      await createOrderItems({
        variables: {
          data: orderItems,
        },
      });

      for (let i = 0; i < cartItems.cartItems.length; i++) {
        const cartItemId = cartItems.cartItems[i].id;
        await deleteCartItem({
          variables: {
            where: { id: cartItemId },
          },
        });
      }
      toast.success('Đã tạo đơn hàng!')
    } catch (error) {
      console.log(orderItemsData)
      console.error("Error creating order:", error);
      toast.error("Lỗi tạo đơn hàng!");
    }
  }
  };
  const [page, setPage] = useState(1); // Current page
  const itemsPerPage = 3; // Items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = cartItems?.cartItems?.slice(startIndex, endIndex) || [];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      <div className='checkOutInfo' style={{ padding: "20px" }}>
        <section className="TitleSection">
          <h3>Thông tin giao/nhận hàng</h3>
        </section>
        <Box>
          <Flex gap="large">
            <TextField
              id="name"
              label="Họ và tên"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "40%" }}
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "30%" }}
            />
            <TextField
              id="phone"
              label="Số điện thoại"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "25%" }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="address"
              label="Địa chỉ"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "98%" }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField 
              id="outlined-basic" 
              label="Nhập tỉnh/thành" 
              variant="outlined" 
              style={{ width: "25%" }} 
              name="city" 
              onChange={handleInputChange} 
            />
            <TextField 
              id="outlined-basic" 
              label="Nhập quận/huyện" 
              variant="outlined" 
              style={{ width: "25%" }} 
              name="district" 
              onChange={handleInputChange} 
            />
            <TextField 
              id="outlined-basic" 
              label="Nhập phường/xã" 
              variant="outlined" 
              style={{ width: "25%" }} 
              name="ward" 
              onChange={handleInputChange} 
            />
          </Flex>
        </Box>

        <Flex justify="space-between">
          <div className="checkoutSection">
            <section className="TitleFlexSection">
              <h3>Phương thức thanh toán</h3>
            </section>
            <Flex direction="column" gap="middle">
              <Radio.Group onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value })}>
                <Space direction="vertical">
                  <Radio value="creditCard">Thanh toán bằng thẻ tín dụng</Radio>
                  <Radio value="cod">Thanh toán khi nhận hàng(đặt cọc 50%)</Radio>
                </Space>
              </Radio.Group>
            </Flex>
          </div>

          <div className="OrderSection">
            <section className="OrderTitleSection">
              <h3>Thông tin đơn hàng</h3>
            </section>
            <List>
              {paginatedItems.map((item, index) => (
                <div key={index}>
                  <ListItem>
                  <ListItemAvatar>
                  <Image
                            width={75}
                            src={item.product[0].image?.publicUrl || ''}
                          />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product[0].name}  // Assuming product[0] has a name
                      secondary={`Giá: ${item.product[0].price} VND`}
                    />
                  </ListItem>
                  <Divider />
                  
                </div>
              ))}
              <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil((cartItems?.cartItems?.length || 0) / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
              {cartItems?.cartItems?.length === 0 && (
                <Typography variant="body2">Giỏ hàng trống</Typography>
              )}
            </List>
          </div>
        </Flex>

        <Flex style={{ marginTop: "6%", justifyContent: "space-between", padding: "15px" }}>
          <div>
            <Link to="/cart">
              <Button color="danger" variant="solid" style={{ padding: "20px", fontSize: "20px" }}>
                Quay lại giỏ hàng
              </Button>
            </Link>
          </div>
          <div>
            <Button variant='solid' style={{
              backgroundColor: "green",
              color: "white",
              padding: "20px",
              fontSize: "20px"
            }}
              onClick={() => {
                // Lưu dữ liệu vào localStorage (nếu cần)
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
                localStorage.setItem("phone", phone);
                localStorage.setItem("address", address);
                alert("Thông tin đã được lưu!");
              }}>
              Đặt hàng
            </Button>
          </div>
        </Flex>
      </div>
    </>
  );
}
